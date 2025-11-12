import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../component/layout/Layout';
import './WaitingRoom.css';
import { Box } from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';

import {
  selectAiApi,
  getGameRoomDetailApi,
  leaveGameRoom
} from '../../api/Api';
import { GameRoomDetail, Player, AI } from '../../component/game/GameTypes';

import PlayerSection from '../../component/waiting/PlayerSection';
import GameInfoPanel from '../../component/waiting/GameInfoPanel';
import ChatPanel from '../../component/waiting/ChatPenel';
import { useStompChat } from '../../hooks/useStompChat';
import AiSelectionModal from '../../component/waiting/AiSelectionModal';
import {RootState, AppDispatch} from "../../store/store";
import {fetchAiList} from "../../store/slices/aiSlice";

const WaitingRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [room, setRoom] = useState<GameRoomDetail | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const { aiList, status: aiStatus } = useSelector((state: RootState) => state.ai);
  const user = useSelector((state: RootState) => state.auth.user);
  const currentUserId = user?.userId;

  const { connected, messages, sendChat, sendReady, sendLeave, startGame, selectAi, roomState } = useStompChat({
    roomId: id as string,
    endpoint: '/ws',
    // endpoint: 'http://localhost:8080/ws',
  });

  // 5초마다 방 상태를 갱신하는 polling
  useEffect(() => {
    if (!id) return;

    const fetchRoomData = async () => {
      console.log('[Polling] 방 상태 갱신 시도...', new Date().toLocaleTimeString());
      try {
        const res = await getGameRoomDetailApi(id);
        console.log('[Polling] 방 상태 갱신 성공:', res.data);

        setRoom(res.data);
        const rawPlayers =
            res.data?.players ??
            (res.data as any)?.playerList ??
            (res.data as any)?.participants ??
            [];
        setPlayers(Array.isArray(rawPlayers) ? rawPlayers : []);

      } catch (e) {
        console.error('[Polling] 방 상태 갱신 실패:', e);
        // 방을 찾을 수 없는 경우 (404 등) 로비로 이동
        clearInterval(intervalId);
        navigate(`/`);
      }
    };

    // 초기 데이터 로드
    fetchRoomData();

    // 5초마다 polling
    const intervalId = setInterval(() => {
      fetchRoomData();
    }, 5000);

    // cleanup: 컴포넌트 언마운트 시 interval 정리
    return () => {
      console.log('[Polling] interval 정리');
      clearInterval(intervalId);
    };
  }, [id, navigate, currentUserId]);

  // // 컴포넌트 언마운트 시 방 나가기
  // useEffect(() => {
  //   return () => {
  //     if (room) {
  //       console.log('컴포넌트 언마운트: 방 나가기');
  //       sendLeave();
  //     }
  //   };
  // }, [room, sendLeave]);

  // 브라우저 종료/탭 닫기 시 방 나가기 (여러 이벤트로 확실하게 처리)
  useEffect(() => {
    const handlePageUnload = () => {
      if (room && currentUserId) {
        console.log('[이벤트] 페이지 나가기 감지');

        // 1. WebSocket으로 방 나가기 시도
        try {
          sendLeave();
        } catch (e) {
          console.error('sendLeave 실패:', e);
        }

        // 2. Beacon API로 HTTP 요청 (Content-Type을 명시)
        const blob = new Blob(
            [JSON.stringify({ userId: currentUserId })],
            { type: 'application/json' }
        );
        const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;
        navigator.sendBeacon(`${apiUrl}/api/game-rooms/${room.roomId}/leave`, blob);

        // 3. 동기적 HTTP 요청 (fallback)
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${apiUrl}/api/game-rooms/${room.roomId}/leave`, false); // 동기 요청
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({ userId: currentUserId }));
        } catch (e) {
          console.error('동기 HTTP 요청 실패:', e);
        }
      }
    };

    // beforeunload: 페이지를 벗어날 때
    window.addEventListener('beforeunload', handlePageUnload);

    // pagehide: 페이지가 숨겨질 때 (모바일에서 더 잘 작동)
    window.addEventListener('pagehide', handlePageUnload);

    // visibilitychange: 탭이 백그라운드로 갈 때
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && room && currentUserId) {
        console.log('[이벤트] 페이지 숨김 감지');
        handlePageUnload();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
      window.removeEventListener('pagehide', handlePageUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [room, currentUserId, sendLeave]);

  useEffect(() => {
    console.log(roomState);
    // roomState가 존재할 때 (방 상태 업데이트)
    if (roomState) {
      if (roomState.isDeleted) {
        console.log('방이 삭제되었습니다. 메인 페이지로 이동합니다.');
        navigate(`/lobby/${roomState.gameType}`);
        return;
      }
      // 방 상태 업데이트
      setRoom(roomState);
      const rawPlayers = roomState.players ?? (roomState as any).playerList ?? (roomState as any).participants ?? [];
      setPlayers(Array.isArray(rawPlayers) ? rawPlayers : []);

      // 게임 시작 상태인 경우, 게임 페이지로 이동
      if (roomState.status === 'IN_PROGRESS') {
        console.log('게임이 시작되었습니다. 게임 페이지로 이동합니다.');
        navigate('/game', {
          state: {
            sessionId: roomState.roomId, // 세션 ID로 사용
            player_names: roomState.players.map(p => p.nickname), // 플레이어 이름 목록
            player: currentUserId, // 현재 플레이어 ID
            gameType: roomState.gameType // 게임 타입도 함께 전달
          }
        });
      }
    }

  }, [roomState, navigate, id]);

  // 모달을 열 때 AI 목록을 가져오는 로직 추가
  const handleOpenAiModal = async () => {
    if (aiStatus === 'idle') {
      dispatch(fetchAiList());
    }
    setIsAiModalOpen(true);
  };

  // 모달에서 AI를 선택했을 때 호출될 함수
  const handleSelectAi = async (ai: AI) => {
    if (room) {
      const response = await selectAiApi(room.roomId, Number(ai.aiId))
      console.log(response)
      selectAi(Number(ai.aiId)); // selectAi API 호출
    }
    setIsAiModalOpen(false); // 모달 닫기
  };

  if (!room || !user) return <div>Loading...</div>;

  const handleLeaveRoom = async () => {
    if (room) {
      try {
        // await leaveGameRoom(room.roomId);
        sendLeave();
        navigate(`/lobby/${room.gameType}`);
      } catch (error) {
        console.error('Failed to leave room:', error);
      }
    }
  };

  return (
      <Layout>
        <Box className="waiting-room-container">
          <Box className="top-sections-wrapper">
            <PlayerSection player={players[0]} room={room} />
            <PlayerSection player={players[1]} room={room} />
            <GameInfoPanel
                room={room}
                onSelectAi={handleOpenAiModal} // 함수 변경
                onReady={() => {
                  if (currentUserId !== undefined) {
                    sendReady();
                  }
                }}
                onStartGame={startGame}
                onLeaveRoom={handleLeaveRoom}
            />
          </Box>
          {/*<ChatPanel*/}
          {/*    messages={messages}*/}
          {/*    onSend={(text) => {*/}
          {/*      if (currentUserId !== undefined) {*/}
          {/*        sendChat(currentUserId, text);*/}
          {/*      }*/}
          {/*    }}*/}
          {/*/>*/}
        </Box>
        <AiSelectionModal
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
            gameType={room.gameType}
            aiList={aiList} // aiList prop으로 전달
            onSelectAi={handleSelectAi} // onSelectAi prop으로 전달
        />
      </Layout>
  );
};

export default WaitingRoom;
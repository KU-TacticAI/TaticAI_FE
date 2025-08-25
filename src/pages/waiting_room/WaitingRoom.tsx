import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../component/layout/Layout';
import './WaitingRoom.css';
import { Box } from '@mui/material';
import {useSelector} from 'react-redux';

import {
  selectAiApi,
  getAiListApi,
  getGameRoomDetailApi,
  leaveGameRoom
} from '../../api/Api';
import { GameRoomDetail, Player, AI } from '../../component/game/GameTypes';

import PlayerSection from '../../component/waiting/PlayerSection';
import GameInfoPanel from '../../component/waiting/GameInfoPanel';
import ChatPanel from '../../component/waiting/ChatPenel';
import { useStompChat } from '../../hooks/useStompChat';
import AiSelectionModal from '../../component/waiting/AiSelectionModal';
import {RootState} from "../../store/store";

const WaitingRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<GameRoomDetail | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiList, setAiList] = useState<AI[]>([]); // aiList 상태를 WaitingRoom에서 관리
  const currentUserId = useSelector((state: RootState) => state.auth.user?.userId);

  const { messages, sendChat, sendReady, startGame, selectAi, roomState } = useStompChat({
    roomId: id as string,
    endpoint: 'http://localhost:8080/ws',
  });

  useEffect(() => {
    if (roomState) {
      setRoom(roomState);
      const rawPlayers = roomState.players ?? (roomState as any).playerList ?? (roomState as any).participants ?? [];
      setPlayers(Array.isArray(rawPlayers) ? rawPlayers : []);
    }
  }, [roomState]);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (id) {
        try {
          const res = await getGameRoomDetailApi(id);
          setRoom(res.data);
          const rawPlayers =
              res.data?.players ??
              (res.data as any)?.playerList ??
              (res.data as any)?.participants ??
              [];
          setPlayers(Array.isArray(rawPlayers) ? rawPlayers : []);
        } catch (e) {
          console.error('Failed to fetch room data:', e);
        }
      }
    };
    fetchRoomData();
  }, [id]);

  // 모달을 열 때 AI 목록을 가져오는 로직 추가
  const handleOpenAiModal = async () => {
    if (room?.players) {
      try {
        const playersIdList = room.players.map(player => Number(player.userId));
        // const response = await getAiListsByUserIdsApi({ ids: playersIdList });
        const response = await getAiListApi();
        setAiList(response.data);
      } catch (error) {
        console.error("Failed to fetch AI list:", error);
      }
    }
    setIsAiModalOpen(true);
  };

  // 모달에서 AI를 선택했을 때 호출될 함수
  const handleSelectAi = async (ai: AI) => {
    if (room) {
      const response = await selectAiApi(room.roomId, Number(ai.aiId))
      console.log(response)
      // selectAi(Number(ai.aiId)); // selectAi API 호출
    }
    setIsAiModalOpen(false); // 모달 닫기
  };

  if (!room) return <div>Loading...</div>;

  const handleLeaveRoom = async () => {
    if (room) {
      try {
        await leaveGameRoom(room.roomId);
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
                    sendReady(currentUserId);
                  }
                }}
                onStartGame={startGame}
                onLeaveRoom={handleLeaveRoom}
            />
          </Box>
          <ChatPanel
              messages={messages}
              onSend={(text) => {
                if (currentUserId !== undefined) {
                  sendChat(currentUserId, text);
                }
              }}
          />
        </Box>
        <AiSelectionModal
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
            aiList={aiList} // aiList prop으로 전달
            onSelectAi={handleSelectAi} // onSelectAi prop으로 전달
        />
      </Layout>
  );
};

export default WaitingRoom;
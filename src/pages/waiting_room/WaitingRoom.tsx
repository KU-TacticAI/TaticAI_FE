import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../component/layout/Layout';
import './WaitingRoom.css';
import { Box } from '@mui/material';

import { getGameRoomDetailApi, leaveGameRoom } from '../../api/Api';
import { GameRoomDetail, Player, AI } from '../../component/game/GameTypes';

import PlayerSection from '../../component/waiting/PlayerSection';
import GameInfoPanel from '../../component/waiting/GameInfoPanel';
import ChatPanel from '../../component/waiting/ChatPenel';
import { useStompChat } from '../../hooks/useStompChat';
import AiSelectionModal from '../../component/waiting/AiSelectionModal';

const WaitingRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Changed back to id
  const navigate = useNavigate();
  const [room, setRoom] = useState<GameRoomDetail | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Dummy AI list for now
  const [aiList, setAiList] = useState<AI[]>([
    { aiId: '1', aiName: 'Rookie Bot', description: 'A simple bot for beginners.' },
    { aiId: '2', aiName: 'Chess Master Alpha', description: 'An advanced AI using alpha-beta pruning.' },
    { aiId: '3', aiName: 'Random Mover', description: 'Makes random valid moves.' },
  ]);

  const { messages, sendChat, sendReady, startGame, selectAi, roomState } = useStompChat({
    roomId: id as string,
    endpoint: 'http://localhost:8080/ws',
  });

  useEffect(() => {
    // Update component state when websocket pushes a new room state
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
          // Optionally navigate away or show an error message
        }
      }
    };

    fetchRoomData();
  }, [id]);

  if (!room) return <div>Loading...</div>;

  const handleLeaveRoom = async () => {
    if (room) {
      try {
        await leaveGameRoom(room.roomId);
        navigate(`/lobby/${room.gameType}`);
      } catch (error) {
        console.error('Failed to leave room:', error);
        // Optionally, show an error message to the user
      }
    }
  };

  const handleAiSelect = (ai: AI) => {
    console.log('Selected AI:', ai);
    if (selectAi) {
      selectAi(ai.aiId);
    }
    setIsAiModalOpen(false);
  };

  return (
      <Layout>
        <Box className="waiting-room-container">
          <Box className="top-sections-wrapper">
            <PlayerSection player={players[0]} />
            <PlayerSection player={players[1]} />
            <GameInfoPanel
                room={room}
                onSelectAi={() => setIsAiModalOpen(true)}
                onReady={() => sendReady('currentUserId')} // TODO: Fix this userId
                onStartGame={startGame}
                onLeaveRoom={handleLeaveRoom}
            />
          </Box>

          <ChatPanel
              messages={messages}
              onSend={(text) => sendChat('CurrentUser', text)} // TODO: 실제 사용자로 교체
          />
        </Box>
        <AiSelectionModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onSelectAi={handleAiSelect}
          aiList={aiList}
        />
      </Layout>
  );
};

export default WaitingRoom;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../component/layout/Layout';
import './WaitingRoom.css';
import { Box } from '@mui/material';

import { getGameRoomDetailApi } from '../../api/Api';
import { GameRoomDetail, Player } from '../../component/game/GameTypes';

import PlayerSection from '../../component/waiting/PlayerSection';
import GameInfoPanel from '../../component/waiting/GameInfoPanel';
import ChatPanel from '../../component/waiting/ChatPenel';
import { useStompChat } from '../../hooks/useStompChat';

const WaitingRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<GameRoomDetail | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const { messages, sendChat, sendReady, startGame } = useStompChat({
    roomId: roomId as string,
    endpoint: 'http://localhost:8080/ws',
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      try {
        const res = await getGameRoomDetailApi(roomId);
        setRoom(res.data);

        const raw =
            res.data?.players ??
            res.data?.playerList ??
            res.data?.participants ??
            [];

        setPlayers(Array.isArray(raw) ? raw : []);
      } catch (e) {
        console.error('Failed to fetch room data:', e);
      }
    };
    if (!room) fetchRoomData();
  }, [roomId, room]);

  if (!room) return <div>Loading...</div>;

  const handleSelectAi = () => {
    console.log('Select AI button clicked');
  };

  return (
      <Layout>
        <Box className="waiting-room-container">
          <Box className="top-sections-wrapper">
            <PlayerSection player={players[0]} />
            {/* <PlayerSection player={players[1]} /> */}
            <GameInfoPanel
                room={room}
                onSelectAi={handleSelectAi}
                onReady={() => sendReady('currentUserId')}
                onStartGame={startGame}
            />
          </Box>

          <ChatPanel
              messages={messages}
              onSend={(text) => sendChat('CurrentUser', text)} // TODO: 실제 사용자로 교체
          />
        </Box>
      </Layout>
  );
};

export default WaitingRoom;

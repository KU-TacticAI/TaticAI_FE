import React from 'react';
import { Box, Button } from '@mui/material';
import { GameRoomDetail, Player } from '../game/GameTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Props {
  room: GameRoomDetail;
  onSelectAi: () => void;
  onReady: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

const GameInfoPanel: React.FC<Props> = ({ room, onSelectAi, onReady, onStartGame, onLeaveRoom }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Find the host player object from the players array
  const hostPlayer = room.players.find((player: Player) => player.userId === room.host);
  const isHost = currentUser?.nickname === hostPlayer?.nickname;

  const currentPlayer = room.players.find(p => p.nickname === currentUser?.nickname);
  const isAiSelected = !!currentPlayer?.selectedAi;

  return (
    <Box className="game-info-section">
      <Box className="game-details">
        <h2>{room.gameType}</h2>
        <p>{room.roomName}</p>
        {/* TODO: Add more game info/rules */}
      </Box>
      <Button variant="contained" onClick={onSelectAi}>Select AI</Button>
      <Box className="buttons">
        {isHost ? (
          <Button variant="contained" color="primary" onClick={onStartGame}>
            START GAME
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={onReady} disabled={!isAiSelected}>
            READY
          </Button>
        )}
        <Button variant="outlined" color="error" onClick={onLeaveRoom}>
          나가기
        </Button>
      </Box>
    </Box>
  );
};

export default GameInfoPanel;
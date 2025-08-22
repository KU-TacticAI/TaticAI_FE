import React from 'react';
import { Box, Button } from '@mui/material';
import { GameRoomDetail } from '../game/GameTypes';

interface Props {
  room: GameRoomDetail;
  onSelectAi: () => void;
  onReady: () => void;
  onStartGame: () => void;
}

const GameInfoPanel: React.FC<Props> = ({ room, onSelectAi, onReady, onStartGame }) => {
  return (
      <Box className="game-info-section">
        <Box className="game-details">
          <h2>{room.gameType}</h2>
          <p>{room.roomName}</p>
          {/* TODO: Add more game info/rules */}
        </Box>
        <Button variant="contained" onClick={onSelectAi}>Select AI</Button>
        <Box className="buttons">
          <Button variant="contained" onClick={onReady}>Ready</Button>
          <Button variant="contained" onClick={onStartGame}>Start Game</Button>
        </Box>
      </Box>
  );
};

export default GameInfoPanel;

import React, {useEffect, useState} from 'react';
import { Box, Button } from '@mui/material';
import {AI, GameRoomDetail, Player} from '../game/GameTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {getAiListApi} from "../../api/Api";

interface Props {
  room: GameRoomDetail;
  onSelectAi: () => void;
  onReady: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

const GameInfoPanel: React.FC<Props> = ({ room, onSelectAi, onReady, onStartGame, onLeaveRoom }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const hostPlayer = room.players.find((player: Player) => player.userId === room.hostUserId);
  const isHost = currentUser?.nickname === hostPlayer?.nickname;

  const currentPlayer = room.players.find(p => p.nickname === currentUser?.nickname);
  const isAiSelected = !!currentPlayer?.selectedAi;
  const isCurrentPlayerReady = !!currentPlayer?.isReady;

  // All players must have selected an AI and be ready.
  // The host does not have an isReady state, their readiness is implied by starting the game.
  const areAllPlayersReady = room.players
      .filter(p => p.userId !== room.hostUserId) // Exclude host from readiness check
      .every(p => p.isReady && p.selectedAi);

  // The host also needs to select an AI before starting
  const isHostReadyToStart = isHost && hostPlayer?.selectedAi;

  return (
    <Box className="game-info-section">
      <Box className="game-details">
        <h2>{room.gameType}</h2>
        <p>{room.roomName}</p>
      </Box>
      <Button variant="contained" onClick={onSelectAi}>
        Select AI
      </Button>
      <Box className="buttons">
        {room.status === 'WAITING' && (
          <>
            {isHost ? (
              <Button
                variant="contained"
                color="primary"
                onClick={onStartGame}
                disabled={!areAllPlayersReady || !isHostReadyToStart}
              >
                START GAME
              </Button>
            ) : (
              <Button
                variant="contained"
                color={isCurrentPlayerReady ? 'success' : 'secondary'}
                onClick={onReady}
                disabled={!isAiSelected || isCurrentPlayerReady}
              >
                {isCurrentPlayerReady ? 'READY DONE' : 'READY'}
              </Button>
            )}
          </>
        )}
        <Button variant="outlined" color="error" onClick={onLeaveRoom}>
          나가기
        </Button>
      </Box>
    </Box>
  );
};

export default GameInfoPanel;
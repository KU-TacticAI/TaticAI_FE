import React from 'react';
import './GameResultModal.css';
import { Score } from './GameTypes';

interface GameResultModalProps {
  isOpen: boolean;
  gameType: string;
  winner: string | null;
  playerNames: string[];
  playerIds: string[];
  score: Score;
  avg_response_times?: number[];
  onClose: () => void;
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  gameType,
  winner,
  playerNames,
  playerIds,
  score,
  avg_response_times,
  onClose
}) => {
  if (!isOpen) return null;

  const getWinnerIndex = () => {
    if (!winner) return -1;
    return playerIds.indexOf(winner);
  };

  const getPlayerSymbol = (playerIndex: number) => {
    if (gameType.toLowerCase() === 'chess') {
      return playerIndex === 0 ? '♚' : '♔';
    } else if (gameType.toLowerCase() === 'othello') {
      return playerIndex === 0 ? '●' : '○';
    } else { // tictactoe
      return playerIndex === 0 ? 'X' : 'O';
    }
  };

  const winnerIndex = getWinnerIndex();
  const isDraw = winner === null;

  return (
    <div className="game-result-modal-overlay" onClick={onClose}>
      <div className="game-result-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="game-result-cards">
          {/* Player 1 Card */}
          <div className={`player-result-card ${winnerIndex === 0 ? 'winner' : winnerIndex === 1 ? 'loser' : 'draw'}`}>
            <div className="result-status">
              {isDraw ? 'DRAW' : winnerIndex === 0 ? 'WIN' : 'LOSE'}
            </div>
            
            <div className="card-content-row">
              <div className="card-left">
                <div className="player-symbol-large">{getPlayerSymbol(0)}</div>
                <div className="player-avatar"><div className="avatar-icon">👤</div></div>
              </div>
              <div className="player-info-box-modal">
                <div className="player-name-modal">{playerNames[0]}</div>
                <div className="info-label">점수 : <span className="score-value">{score && (gameType.toLowerCase() === 'chess' ? (0 in score ? score["black"] : score["white"]) : gameType.toLowerCase() === 'othello' ? (0 in score ? score["black"] : score["white"]) : (0 in score ? score["x"] : score["o"]))}</span></div>
                <div className="info-label">평균 응답시간 : <span className="score-value">{avg_response_times && avg_response_times[0] !== undefined ? avg_response_times[0].toFixed(2) + 's' : '-'}</span></div>
              </div>
            </div>
          </div>

          {/* Player 2 Card */}
          <div className={`player-result-card ${winnerIndex === 1 ? 'winner' : winnerIndex === 0 ? 'loser' : 'draw'}`}>
            <div className="result-status">
              {isDraw ? 'DRAW' : winnerIndex === 1 ? 'WIN' : 'LOSE'}
            </div>
            
            <div className="card-content-row">
              <div className="card-left">
                <div className="player-symbol-large">{getPlayerSymbol(1)}</div>
                <div className="player-avatar"><div className="avatar-icon">👤</div></div>
              </div>
              <div className="player-info-box-modal">
                <div className="player-name-modal">{playerNames[1]}</div>
                <div className="info-label">점수 : <span className="score-value">{score && (gameType.toLowerCase() === 'chess' ? ("white" in score ? score["white"] : score["black"]) : gameType.toLowerCase() === 'othello' ? ("white" in score ? score["white"] : score["black"]) : ("o" in score ? score["o"] : score["x"]))}</span></div>
                <div className="info-label">평균 응답시간 : <span className="score-value">{avg_response_times && avg_response_times[1] !== undefined ? avg_response_times[1].toFixed(2) + 's' : '-'}</span></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="game-result-footer">
          <button className="close-button" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultModal;

import React from 'react';
import { GameData, GameComponentProps, Coordinates, Score, GAME_CONFIGS } from './GameTypes';

interface BaseGameProps extends GameComponentProps {
  gameType: string;
  renderCell: (value: number, row: number, col: number, isLastMove: boolean) => React.ReactElement;
  calculateScore: (boardState: number[]) => Score;
  children?: React.ReactNode;
}

const BaseBoardGame: React.FC<BaseGameProps> = ({ gameData, gameType, renderCell, calculateScore, children }) => {
  const config = GAME_CONFIGS[gameType.toLowerCase()];
  
  if (!config) {
    return <div>지원하지 않는 게임 타입: {gameType}</div>;
  }

  // 기본값 설정
  const defaultGameData: GameData = {
    game_type: gameType,
    board_state: [...config.defaultBoardState],
    turn_number: 0,
    current_turn: 0,
    player_ids: ["None", "None"],
    player_names: ["None", "None"],
    last_move: null,
    is_finished: false,
    winner: null,
    is_success: true,
    timestamp: "2025-01-01T00:00:00.000000"
  };

  const currentGameData: GameData = gameData || defaultGameData;

  // NxN 보드로 변환하는 함수
  const convertToBoard = (boardState: number[]): number[][] => {
    const board: number[][] = [];
    for (let i = 0; i < config.boardSize; i++) {
      const row: number[] = [];
      for (let j = 0; j < config.boardSize; j++) {
        row.push(boardState[i * config.boardSize + j]);
      }
      board.push(row);
    }
    return board;
  };

  // 좌표 파싱 함수
  const parseCoordinates = (coordString: string): Coordinates | null => {
    try {
      const cleanCoord = coordString.replace(/[()]/g, '').trim();
      const parts = cleanCoord.split(',');
      
      if (parts.length !== 2) {
        console.warn('잘못된 좌표 형식:', coordString);
        return null;
      }
      
      const row = parseInt(parts[0].trim());
      const col = parseInt(parts[1].trim());
      
      // 유효한 범위 체크
      if (isNaN(row) || isNaN(col) || row < 0 || row >= config.boardSize || col < 0 || col >= config.boardSize) {
        console.warn('좌표가 범위를 벗어남:', row, col);
        return null;
      }
      
      return { row, col };
    } catch (error) {
      console.warn('좌표 파싱 오류:', coordString, error);
      return null;
    }
  };

  // 마지막 수 좌표 계산
  const getLastMoveCoords = (): Coordinates | null => {
    if (!currentGameData.last_move) {
      return null;
    }
    return parseCoordinates(currentGameData.last_move);
  };

  // 현재 플레이어 정보
  const getCurrentPlayerInfo = () => {
    const turn = currentGameData.current_turn;
    
    if (turn === 0 || turn === 1) {
      const playerName = currentGameData.player_names[turn] || `플레이어 ${turn + 1}`;
      const playerSymbol = config.playerSymbols[turn];
      const playerColor = config.playerColors[turn];
      return { name: playerName, symbol: playerSymbol, color: playerColor, index: turn };
    }
    
    // 오셀로의 경우 -1/1 방식 처리
    if (gameType.toLowerCase() === 'othello') {
      if (turn === -1) {
        return { 
          name: currentGameData.player_names[1] || '흰색 플레이어', 
          symbol: config.playerSymbols[1], 
          color: config.playerColors[1], 
          index: 1 
        };
      }
      if (turn === 1) {
        return { 
          name: currentGameData.player_names[0] || '검은색 플레이어', 
          symbol: config.playerSymbols[0], 
          color: config.playerColors[0], 
          index: 0 
        };
      }
    }
      return { name: '알 수 없음', symbol: '?', color: 'gray', index: 0 };
  };

  // 게임 타이틀 결정
  const getGameTitle = () => {
    switch (gameType.toLowerCase()) {
      case 'othello': return '오셀로';
      case 'tictactoe': return '틱택토';
      case 'chess': return '체스';
      default: return gameType;
    }
  };
  const board = convertToBoard(currentGameData.board_state);
  const lastMoveCoords = getLastMoveCoords();
  const score = calculateScore(currentGameData.board_state);
  const currentPlayer = getCurrentPlayerInfo();

  // 점수 표시 로직
  const getScoreDisplay = () => {
    if (gameType.toLowerCase() === 'chess') {
      return {
        player1: score.black || 0,
        player2: score.white || 0
      };
    } else if (gameType.toLowerCase() === 'othello') {
      return {
        player1: score.black || 0,
        player2: score.white || 0
      };
    } else { // tictactoe
      return {
        player1: score.x || 0,
        player2: score.o || 0
      };
    }
  };

  const scoreDisplay = getScoreDisplay();

  return (
    <div className={`${gameType.toLowerCase()}-container`}>
      <div className={`${gameType.toLowerCase()}-game-info`}>
        <h2>{getGameTitle()} 게임</h2>
        <div className={`${gameType.toLowerCase()}-game-stats`}>
          <div className={`${gameType.toLowerCase()}-player-info`}>
            <div className={`${gameType.toLowerCase()}-player`}>              <span className={`${gameType.toLowerCase()}-player-name`}>{currentGameData.player_names[0]}</span>
              <div className={`${gameType.toLowerCase()}-piece ${gameType.toLowerCase()}-${config.playerColors[0]}-piece-display`}>
                {gameType !== 'othello' ? config.playerSymbols[0] : ''}
              </div>
              <span className={`${gameType.toLowerCase()}-score`}>
                {scoreDisplay.player1}
              </span>
            </div>
            <div className={`${gameType.toLowerCase()}-player`}>
              <span className={`${gameType.toLowerCase()}-player-name`}>{currentGameData.player_names[1]}</span>
              <div className={`${gameType.toLowerCase()}-piece ${gameType.toLowerCase()}-${config.playerColors[1]}-piece-display`}>
                {gameType !== 'othello' ? config.playerSymbols[1] : ''}
              </div>
              <span className={`${gameType.toLowerCase()}-score`}>
                {scoreDisplay.player2}
              </span>
            </div>
          </div>
          <div className={`${gameType.toLowerCase()}-turn-info`}>
            <p>턴: {currentGameData.turn_number}</p>
            <p>현재 플레이어: {currentPlayer.name} ({currentPlayer.symbol})</p>
            <p>마지막 수: {currentGameData.last_move || '없음'}</p>
            {currentGameData.is_finished && (
              <p className={`${gameType.toLowerCase()}-game-finished`}>게임 종료! 
                {currentGameData.winner ? ` 승자: ${currentGameData.player_names[currentGameData.player_ids.indexOf(currentGameData.winner)]}` : ' 무승부'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {children}
      
      <div className={`${gameType.toLowerCase()}-board-with-coordinates`}>        <div className={`${gameType.toLowerCase()}-row-coordinates`}>
          {Array.from({length: config.boardSize}, (_, i) => (
            <div key={i} className={`${gameType.toLowerCase()}-row-coordinate`}>
              {gameType.toLowerCase() === 'chess' ? 8 - i : i}
            </div>
          ))}
        </div>
        
        <div className={`${gameType.toLowerCase()}-board`}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => {
                const isLastMove = lastMoveCoords && 
                  rowIndex === lastMoveCoords.row && 
                  colIndex === lastMoveCoords.col;
                return renderCell(cell, rowIndex, colIndex, isLastMove || false);
              })}
            </div>
          ))}
        </div>
          <div className={`${gameType.toLowerCase()}-col-coordinates`}>
          {Array.from({length: config.boardSize}, (_, i) => (
            <div key={i} className={`${gameType.toLowerCase()}-col-coordinate`}>
              {gameType.toLowerCase() === 'chess' ? String.fromCharCode(97 + i) : i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaseBoardGame;

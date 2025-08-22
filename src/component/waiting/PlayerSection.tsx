import React from 'react';
import { Player } from '../game/GameTypes';

interface Props {
  player?: Player;
}

const PlayerSection: React.FC<Props> = ({ player }) => {
  if (!player) {
    return <div className="player-section empty">Empty</div>;
  }
  return (
      <div className="player-section">
        <div className="player-name">{player.nickname ?? player.userId}</div>
        {/* 필요 시 추가 렌더링 */}
      </div>
  );
};

export default PlayerSection;

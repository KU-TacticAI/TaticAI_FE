import React from 'react';
import { Player } from '../game/GameTypes';
import defaultProfileIcon from '../../resource/img/profile-icon.png';

interface Props {
  player?: Player;
}

const PlayerSection: React.FC<Props> = ({ player }) => {
  if (!player) {
    return <div className="player-section empty">Empty</div>;
  }

  return (
    <div className="player-section">
      <div className="player-info-layout">
        <img
          src={player.profileImage || defaultProfileIcon}
          alt={player.nickname || player.userId}
          className="profile-image"
        />
        <div className="player-details">
          <div className="player-name">{player.nickname ?? player.userId}</div>
        </div>
      </div>

      {player.isReady ? (
          <div className="player-isReady">{"READY"}</div>
      ) : (
          <div className="player-isReady">{"WAITING"}</div>
      )}

      <div className="selected-ai-info">
        {player.selectedAi ? (
          <>
            <div><strong>AI:</strong> {player.selectedAi.aiName}</div>
            <div className="ai-description">{player.selectedAi.description}</div>
          </>
        ) : (
          <div>Empty</div>
        )}
      </div>

      {/* 필요 시 추가 렌더링 */}
    </div>
  );
};

export default PlayerSection;

import React from 'react';
import {GameRoom, Player} from '../game/GameTypes';
import defaultProfileIcon from '../../resource/img/profile-icon.png';

interface Props {
  player?: Player;
  room?: GameRoom
}

const PlayerSection: React.FC<Props> = ({ player, room }) => {
  if (!player) {
    return <div className="player-section empty">Empty</div>;
  }

  console.log(player)
  return (
    <div className="player-section">
      <div className="player-info-layout">
        <img
          src={player.profileUrl || defaultProfileIcon}
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
          room?.hostUserId === player.userId ? (
                  <div className="player-isReady">{"ROOM MANAGER"}</div>
              ):(
              < div className = "player-isReady" > {"WAITING"}</div>
          )
      )}

      <div className="selected-ai-info">
        {player.selectedAi ? (
          <>
            <div><strong>AI:</strong> {player.selectedAi.name}</div>
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

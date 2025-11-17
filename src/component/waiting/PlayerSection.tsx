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

  // Header.tsx와 동일한 패턴으로 프로필 이미지 변수 선언
  const currentProfileImage = player.profileImage || defaultProfileIcon;
  const currentAltText = player.nickname || player.userId;

  return (
      <div className="player-section">
        <div className="player-info-layout">
          <img
              src={currentProfileImage} // 수정된 부분: 변수 사용
              alt={currentAltText}       // 수정된 부분: 변수 사용 (가독성을 위해 함께 수정)
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
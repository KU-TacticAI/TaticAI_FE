import React from 'react';
import { AI } from '../game/GameTypes';
import './AiSelectionModal.css';

// Props에 aiList와 onSelectAi를 추가
interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameType: String;
  aiList: AI[];
  onSelectAi: (ai: AI) => void;
}

const AiSelectionModal: React.FC<Props> = ({ isOpen, onClose, gameType, aiList, onSelectAi }) => {

  if (!isOpen) {
    return null;
  }

  const handleClickAi = (ai: AI) => {
    onSelectAi(ai);
    onClose();
  };

  const filteredAis = aiList.filter(ai => ai.gameType === gameType);

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Select an AI</h2>
          <div className="ai-list">
            {filteredAis.length > 0 ? (
                filteredAis.map((ai) => (
                    ai.gameType == gameType ? (
                    <div key={ai.aiId} className="ai-item" onClick={() => handleClickAi(ai)}>
                      <h3>{ai.name}</h3>
                      <p>{ai.description}</p>
                    </div>
                    ) : (<></>)
                ))
            ) : (
                <p>No AIs available.</p>
            )}
          </div>
          <button onClick={onClose} className="modal-close-button">Close</button>
        </div>
      </div>
  );
};

export default AiSelectionModal;
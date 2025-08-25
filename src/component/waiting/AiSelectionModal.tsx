import React from 'react';
import { AI } from '../game/GameTypes';
import './AiSelectionModal.css';

// Props에 aiList와 onSelectAi를 추가
interface Props {
  isOpen: boolean;
  onClose: () => void;
  aiList: AI[];
  onSelectAi: (ai: AI) => void;
}

const AiSelectionModal: React.FC<Props> = ({ isOpen, onClose, aiList, onSelectAi }) => {

  if (!isOpen) {
    return null;
  }

  // handleSelectAi 함수를 호출하여 선택된 AI 정보를 상위 컴포넌트로 전달
  const handleClickAi = (ai: AI) => {
    onSelectAi(ai);
    onClose();
  };

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Select an AI</h2>
          <div className="ai-list">
            {aiList.length > 0 ? (
                aiList.map((ai) => (
                    <div key={ai.aiId} className="ai-item" onClick={() => handleClickAi(ai)}>
                      <h3>{ai.name}</h3>
                      <p>{ai.description}</p>
                    </div>
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
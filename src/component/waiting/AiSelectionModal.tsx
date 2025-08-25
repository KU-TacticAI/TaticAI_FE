import React from 'react';
import { AI } from '../game/GameTypes';
import './AiSelectionModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectAi: (ai: AI) => void;
  aiList: AI[]; // Assuming we get the list from props
}

const AiSelectionModal: React.FC<Props> = ({ isOpen, onClose, onSelectAi, aiList }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select an AI</h2>
        <div className="ai-list">
          {aiList.length > 0 ? (
            aiList.map((ai) => (
              <div key={ai.aiId} className="ai-item" onClick={() => onSelectAi(ai)}>
                <h3>{ai.aiName}</h3>
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

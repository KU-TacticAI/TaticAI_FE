import React, { useState } from 'react';
import './AiRegistrationModal.css';

interface AiRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiRegistrationModal: React.FC<AiRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [aiName, setAiName] = useState('');
  const [version, setVersion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/zip') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('ZIP 파일만 업로드할 수 있습니다.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('AI 모델 ZIP 파일을 선택해주세요.');
      return;
    }
    // TODO: Add API call for AI registration
    console.log({
      aiName,
      version,
      fileName: file.name,
    });
    setError('');
    onClose(); // Close modal on successful submission
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>AI 등록</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="aiName">AI 이름</label>
            <input
              type="text"
              id="aiName"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="version">버전</label>
            <input
              type="text"
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="aiFile">ZIP 파일</label>
            <input
              type="file"
              id="aiFile"
              accept=".zip"
              onChange={handleFileChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="confirm-btn">등록</button>
            <button type="button" onClick={onClose} className="cancel-btn">취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiRegistrationModal;

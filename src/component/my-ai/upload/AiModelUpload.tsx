import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "../../layout/Layout";
import './AiModelUpload.css';

const AiModelUpload: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    modelName: '',
    description: '',
    gameType: 'chess',
    version: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsUploading(true);

    if (!file) {
      setError('AI 모델 파일을 선택해주세요.');
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      const modelData = {
        modelName: form.modelName,
        description: form.description,
        gameType: form.gameType,
        version: form.version
      };

      formData.append(
        'json',
        new Blob([JSON.stringify(modelData)], { type: 'application/json' })
      );
      formData.append('file', file);

      // TODO: Replace with actual API call
      // await uploadAiModel(formData);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      alert('AI 모델이 성공적으로 업로드되었습니다.');
      navigate('/my-ai');
    } catch (err) {
      setError('AI 모델 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="ai-upload-container">
        <div className="ai-upload-header">
          <h1>AI 모델 업로드</h1>
          <p>페이지 디스크립션을 적어주세유</p>
        </div>

        <form onSubmit={handleSubmit} className="ai-upload-form">
          <div className="form-section">
            <div className="form-left">
              <div className="form-group">
                <label htmlFor="modelName">모델 이름 *</label>
                <input
                  id="modelName"
                  name="modelName"
                  type="text"
                  value={form.modelName}
                  onChange={handleChange}
                  placeholder="AI 모델의 이름을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gameType">게임 유형 *</label>
                <select
                  id="gameType"
                  name="gameType"
                  value={form.gameType}
                  onChange={handleChange}
                  required
                >
                  <option value="chess">체스</option>
                  <option value="othello">오셀로</option>
                  <option value="tictactoe">틱택토</option>
                  <option value="baduk">바둑</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="version">버전</label>
                <input
                  id="version"
                  name="version"
                  type="text"
                  value={form.version}
                  onChange={handleChange}
                  placeholder="예: 1.0.0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">모델 설명</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="AI 모델에 대한 상세 설명을 입력하세요"
                  rows={4}
                />
              </div>
            </div>

            <div className="form-right">
              <div className="file-upload-section">
                <label htmlFor="modelFile">AI 모델 파일 *</label>
                <div className="file-upload-area">
                  <input
                    id="modelFile"
                    type="file"
                    onChange={onFileChange}
                    accept=".zip,.tar,.gz,.pkl,.h5,.pt,.pth"
                    required
                  />
                  <div className="file-upload-placeholder">
                    {file ? (
                      <div className="file-info">
                        <div className="file-icon">📁</div>
                        <div className="file-details">
                          <p className="file-name">{file.name}</p>
                          <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="upload-prompt">
                        <div className="upload-icon">📤</div>
                        <p>파일을 선택하거나 드래그하여 업로드하세요</p>
                        <p className="file-types">지원 형식: .h5, .pth, .zip, .tar 등등?</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="upload-guidelines">
                <h4>업로드 참고사항</h4>
                <ul>
                  <li>최대 얼마까지만 업로드 가능하다고 표시하면 좋을듯</li>
                  <li>업로드할 때 룰 2</li>
                </ul>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">AI 모델이 성공적으로 업로드되었습니다!</div>}

          <div className="button-container">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isUploading}
            >
              {isUploading ? '업로드 중...' : 'AI 모델 업로드'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AiModelUpload;
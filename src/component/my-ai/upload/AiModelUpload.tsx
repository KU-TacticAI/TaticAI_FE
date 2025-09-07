import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from "../../layout/Layout";
import { RootState, AppDispatch } from '../../../store/store';
import { createAi, updateAi, fetchAiList } from "../../../store/slices/aiSlice";
import './AiModelUpload.css';

const AiModelUpload: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { aiList, status: aiStatus } = useSelector((state: RootState) => state.ai);

  const [form, setForm] = useState({
    modelName: '',
    description: '',
    gameType: 'chess',
    version: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && aiStatus === 'idle') {
      dispatch(fetchAiList());
    }
  }, [isEditMode, aiStatus, dispatch]);

  useEffect(() => {
    if (isEditMode && aiList.length > 0) {
      const modelToEdit = aiList.find(m => m.aiId.toString() === id);
      if (modelToEdit) {
        setForm({
          modelName: modelToEdit.name,
          description: modelToEdit.description,
          gameType: modelToEdit.gameType,
          version: modelToEdit.version,
        });
      }
    }
  }, [isEditMode, id, aiList]);

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
    setIsUploading(true);

    if (!isEditMode && !file) {
      setError('AI 모델 파일을 선택해주세요.');
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      const modelData = {
        name: form.modelName,
        description: form.description,
        gameType: form.gameType,
        version: form.version
      };

      formData.append(
        'requestDto',
        new Blob([JSON.stringify(modelData)], { type: 'application/json' })
      );
      
      if (file) {
        formData.append('file', file);
      }

      if (isEditMode && id) {
        await dispatch(updateAi({ id, formData })).unwrap();
        alert('AI 모델이 성공적으로 수정되었습니다.');
      } else {
        await dispatch(createAi({ formData })).unwrap();
        alert('AI 모델이 성공적으로 업로드되었습니다.');
      }
      
      navigate('/my-ai');
    } catch (err) {
      setError(isEditMode ? 'AI 모델 수정 중 오류가 발생했습니다.' : 'AI 모델 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="ai-upload-container">
        <div className="ai-upload-header">
          <h1>{isEditMode ? 'AI 모델 수정' : 'AI 모델 업로드'}</h1>
          <p>{isEditMode ? 'AI 모델의 정보를 수정합니다.' : '페이지 디스크립션을 적어주세유'}</p>
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
                {isEditMode ? (
                    <div className="info-item">
                      <span className="value game-type">{form.gameType}</span>
                    </div>
                  ):(
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
                <option value="omok">오목</option>
              </select>
            )
            }
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
                <label htmlFor="modelFile">AI 모델 파일 {isEditMode ? '(선택)' : '*'}</label>
                <div className="file-upload-area">
                  <input
                    id="modelFile"
                    type="file"
                    onChange={onFileChange}
                    accept=".zip,.tar,.gz,.pkl,.h5,.pt,.pth"
                    required={!isEditMode}
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

          <div className="button-container">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isUploading}
            >
              {isUploading ? (isEditMode ? '수정 중...' : '업로드 중...') : (isEditMode ? 'AI 모델 수정' : 'AI 모델 업로드')}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AiModelUpload;
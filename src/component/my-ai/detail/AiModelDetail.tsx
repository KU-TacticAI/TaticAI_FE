import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "../../layout/Layout";
import './AiModelDetail.css';

interface AiModel {
  id: number;
  modelName: string;
  description: string;
  gameType: string;
  version: string;
  uploadDate: string;
  fileSize: string;
  lastUsed?: string;
}

const AiModelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<AiModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    modelName: '',
    description: '',
    version: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data - replace with actual API call
  const mockModel: AiModel = {
    id: 1,
    modelName: "ChessGrandmaster Pro",
    description: "고급 체스 AI 모델로 딥러닝 기반의 전략적 판단을 제공합니다. 수백만 개의 체스 게임 데이터로 훈련되어 뛰어난 성능을 자랑합니다.",
    gameType: "chess",
    version: "2.1.0",
    uploadDate: "2024-01-15",
    fileSize: "45.2 MB",
    lastUsed: "2024-01-20"
  };

  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setModel(mockModel);
      setEditForm({
        modelName: mockModel.modelName,
        description: mockModel.description,
        version: mockModel.version
      });
      setLoading(false);
    };

    if (id) {
      loadModel();
    }
  }, [id]);

  const getGameTypeLabel = (gameType: string) => {
    const labels: { [key: string]: string } = {
      'chess': '체스',
      'othello': '오셀로',
      'tictactoe': '틱택토',
      'baduk': '바둑'
    };
    return labels[gameType] || gameType;
  };


  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (model) {
      setModel({
        ...model,
        modelName: editForm.modelName,
        description: editForm.description,
        version: editForm.version
      });
    }
    
    setIsEditing(false);
    alert('모델 정보가 성공적으로 업데이트되었습니다.');
  };

  const handleDelete = async () => {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('AI 모델이 성공적으로 삭제되었습니다.');
    navigate('/my-ai');
  };


  if (loading) {
    return (
      <Layout>
        <div className="ai-detail-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>AI 모델 정보를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!model) {
    return (
      <Layout>
        <div className="ai-detail-container">
          <div className="error-state">
            <h2>모델을 찾을 수 없습니다</h2>
            <button onClick={() => navigate('/my-ai')} className="back-button">
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ai-detail-container">
        <div className="detail-header">
          <button onClick={() => navigate('/my-ai')} className="back-button">
            ← 목록으로
          </button>
          <div className="header-actions">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="edit-button"
            >
              {isEditing ? '취소' : '편집'}
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="delete-button"
            >
              삭제
            </button>
          </div>
        </div>

        <div className="detail-content">
          <div className="model-main-info">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-group">
                  <label htmlFor="modelName">모델 이름</label>
                  <input
                    id="modelName"
                    type="text"
                    value={editForm.modelName}
                    onChange={(e) => setEditForm({...editForm, modelName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="version">버전</label>
                  <input
                    id="version"
                    type="text"
                    value={editForm.version}
                    onChange={(e) => setEditForm({...editForm, version: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">설명</label>
                  <textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={4}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">저장</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <div className="model-info">
                <div className="model-header">
                  <h1 className="model-title">{model.modelName}</h1>
                </div>
                <p className="model-description">{model.description}</p>
              </div>
            )}
          </div>

          <div className="detail-sections">
            <div className="section basic-info">
              <h3>기본 정보</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">게임 유형</span>
                  <span className="value game-type">{getGameTypeLabel(model.gameType)}</span>
                </div>
                <div className="info-item">
                  <span className="label">버전</span>
                  <span className="value">{model.version}</span>
                </div>
                <div className="info-item">
                  <span className="label">파일 크기</span>
                  <span className="value">{model.fileSize}</span>
                </div>
                <div className="info-item">
                  <span className="label">업로드 날짜</span>
                  <span className="value">{model.uploadDate}</span>
                </div>
                <div className="info-item">
                  <span className="label">마지막 사용</span>
                  <span className="value">{model.lastUsed || '사용 기록 없음'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>AI 모델 삭제</h3>
              <p>
                "<strong>{model.modelName}</strong>" 모델을 정말 삭제하시겠습니까?<br/>
                모델을 삭제하면 더이상 되돌릴 수 없어요.
              </p>
              <div className="modal-actions">
                <button onClick={() => setShowDeleteModal(false)} className="cancel-button">
                  취소
                </button>
                <button onClick={handleDelete} className="confirm-delete-button">
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AiModelDetail;
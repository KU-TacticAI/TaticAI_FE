import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "../../layout/Layout";
import { AI } from "../../game/GameTypes";
import { fetchAiList, deleteAi } from "../../../store/slices/aiSlice";
import { RootState, AppDispatch } from '../../../store/store';
import './AiModelDetail.css';

const AiModelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { aiList, status } = useSelector((state: RootState) => state.ai);
  const model = aiList.find(m => m.aiId.toString() === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAiList());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (model) {
      setEditForm({
        name: model.name,
        description: model.description,
      });
    }
  }, [model]);

  const getGameTypeLabel = (gameType: string) => {
    const labels: { [key: string]: string } = {
      'chess': '체스',
      'othello': '오셀로',
      'tictactoe': '틱택토',
      'omok': '오목'
    };
    return labels[gameType] || gameType;
  };


  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual API call for update
    console.log('Updating model with:', editForm);
    alert('모델 정보가 성공적으로 업데이트되었습니다. (구현 필요)');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!id) {
      console.error("ID is not available");
      alert("오류: 모델 ID를 찾을 수 없습니다.");
      return;
    }
    try {
      await dispatch(deleteAi({ id, password })).unwrap();
      alert('AI 모델이 성공적으로 삭제되었습니다.');
      navigate('/my-ai');
    } catch (error: any) {
      console.error("Failed to delete AI:", error);
      alert(`AI 모델 삭제에 실패했습니다: ${error.message || '서버 오류'}`);
    }
  };


  if (status === 'loading') {
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
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    required
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
                  <h1 className="model-title">{model.name}</h1>
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
                  <span className="label">점수</span>
                  <span className="value">{model.score}</span>
                </div>
                <div className="info-item">
                  <span className="label">티어</span>
                  <span className="value">{model.tier}</span>
                </div>
                <div className="info-item">
                  <span className="label">파일 크기</span>
                  <span className="value">{model.aiSize}</span>
                </div>
                <div className="info-item">
                  <span className="label">업로드 날짜</span>
                  <span className="value">{model.uploadDate}</span>
                </div>
                <div className="info-item">
                  <span className="label">최근 수정 날짜</span>
                  <span className="value">{model.updateAt}</span>
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
                "<strong>{model.name}</strong>" 모델을 정말 삭제하시겠습니까?<br/>
                모델을 삭제하면 더이상 되돌릴 수 없어요.
              </p>
              <p>
                비밀번호를 입력하세요
              </p>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
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
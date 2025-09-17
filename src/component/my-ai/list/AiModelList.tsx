import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from "../../layout/Layout";
import { fetchAiList } from "../../../store/slices/aiSlice";
import { RootState, AppDispatch } from "../../../store/store";
import { AI } from "../../game/GameTypes";
import './AiModelList.css';

const AiModelList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { aiList: models, status, error } = useSelector((state: RootState) => state.ai);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAiList());
    }
  }, [status, dispatch]);

  const getGameTypeLabel = (gameType: string) => {
    const labels: { [key: string]: string } = {
      'chess': '체스',
      'othello': '오셀로',
      'tictactoe': '틱택토',
      'omok': '오목'
    };
    return labels[gameType] || gameType;
  };
  
  const filteredModels = models.filter(model => {
    const matchesFilter = filter === 'all' || model.gameType === filter;
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (status === 'loading') {
    return (
      <Layout>
        <div className="ai-models-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>AI 모델을 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (status === 'failed') {
    return (
        <Layout>
            <div className="ai-models-container">
                <p>Error: {error}</p>
            </div>
        </Layout>
    )
  }

  return (
    <Layout>
      <div className="ai-models-container">
        <div className="ai-models-header">
          <div className="header-content">
            <h1>나의 AI 모델</h1>
          </div>
          <Link to="/my-ai/upload" className="upload-button">
            <span className="upload-icon">+</span>
            새 모델 업로드
          </Link>
        </div>

        <div className="controls-section">
          <div className="search-controls">
            <input
              type="text"
              placeholder="모델 이름이나 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">모든 게임</option>
              <option value="chess">체스</option>
              <option value="othello">오셀로</option>
              <option value="tictactoe">틱택토</option>
              <option value="omok">오목</option>
            </select>
          </div>
        </div>

        <div className="models-grid">
          {filteredModels.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🤖</div>
              <h3>AI 모델이 없습니다</h3>
              <p>첫 번째 AI 모델을 업로드해보세요!</p>
              <Link to="/my-ai/upload" className="empty-upload-button">
                모델 업로드하기
              </Link>
            </div>
          ) : (
            filteredModels.map(model => (
              <div key={model.aiId} className="model-card">
                <div className="model-card-header">
                  <div className="model-info">
                    <h3 className="model-name">{model.name}</h3>
                  </div>
                  <div className="model-actions">
                    <button
                      className="action-button"
                      onClick={() => navigate(`/my-ai/${model.aiId}`)}
                      title="상세보기"
                    >
                      ⚙️
                    </button>
                  </div>
                </div>

                <div className="model-details">
                  <p className="model-description">{model.description}</p>
                  
                  <div className="model-meta">
                    <div className="meta-item">
                      <span className="meta-label">게임:</span>
                      <span className="meta-value game-type">
                        {getGameTypeLabel(model.gameType)}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">점수:</span>
                      <span className="meta-value">{model.score}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">크기:</span>
                      <span className="meta-value">{model.aiSize}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">업로드:</span>
                      <span className="meta-value">{model.uploadDate}</span>
                    </div>
                  </div>

                </div>

                <div className="model-card-footer">
                  <button 
                    className="secondary-button"
                    onClick={() => navigate(`/my-ai/${model.aiId}`)}
                  >
                      편집
                  </button>
                  <button 
                    className="primary-button"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};


export default AiModelList;
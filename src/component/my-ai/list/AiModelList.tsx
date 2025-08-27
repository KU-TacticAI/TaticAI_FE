import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from "../../layout/Layout";
import './AiModelList.css';

interface AiModel {
  id: number;
  modelName: string;
  description: string;
  gameType: string;
  version: string;
  uploadDate: string;
  fileSize: string;
}

const AiModelList: React.FC = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState<AiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  const mockModels: AiModel[] = [
    {
      id: 1,
      modelName: "ChessGrandmaster Pro",
      description: "고급 체스 AI 모델로 딥러닝 기반의 전략적 판단을 제공합니다.",
      gameType: "chess",
      version: "2.1.0",
      uploadDate: "2024-01-15",
      fileSize: "45.2 MB"
    },
    {
      id: 2,
      modelName: "OthelloMaster",
      description: "오셀로 게임에 특화된 AI 모델입니다.",
      gameType: "othello",
      version: "1.5.2",
      uploadDate: "2024-01-10",
      fileSize: "32.1 MB"
    },
    {
      id: 3,
      modelName: "TicTacToe Basic",
      description: "틱택토 게임을 위한 기본 AI 모델입니다.",
      gameType: "tictactoe",
      version: "1.0.0",
      uploadDate: "2024-01-12",
      fileSize: "5.8 MB"
    },
    {
      id: 4,
      modelName: "BadukAlpha",
      description: "바둑 게임에 최적화된 AI 모델입니다.",
      gameType: "baduk",
      version: "1.2.1",
      uploadDate: "2024-01-08",
      fileSize: "128.7 MB"
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const loadModels = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setModels(mockModels);
      setLoading(false);
    };

    loadModels();
  }, []);

  const getGameTypeLabel = (gameType: string) => {
    const labels: { [key: string]: string } = {
      'chess': '체스',
      'othello': '오셀로',
      'tictactoe': '틱택토',
      'baduk': '바둑'
    };
    return labels[gameType] || gameType;
  };


  const filteredModels = models.filter(model => {
    const matchesFilter = filter === 'all' || model.gameType === filter;
    const matchesSearch = model.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
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
              <option value="baduk">바둑</option>
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
              <div key={model.id} className="model-card">
                <div className="model-card-header">
                  <div className="model-info">
                    <h3 className="model-name">{model.modelName}</h3>
                  </div>
                  <div className="model-actions">
                    <button
                      className="action-button"
                      onClick={() => navigate(`/my-ai/${model.id}`)}
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
                      <span className="meta-label">버전:</span>
                      <span className="meta-value">{model.version}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">크기:</span>
                      <span className="meta-value">{model.fileSize}</span>
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
                    onClick={() => navigate(`/my-ai/${model.id}`)}
                  >
                      기본버튼
                  </button>
                  <button 
                    className="primary-button"
                  >
                    프라이머리 컬러버튼
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
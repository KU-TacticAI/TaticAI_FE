import React from 'react';
import './RankingStatus.css';

const RankingError: React.FC = () => (
  <div className="ranking-status-container">
    <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
  </div>
);

export default RankingError;

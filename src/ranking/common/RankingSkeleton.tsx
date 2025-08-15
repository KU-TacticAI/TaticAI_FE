import React from 'react';
import './RankingStatus.css';

const RankingSkeleton: React.FC = () => (
  <div className="ranking-skeleton-container">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="skeleton-row">
        <div className="skeleton-item skeleton-rank" />
        <div className="skeleton-item skeleton-nickname" />
        <div className="skeleton-item skeleton-score" />
        <div className="skeleton-item skeleton-delta" />
        <div className="skeleton-item skeleton-updatedAt" />
      </div>
    ))}
  </div>
);

export default RankingSkeleton;

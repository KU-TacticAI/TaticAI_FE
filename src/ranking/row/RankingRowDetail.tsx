import React from 'react';
import { RankingItem } from '../table/RankingTable';
import './RankingRowDetail.css';

interface RankingRowDetailProps {
  item: RankingItem;
}

const RankingRowDetail: React.FC<RankingRowDetailProps> = ({ item }) => {
  return (
    <div className="ranking-row-detail">
      <h4>{item.username}님의 AI 목록</h4>
      {item.aiList.length > 0 ? (
        <table className="ai-list-table">
          <thead>
            <tr>
              <th>AI Name</th>
              <th>Game</th>
              <th>Score</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            {item.aiList.map((ai) => (
              <tr key={ai.aiId}>
                <td>{ai.aiName}</td>
                <td>{ai.gameType}</td>
                <td>{ai.score.toLocaleString()}</td>
                <td>{ai.tier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>등록된 AI가 없습니다.</p>
      )}
    </div>
  );
};

export default RankingRowDetail;

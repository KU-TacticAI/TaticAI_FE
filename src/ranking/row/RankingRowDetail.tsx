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
        {item.aiList && item.aiList.length > 0 ? (
            <table className="ai-list-table">
              <thead>
              <tr>
                <th>AI Name</th>
                <th>Game</th>
                <th>Win Rate</th> {/* Score -> Win Rate 변경 */}
                <th>Tier</th>
              </tr>
              </thead>
              <tbody>
              {item.aiList.map((ai, index) => (
                  <tr key={ai.aiId || index}>
                    <td>{ai.aiName}</td>
                    <td>{ai.gameType}</td>
                    <td>{ai.winRate ? ai.winRate.toFixed(1) + '%' : '0%'}</td>
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

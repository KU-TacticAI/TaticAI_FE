import React, { useState } from 'react';
import { RankingItem } from '../table/RankingTable';
import RankingRowDetail from './RankingRowDetail';

interface RankingRowProps {
  item: RankingItem;
}

const RankingRow: React.FC<RankingRowProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
      <>
        <tr onClick={handleToggle} className="clickable-row">
          <td>{item.rank}</td>
          <td>{item.username}</td>

          {/* ▼ [수정] item.totalScore -> item.winRate 표시 */}
          <td>{item.winRate ? item.winRate.toFixed(1) + '%' : '0%'}</td>
          <td>{item.record}</td>
        </tr>
        {isExpanded && (
            <tr>
              <td colSpan={4}> {/* 컬럼 개수가 3개에서 4개(Rank, Player, WinRate, Record)로 늘었으므로 colSpan 수정 */}
                <RankingRowDetail item={item} />
              </td>
            </tr>
        )}
      </>
  );
};

export default RankingRow;

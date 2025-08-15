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
        <td>{item.totalScore.toLocaleString()}</td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={3}>
            <RankingRowDetail item={item} />
          </td>
        </tr>
      )}
    </>
  );
};

export default RankingRow;

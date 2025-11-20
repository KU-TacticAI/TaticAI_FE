import React from 'react';
import RankingRow from '../row/RankingRow';
import './RankingTable.css'

// Corresponds to RankingAiResponseDto
export interface RankingAi {
  winRate: any;
  aiId: number;
  aiName: string;
  gameType: 'Othello' | 'Gomoku' | 'Chess'; // Assuming gameType is one of these
  score: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'; // Assuming Tier is an enum
}

// Corresponds to RankingResponseDto
export interface RankingItem {
  userId: number;
  username: string;
  rank: number;
  winRate: number;     // 승률
  record: string;      // 전적 (예: "10승 5패")
  aiList: RankingAi[];
}

interface RankingTableProps {
  items: RankingItem[];
}

const RankingTable: React.FC<RankingTableProps> = ({ items }) => (
    <table className="ranking-table">
      <thead>
      <tr>
        <th>Rank</th>
        <th>Player</th>
        <th>Win Rate</th>
        <th>Record</th>
      </tr>
      </thead>
      <tbody>
      {items.map((item) => (
          <RankingRow key={item.userId} item={item} />
      ))}
      </tbody>
    </table>
);

export default RankingTable;

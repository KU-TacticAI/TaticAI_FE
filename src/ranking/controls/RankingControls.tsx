import React from 'react';

export interface RankingFilters {
  period: 'daily' | 'weekly' | 'monthly';
  game: 'all' | 'othello' | 'gomoku' | 'chess';
  sort: 'scoreDesc' | 'scoreAsc' | 'rankAsc';
  page: number;
}

interface RankingControlsProps {
  value: RankingFilters;
  onChange: (filters: RankingFilters) => void;
}

const RankingControls: React.FC<RankingControlsProps> = ({ value, onChange }) => {
  const set = (key: keyof RankingFilters, val: string | number) =>
      onChange({ ...value, [key]: val, page: 1 });

  return (
      <div className="ranking-controls">
        {/*<select value={value.period} onChange={(e) => set('period', e.target.value)}>*/}
          {/*<option value="daily">일간</option>*/}
          {/*<option value="weekly">주간</option>*/}
          {/*<option value="monthly">월간</option>*/}
        {/*</select>*/}

        {/*<select value={value.game} onChange={(e) => set('game', e.target.value)}>*/}
        {/*  <option value="all">전체 게임</option>*/}
        {/*  <option value="othello">오셀로</option>*/}
        {/*  <option value="gomoku">오목</option>*/}
        {/*  <option value="chess">체스</option>*/}
        {/*</select>*/}

        <select value={value.sort} onChange={(e) => set('sort', e.target.value)}>
          <option value="scoreDesc">승률 높은 순</option>
          <option value="scoreAsc">승률 낮은 순</option>
          {/*<option value="rankAsc">랭크 오름차순</option>*/}
        </select>
      </div>
  );
};

export default RankingControls;

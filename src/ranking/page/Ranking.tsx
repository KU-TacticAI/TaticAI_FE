import React, { useEffect, useState } from 'react';
import './Ranking.css';
import Layout from "../../component/layout/Layout";
import RankingControls, { RankingFilters } from '../controls/RankingControls';
import RankingTable, { RankingItem } from '../table/RankingTable';
import RankingPagination from '../pagination/RankingPagination';
import RankingEmpty from '../common/RankingEmpty';
import RankingError from '../common/RankingError';
import RankingSkeleton from '../common/RankingSkeleton';
import { getRankings } from '../../api/Api';

/**
 * AI 순위 조회 페이지 컴포넌트
 * @description 기간, 게임 종류, 정렬 순서에 따라 AI 순위 목록을 조회하고 표시합니다.
 * @returns {React.FC} Ranking 페이지의 UI를 렌더링합니다.
 */
const PAGE_SIZE = 10;

const sortMapping: { [key: string]: string } = {
  scoreDesc: 'winRate,desc',
  scoreAsc: 'winRate,asc',
  rankAsc: 'rankOrder,asc',
};

const Ranking: React.FC = () => {
  const [filters, setFilters] = useState<RankingFilters>({
    period: 'daily', // Note: 'period' and 'game' filters are not used in the API call yet.
    game: 'all',
    sort: 'scoreDesc',
    page: 1,
  });

  const [items, setItems] = useState<RankingItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchData = async () => {
      setStatus('loading');
      try {
        const params = {
          page: filters.page - 1, // Spring Pageable is 0-indexed
          size: PAGE_SIZE,
          sort: sortMapping[filters.sort],
        };
        const response = await getRankings(params);
        setItems(response.data);

        if (response.data.length < PAGE_SIZE) {
          setTotalPages(filters.page);
        } else if (totalPages <= filters.page) {
          setTotalPages(filters.page + 1);
        }

        setStatus('success');
      } catch (e) {
        setStatus('error');
        console.error(e);
      }
    };
    fetchData();
  }, [filters]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <RankingSkeleton />;
      case 'error':
        return <RankingError />;
      case 'success':
        if (items.length === 0) {
          return <RankingEmpty />;
        }
        return (
          <>
            <RankingTable items={items} />
            <RankingPagination
              page={filters.page}
              totalPages={totalPages}
              onChange={(page) => setFilters((f) => ({ ...f, page }))}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
      <Layout>
        <div className="ranking-container">
          <h1>Ranking</h1>
          <RankingControls value={filters} onChange={setFilters}/>
          {renderContent()}
        </div>
      </Layout>
  );
};

export default Ranking;
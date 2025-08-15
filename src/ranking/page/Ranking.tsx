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

const PAGE_SIZE = 10;

const sortMapping: { [key: string]: string } = {
  scoreDesc: 'totalScore,desc',
  scoreAsc: 'totalScore,asc',
  rankAsc: 'rank,asc',
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

        // API doesn't return total pages, so we infer it.
        // If returned items are less than page size, it's the last page.
        if (response.data.length < PAGE_SIZE) {
          setTotalPages(filters.page);
        } else if (totalPages <= filters.page) {
          // If we got a full page, there might be a next page.
          setTotalPages(filters.page + 1);
        }

        setStatus('success');
      } catch (e) {
        setStatus('error');
        console.error(e);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <h1>Ranking</h1>
        <div className="ranking-container">
          <RankingControls value={filters} onChange={setFilters} />
          {renderContent()}
        </div>
      </Layout>
  );
};

export default Ranking;
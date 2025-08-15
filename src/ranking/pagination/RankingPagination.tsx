import React from 'react';
import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/material';

export interface RankingPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const RankingPagination: React.FC<RankingPaginationProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default RankingPagination;
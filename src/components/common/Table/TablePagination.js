import React from 'react';
import { Box, IconButton, Typography, Select, MenuItem } from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';

const TablePagination = ({
  pageSize,
  setPageSize,
  pageIndex,
  gotoPage,
  pageCount,
  totalCount,
}) => {
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
  };

  const handleFirstPageClick = () => {
    gotoPage(0);
  };

  const handlePreviousPageClick = () => {
    gotoPage(pageIndex - 1);
  };

  const handleNextPageClick = () => {
    gotoPage(pageIndex + 1);
  };

  const handleLastPageClick = () => {
    gotoPage(pageCount - 1);
  };

  if (totalCount === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">Rows per page:</Typography>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          size="small"
          sx={{ minWidth: 80 }}
        >
          {[5, 10, 25, 50, 100].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">
          {pageIndex * pageSize + 1}-
          {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount}
        </Typography>
        
        <IconButton
          onClick={handleFirstPageClick}
          disabled={pageIndex === 0}
          size="small"
        >
          <FirstPage fontSize="small" />
        </IconButton>
        
        <IconButton
          onClick={handlePreviousPageClick}
          disabled={pageIndex === 0}
          size="small"
        >
          <KeyboardArrowLeft fontSize="small" />
        </IconButton>
        
        <IconButton
          onClick={handleNextPageClick}
          disabled={pageIndex >= pageCount - 1}
          size="small"
        >
          <KeyboardArrowRight fontSize="small" />
        </IconButton>
        
        <IconButton
          onClick={handleLastPageClick}
          disabled={pageIndex >= pageCount - 1}
          size="small"
        >
          <LastPage fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TablePagination;
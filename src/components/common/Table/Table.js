import React from 'react';
import {
  Box,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  CircularProgress,
  Typography
} from '@mui/material';
import TablePagination from './TablePagination';

const Table = ({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  page,
  prepareRow,
  state,
  gotoPage,
  setPageSize,
  loading,
  manualPagination,
  pageCount: controlledPageCount,
  totalCount,
}) => {
  const { pageIndex, pageSize } = state;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }} elevation={2}>
        <TableContainer sx={{ maxHeight: '70vh' }}>
          <MuiTable {...getTableProps()} stickyHeader>
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <TableCell
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'background.paper',
                        minWidth: column.minWidth,
                      }}
                    >
                      {column.render('Header')}
                      {column.isSorted && (
                        <TableSortLabel
                          active={column.isSorted}
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {loading ? (
                <TableRow>
                  <TableCell 
                    colSpan={headerGroups[0]?.headers.length || 1} 
                    align="center"
                    sx={{ py: 5 }}
                  >
                    <CircularProgress size={40} />
                    <Typography sx={{ mt: 2 }}>Loading data...</Typography>
                  </TableCell>
                </TableRow>
              ) : page.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={headerGroups[0]?.headers.length || 1} 
                    align="center"
                    sx={{ py: 5 }}
                  >
                    <Typography variant="body1">No records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                page.map(row => {
                  prepareRow(row);
                  return (
                    <TableRow 
                      hover 
                      {...row.getRowProps()}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      {row.cells.map(cell => (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>
        <TablePagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          gotoPage={gotoPage}
          totalCount={totalCount || 0}
          pageCount={manualPagination ? controlledPageCount : Math.ceil((totalCount || 0) / pageSize)}
        />
      </Paper>
    </Box>
  );
};

export default Table;
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
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
    <div className="w-full overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      style={{ minWidth: column.minWidth }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.render('Header')}</span>
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ArrowDownwardIcon className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ArrowUpwardIcon className="w-4 h-4 text-gray-400" />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200"
            >
              {loading ? (
                <tr>
                  <td
                    colSpan={headerGroups[0]?.headers.length || 1}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <CircularProgress size={40} className="text-blue-600" />
                      <p className="mt-4 text-sm text-gray-500">Loading data...</p>
                    </div>
                  </td>
                </tr>
              ) : page.length === 0 ? (
                <tr>
                  <td
                    colSpan={headerGroups[0]?.headers.length || 1}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-base font-medium text-gray-500">No records found</p>
                      <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                page.map(row => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.cells.map(cell => (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-t border-gray-200">
          <TablePagination
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            gotoPage={gotoPage}
            totalCount={totalCount || 0}
            pageCount={manualPagination ? controlledPageCount : Math.ceil((totalCount || 0) / pageSize)}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
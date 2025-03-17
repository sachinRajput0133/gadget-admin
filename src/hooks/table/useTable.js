import { useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

export const useReactTable = (columns, data, options = {}) => {
  console.log("🚀 ~ useReactTable ~ columns:", columns)
  const {
    initialState = {},
    manualPagination = false,
    manualSortBy = false,
    disableSortBy = false,
    disablePagination = false,
  } = options;

  // Ensure columns and data are always arrays, even if undefined is passed
  const memoizedColumns = useMemo(() => columns || [], [columns]);
  const memoizedData = useMemo(() => data || [], [data]);
  
  // Dynamically determine which plugins to use
  const plugins = [];
  if (!disableSortBy) plugins.push(useSortBy);
  if (!disablePagination) plugins.push(usePagination);
  plugins.push(useRowSelect);

  const tableInstance = useTable(
    {
      columns: memoizedColumns,
      data: memoizedData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        ...initialState
      },
      manualPagination,
      manualSortBy,
      autoResetPage: !manualPagination,
      autoResetSortBy: !manualSortBy,
    },
    ...plugins
  );

  return {tableInstance};
};

export default useReactTable;
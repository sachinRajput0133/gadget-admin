import { useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

export const useReactTable = (columns, data, options = {}) => {
  const {
    initialState = {},
    manualPagination = false,
    manualSortBy = false,
  } = options;

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

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
    useSortBy,
    usePagination,
    useRowSelect
  );

  return tableInstance;
};

export default useReactTable;
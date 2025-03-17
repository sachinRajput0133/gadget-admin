import { useMemo } from 'react';
import moment from 'moment';
import { Chip } from '@mui/material';

const useArticlesTable = () => {
  const columns = useMemo(() => [
    {
      Header: 'Title',
      accessor: 'title',
      minWidth: 200,
      Cell: ({ value, row }) => (
        <div className="font-medium text-gray-900 truncate max-w-xs">
          {value}
        </div>
      ),
    },
    {
      Header: 'Category',
      accessor: 'category.name',
      Cell: ({ value }) => value || 'Uncategorized',
    },
    {
      Header: 'Section',
      accessor: 'section.name',
      Cell: ({ value }) => value || 'None',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={
            value === 'published' ? 'success' :
            value === 'draft' ? 'default' : 'warning'
          }
          size="small"
        />
      ),
    },
    {
      Header: 'Published',
      accessor: 'publishedAt',
      Cell: ({ value }) => value ? moment(value).format('MMM D, YYYY') : 'Not published',
    },
    {
      Header: 'Last Updated',
      accessor: 'updatedAt',
      Cell: ({ value }) => moment(value).format('MMM D, YYYY'),
    }
  ], []);

  return { columns };
};

export default useArticlesTable;
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';

const useDashboardTable = ({ onView }) => {
  const columns = React.useMemo(() => [
    {
      Header: 'Title',
      accessor: 'title',
      Cell: ({ value }) => (
        <Typography variant="body1" fontWeight="medium">
          {value}
        </Typography>
      )
    },
    {
      Header: 'Type',
      accessor: 'type',
      Cell: ({ value }) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={
            value === 'article' ? 'primary' :
            value === 'review' ? 'success' : 'default'
          }
          size="small"
        />
      )
    },
    {
      Header: 'Views',
      accessor: 'views',
      Cell: ({ value }) => (
        <Typography variant="body2">
          {value.toLocaleString()}
        </Typography>
      )
    },
    {
      Header: 'Date',
      accessor: 'createdAt',
      Cell: ({ value }) => (
        <Typography variant="body2" color="textSecondary">
          {moment(value).format('MMM D, YYYY')}
        </Typography>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ value }) => (
        <Box display="flex" justifyContent="flex-end">
          <button
            onClick={() => onView(value)}
            className="icon-button text-green-600 hover:text-green-900"
            title="View"
          >
            <VisibilityIcon className="h-5 w-5" />
          </button>
        </Box>
      )
    },
  ], [onView]);

  return { columns };
};

export default useDashboardTable;
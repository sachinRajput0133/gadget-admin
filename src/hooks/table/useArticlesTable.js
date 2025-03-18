import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'moment';

const useArticlesTable = ({ onEdit, onDelete, onView }) => {
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
      Header: 'Category',
      accessor: 'category',
      Cell: ({ value }) => (
        <Typography variant="body2" color="textSecondary">
          {value ? value.title : '-'}
        </Typography>
      )
    },
    {
      Header: 'Section',
      accessor: 'section',
      Cell: ({ value }) => (
        <Typography variant="body2" color="textSecondary">
          {value ? value.title : '-'}
        </Typography>
      )
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <Chip
          // label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={
            value === 'published' ? 'success' :
            value === 'draft' ? 'default' : 'warning'
          }
          size="small"
        />
      )
    },
    {
      Header: 'Last Updated',
      accessor: 'updatedAt',
      Cell: ({ value }) => (
        <Typography variant="body2" color="textSecondary">
          {moment(value).format('MMM D, YYYY')}
        </Typography>
      )
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ value, row }) => (
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <button
            onClick={() => onView(value)}
            className="icon-button text-green-600 hover:text-green-900"
            title="View"
          >
            <VisibilityIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit(value)}
            className="icon-button text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <EditIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(value)}
            className="icon-button text-red-600 hover:text-red-900"
            title="Delete"
          >
            <DeleteIcon className="h-5 w-5" />
          </button>
        </Box>
      )
    },
  ], [onEdit, onDelete, onView]);

  return { columns };
};

export default useArticlesTable;
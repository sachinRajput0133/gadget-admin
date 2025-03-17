import React from 'react';
import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const useSectionsTable = ({ onEdit, onDelete }) => {
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
      Header: 'Slug',
      accessor: 'slug',
      Cell: ({ value }) => (
        <Typography variant="body2" color="textSecondary">
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
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <button
            onClick={() => onEdit(row.original.slug)}
            className="icon-button text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <EditIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(row.original.slug)}
            className="icon-button text-red-600 hover:text-red-900"
            title="Delete"
          >
            <DeleteIcon className="h-5 w-5" />
          </button>
        </Box>
      )
    },
  ], [onEdit, onDelete]);

  return { columns };
};

export default useSectionsTable;
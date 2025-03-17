import {
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
  } from '@mui/material';
  import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
  } from '@mui/icons-material';
import React from 'react';

const useRolesTable = ({ onEdit, onDelete }) => {
  const columns = React.useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ value }) => (
        <Typography variant="body1" fontWeight="medium">
          {value}
        </Typography>
      )
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Status',
      accessor: 'isActive',
      Cell: ({ value, row }) => (
        <Box>
          <Chip
            label={value ? 'Active' : 'Inactive'}
            color={value ? 'success' : 'error'}
            size="small"
          />
          {row.original.isDefault && (
            <Chip
              label="Default"
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      )
    },
    {
      Header: 'Permissions',
      accessor: 'permissions',
      Cell: ({ value }) => `${value ? value.length : 0} permissions`
    },
    {
      Header: 'Actions',
      accessor: '_id',
      Cell: ({ value, row }) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => onEdit(value)}
            title="Edit role"
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDelete(row.original)}
            title="Delete role"
            disabled={row.original.isDefault}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    },
  ], []);

  return { columns };
};

export default useRolesTable;

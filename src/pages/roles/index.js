import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import useRolesTable from '../../hooks/table/useRolesTable';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { fetchRoles, deleteRole } from '../../store/slices/roleSlice';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import useReactTable from '../../hooks/table/useTable';
import { setNotification } from '../../store/slices/uiSlice';
// import useReactTable from '../../hooks/table/useTable';
import Table from '../../components/common/Table/Table';

const RolesPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { roles, loading, error } = useSelector((state) => state.roles);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [filteredRoles, setFilteredRoles] = useState([]);

  useEffect(() => {
    // Reset the dialog state when the component mounts
    setOpenDeleteDialog(false);
    setRoleToDelete(null);
    
    // Fetch roles data
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    // Filter roles when search term or roles data changes
    if (roles) {
      const filtered = roles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  }, [roles, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateRole = () => {
    router.push('/roles/create');
  };

  const handleEditRole = (roleId) => {
    router.push(`/roles/edit/${roleId}`);
  };

  const handleDeleteClick = (role) => {
    // Only set the role to delete and open the dialog if we have a valid role
    if (role && role._id) {
      setRoleToDelete(role);
      setOpenDeleteDialog(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!roleToDelete || !roleToDelete._id) {
        setOpenDeleteDialog(false);
        return;
      }
      
      await dispatch(deleteRole(roleToDelete._id)).unwrap();
      dispatch(setNotification({
        type: 'success',
        message: `Role "${roleToDelete.name}" deleted successfully`,
      }));
      setOpenDeleteDialog(false);
      setRoleToDelete(null);
    } catch (error) {
      dispatch(setNotification({
        type: 'error',
        message: error || 'Failed to delete role',
      }));
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setRoleToDelete(null);
  };

  const { columns } = useRolesTable({
    onEdit: handleEditRole,
    onDelete: handleDeleteClick
  });

  const { tableInstance } = useReactTable(columns, filteredRoles ?? []);

  return (
    <Layout title="Roles Management">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Roles Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateRole}
          >
            Create Role
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Table 
            getTableProps={tableInstance.getTableProps}
            getTableBodyProps={tableInstance.getTableBodyProps}
            headerGroups={tableInstance.headerGroups}
            page={tableInstance.page}
            prepareRow={tableInstance.prepareRow}
            state={tableInstance.state}
            gotoPage={tableInstance.gotoPage}
            setPageSize={tableInstance.setPageSize}
            loading={loading}
            totalCount={(filteredRoles || []).length}
            pageCount={tableInstance.pageCount}
          />
      </Box>

      {/* <ConfirmDialog
        open={Boolean(openDeleteDialog && roleToDelete)}
        title="Delete Role"
        content={roleToDelete ? `Are you sure you want to delete the role "${roleToDelete.name}"? This action cannot be undone.` : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      /> */}
    </Layout>
  );
};

export default RolesPage;
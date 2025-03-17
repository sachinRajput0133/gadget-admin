import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
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
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { fetchRoles, deleteRole } from '../../store/slices/roleSlice';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { setNotification } from '../../store/slices/uiSlice';

const RolesPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { roles, loading, error } = useSelector((state) => state.roles);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  useEffect(() => {
    // Reset the dialog state when the component mounts
    setOpenDeleteDialog(false);
    setRoleToDelete(null);
    
    // Fetch roles data
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
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

  // Filter roles by search term
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate roles
  const paginatedRoles = filteredRoles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRoles.map((role) => (
                  <TableRow key={role._id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={role.isActive ? 'Active' : 'Inactive'}
                        color={role.isActive ? 'success' : 'error'}
                        size="small"
                      />
                      {role.isDefault && (
                        <Chip
                          label="Default"
                          color="primary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {role.permissions ? role.permissions.length : 0} permissions
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditRole(role._id)}
                        title="Edit role"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(role)}
                        title="Delete role"
                        disabled={role.isDefault}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRoles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      <ConfirmDialog
        open={Boolean(openDeleteDialog && roleToDelete)}
        title="Delete Role"
        content={roleToDelete ? `Are you sure you want to delete the role "${roleToDelete.name}"? This action cannot be undone.` : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Layout>
  );
};

export default RolesPage;

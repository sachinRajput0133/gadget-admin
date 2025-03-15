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
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { fetchUsers, deleteUser } from '../../store/slices/usersSlice';
import Layout from '../../components/layout/Layout';

const UsersPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { users, loading, error } = useSelector((state) => state.users);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (id) => {
    router.push(`/users/edit/${id}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(userToDelete._id)).unwrap();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleCreateUser = () => {
    router.push('/users/create');
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Users Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
          >
            Create User
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
                <Table stickyHeader aria-label="users table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.role?.name || (typeof user.role === 'string' ? user.role : 'No Role')}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.isActive ? 'Active' : 'Inactive'}
                              color={user.isActive ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(user._id)}
                              aria-label="edit user"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(user)}
                              aria-label="delete user"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm User Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default UsersPage;

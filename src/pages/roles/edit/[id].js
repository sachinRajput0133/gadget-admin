import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import Layout from '../../../components/layout/Layout';
import RoleForm from '../../../components/roles/RoleForm';
import { fetchRole, clearSelectedRole } from '../../../store/slices/roleSlice';
import { setNotification } from '../../../store/slices/uiSlice';

const EditRolePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { selectedRole, loading, error } = useSelector((state) => state.roles);

  useEffect(() => {
    if (id) {
      dispatch(fetchRole(id)).catch((err) => {
        dispatch(setNotification({
          type: 'error',
          message: 'Failed to load role: ' + (err.message || err),
        }));
        router.push('/roles');
      });
    }

    return () => {
      dispatch(clearSelectedRole());
    };
  }, [dispatch, id, router]);

  if (loading || !selectedRole) {
    return (
      <Layout title="Edit Role">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title={`Edit Role: ${selectedRole.name}`}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Role: {selectedRole.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Modify role details and permissions. Changes will affect all users with this role.
        </Typography>
        
        <RoleForm role={selectedRole} />
      </Box>
    </Layout>
  );
};

export default EditRolePage;

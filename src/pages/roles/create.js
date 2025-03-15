import React from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../../components/layout/Layout';
import RoleForm from '../../components/roles/RoleForm';

const CreateRolePage = () => {
  return (
    <Layout title="Create Role">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Role
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Create a new role with specific permissions. Roles are used to control access to different features of the application.
        </Typography>
        
        <RoleForm />
      </Box>
    </Layout>
  );
};

export default CreateRolePage;

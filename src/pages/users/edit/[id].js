import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Layout from '../../../components/layout/Layout';
import RoleAssignment from '../../../components/users/RoleAssignment';
import { fetchUser, updateUser, clearUserError } from '../../../store/slices/usersSlice';

const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector((state) => state.users);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isActive: true,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchUser(id));
    }
    
    return () => {
      dispatch(clearUserError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        isActive: selectedUser.isActive !== undefined ? selectedUser.isActive : true,
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const val = e.target.type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: val,
    });
    
    // Clear field-specific error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      await dispatch(updateUser({
        userId: id,
        userData: formData,
      })).unwrap();
      
      dispatch(fetchUser(id)); // Refresh user data
    } catch (err) {
      console.error('Failed to update user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/users');
  };

  if (loading && !selectedUser) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!loading && !selectedUser && id) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">User not found</Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Users
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Edit User
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Details
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  disabled={submitting}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={submitting}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange}
                      name="isActive"
                      color="primary"
                      disabled={submitting}
                    />
                  }
                  label="Active"
                  sx={{ mt: 2, mb: 2 }}
                />
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} /> : null}
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {selectedUser && (
              <RoleAssignment user={selectedUser} />
            )}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default EditUserPage;

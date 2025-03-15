import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { fetchRoles } from '../../store/slices/roleSlice';
import { setNotification } from '../../store/slices/uiSlice';
import CONFIG from '../../../config/env';

const CreateUserPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { roles, loading: rolesLoading } = useSelector((state) => state.roles);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    isActive: true,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

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
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      errors.role = 'Role is required';
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
    setError(null);
    
    try {
      const response = await fetch(`${CONFIG.API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          isActive: formData.isActive,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }
      
      dispatch(setNotification({
        type: 'success',
        message: 'User created successfully',
      }));
      
      router.push('/users');
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/users');
  };

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
            Create User
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Paper sx={{ p: 3 }}>
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
                
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  disabled={submitting}
                />
                
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  margin="normal"
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  disabled={submitting}
                />
                
                <FormControl fullWidth margin="normal" error={!!formErrors.role}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                    disabled={submitting || rolesLoading}
                  >
                    {rolesLoading ? (
                      <MenuItem value="">
                        <CircularProgress size={20} /> Loading roles...
                      </MenuItem>
                    ) : roles.length === 0 ? (
                      <MenuItem value="">No roles available</MenuItem>
                    ) : (
                      roles.map((role) => (
                        <MenuItem key={role._id} value={role._id}>
                          {role.name} {role.isDefault && '(Default)'}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {formErrors.role && (
                    <Typography color="error" variant="caption">
                      {formErrors.role}
                    </Typography>
                  )}
                </FormControl>
                
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
                    {submitting ? 'Creating...' : 'Create User'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default CreateUserPage;

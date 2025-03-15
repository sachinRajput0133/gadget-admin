import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchRoles } from '../../store/slices/roleSlice';
import { setNotification } from '../../store/slices/uiSlice';
import { updateUser } from '../../store/slices/usersSlice';

const RoleAssignment = ({ user }) => {
  const dispatch = useDispatch();
  const { roles, loading: rolesLoading } = useSelector((state) => state.roles);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.role) {
      setSelectedRoleId(typeof user.role === 'object' ? user.role._id : user.role);
    }
  }, [user]);

  const handleRoleChange = (event) => {
    setSelectedRoleId(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedRoleId) {
      setError('Please select a role');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await dispatch(updateUser({
        userId: user._id,
        userData: { role: selectedRoleId }
      })).unwrap();

      dispatch(setNotification({
        type: 'success',
        message: `Role updated successfully for ${user.name}`
      }));
    } catch (err) {
      setError(err || 'Failed to update user role');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Role Assignment
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="role-select-label">Role</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          value={selectedRoleId}
          label="Role"
          onChange={handleRoleChange}
          disabled={rolesLoading || submitting}
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
      </FormControl>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting || rolesLoading}
          startIcon={submitting && <CircularProgress size={20} />}
        >
          {submitting ? 'Updating...' : 'Update Role'}
        </Button>
      </Box>
    </Box>
  );
};

export default RoleAssignment;

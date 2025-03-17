import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { 
  createRole, 
  updateRole, 
  updateRolePermissions, 
  fetchPermissionsByModule 
} from '../../store/slices/roleSlice';
import { setNotification } from '../../store/slices/uiSlice';

const RoleForm = ({ role }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { permissionsByModule, loading } = useSelector((state) => state.roles);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    isDefault: false,
  });
  
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load permissions grouped by module
  useEffect(() => {
    // dispatch(fetchPermissionsByModule());
  }, []);

  // Initialize form with role data if editing
  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        isActive: role.isActive || true,
        isDefault: role.isDefault || false,
      });
      
      // Set selected permissions
      const permMap = {};
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach(perm => {
          if (typeof perm === 'string') {
            permMap[perm] = true;
          } else if (perm._id) {
            permMap[perm._id] = true;
          }
        });
      }
      setSelectedPermissions(permMap);
    }
  }, [role]);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Role name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions({
      ...selectedPermissions,
      [permissionId]: !selectedPermissions[permissionId],
    });
  };

  const handleSelectAllModulePermissions = (module, permissions, select) => {
    const updatedPermissions = { ...selectedPermissions };
    
    permissions.forEach(permission => {
      updatedPermissions[permission._id] = select;
    });
    
    setSelectedPermissions(updatedPermissions);
  };

  const getModuleSelectedCount = (permissions) => {
    let count = 0;
    permissions.forEach(permission => {
      if (selectedPermissions[permission._id]) count++;
    });
    return count;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validate();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) return;
    
    setSubmitting(true);
    
    try {
      // Get all selected permission IDs
      const permissionIds = Object.keys(selectedPermissions).filter(
        id => selectedPermissions[id]
      );
      
      if (role) {
        // Update existing role
        const updatedRole = await dispatch(updateRole({
          id: role._id,
          roleData: formData,
        })).unwrap();
        
        // Update role permissions
        await dispatch(updateRolePermissions({
          roleId: role._id,
          permissionIds,
        })).unwrap();
        
        dispatch(setNotification({
          type: 'success',
          message: 'Role updated successfully',
        }));
      } else {
        // Create new role
        const newRole = await dispatch(createRole(formData)).unwrap();
        
        // Update role permissions
        await dispatch(updateRolePermissions({
          roleId: newRole._id,
          permissionIds,
        })).unwrap();
        
        dispatch(setNotification({
          type: 'success',
          message: 'Role created successfully',
        }));
      }
      
      // Redirect to roles list
      router.push('/roles');
    } catch (error) {
      dispatch(setNotification({
        type: 'error',
        message: error || 'Failed to save role',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {role ? 'Edit Role' : 'Create New Role'}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Role Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
            disabled={submitting}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!formErrors.description}
            helperText={formErrors.description}
            required
            multiline
            rows={2}
            disabled={submitting}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={submitting}
                />
              }
              label="Active"
            />
            
            <FormControlLabel
              control={
                <Switch
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  disabled={submitting}
                />
              }
              label="Default for new users"
            />
          </Box>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Permissions
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {Object.keys(permissionsByModule).length === 0 ? (
              <Typography>No permissions found</Typography>
            ) : (
              Object.entries(permissionsByModule).map(([module, permissions]) => (
                <Accordion key={module} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1">{module.toUpperCase()}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getModuleSelectedCount(permissions)} of {permissions.length} selected
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mb: 1 }}>
                      <Button 
                        size="small" 
                        onClick={() => handleSelectAllModulePermissions(module, permissions, true)}
                      >
                        Select All
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => handleSelectAllModulePermissions(module, permissions, false)}
                      >
                        Deselect All
                      </Button>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Available Permissions</FormLabel>
                      <FormGroup>
                        {permissions.map(permission => (
                          <FormControlLabel
                            key={permission._id}
                            control={
                              <Checkbox
                                checked={!!selectedPermissions[permission._id]}
                                onChange={() => handlePermissionChange(permission._id)}
                                name={permission.code}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2">{permission.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {permission.description}
                                </Typography>
                              </Box>
                            }
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Box>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => router.push('/roles')}
          disabled={submitting}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
          startIcon={submitting && <CircularProgress size={20} />}
        >
          {submitting ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
        </Button>
      </Box>
    </Box>
  );
};

export default RoleForm;

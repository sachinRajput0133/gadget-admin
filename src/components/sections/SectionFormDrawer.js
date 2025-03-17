import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
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
  FormHelperText,
  Grid
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormDrawer from '../common/Drawer/FormDrawer';
import { 
  createRole, 
  updateRole, 
  updateRolePermissions, 
  fetchPermissionsByModule 
} from '../../store/slices/roleSlice';

const RoleFormDrawer = ({ 
  open, 
  onClose, 
  roleToEdit = null, 
  onSuccess 
}) => {
  const dispatch = useDispatch();
  const { permissionsByModule, loading } = useSelector((state) => state.roles);
  
  // Set up react-hook-form with native validation
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors, isValid } 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      isDefault: false
    }
  });
  
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load permissions grouped by module
  useEffect(() => {
    if (open) {
      dispatch(fetchPermissionsByModule());
    }
  }, [dispatch, open]);
  
  // Reset form with role data when editing
  useEffect(() => {
    if (roleToEdit) {
      reset({
        name: roleToEdit.name || '',
        description: roleToEdit.description || '',
        isActive: roleToEdit.isActive !== undefined ? roleToEdit.isActive : true,
        isDefault: roleToEdit.isDefault || false
      });
      
      // Set selected permissions from the role
      const permissionMap = {};
      if (roleToEdit.permissions && Array.isArray(roleToEdit.permissions)) {
        roleToEdit.permissions.forEach(permission => {
          permissionMap[permission._id] = true;
        });
      }
      setSelectedPermissions(permissionMap);
    } else {
      reset({
        name: '',
        description: '',
        isActive: true,
        isDefault: false
      });
      setSelectedPermissions({});
    }
  }, [roleToEdit, reset]);
  
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };
  
  const handleSelectAllModulePermissions = (modulePermissions, isSelected) => {
    const updatedPermissions = { ...selectedPermissions };
    
    // For each permission in the module, update its selection state
    modulePermissions.forEach(permission => {
      updatedPermissions[permission._id] = isSelected;
    });
    
    setSelectedPermissions(updatedPermissions);
  };
  
  // Check if all permissions in a module are selected
  const areAllModulePermissionsSelected = (modulePermissions) => {
    return modulePermissions.every(permission => selectedPermissions[permission._id]);
  };
  
  // Check if any permissions in a module are selected
  const areAnyModulePermissionsSelected = (modulePermissions) => {
    return modulePermissions.some(permission => selectedPermissions[permission._id]);
  };
  
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Get all selected permission IDs
      const permissionIds = Object.keys(selectedPermissions).filter(
        id => selectedPermissions[id]
      );
      
      if (roleToEdit) {
        // Update existing role
        await dispatch(updateRole({
          id: roleToEdit._id,
          roleData: data
        })).unwrap();
        
        // Update role permissions
        await dispatch(updateRolePermissions({
          roleId: roleToEdit._id,
          permissions: permissionIds
        })).unwrap();
        
        toast.success('Role updated successfully');
      } else {
        // Create new role
        const result = await dispatch(createRole({
          ...data,
          permissions: permissionIds
        })).unwrap();
        
        toast.success('Role created successfully');
      }
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save role');
    } finally {
      setSubmitting(false);
    }
  };
  
  const title = roleToEdit ? 'Edit Role' : 'Create Role';
  
  return (
    <FormDrawer 
      open={open} 
      onClose={onClose} 
      title={title}
      width={700}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Role name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Role Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={roleToEdit && roleToEdit.isDefault}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="isActive"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  }
                  label="Active"
                  disabled={roleToEdit && roleToEdit.isDefault}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="isDefault"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  }
                  label="Default Role"
                  disabled={roleToEdit && roleToEdit.isDefault}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Permissions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {/* Render permissions grouped by module */}
            {permissionsByModule && Object.keys(permissionsByModule).map((moduleName) => {
              const modulePermissions = permissionsByModule[moduleName];
              const allSelected = areAllModulePermissionsSelected(modulePermissions);
              const someSelected = areAnyModulePermissionsSelected(modulePermissions);
              
              return (
                <Accordion key={moduleName} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" width="100%">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={allSelected}
                            indeterminate={someSelected && !allSelected}
                            onChange={() => handleSelectAllModulePermissions(
                              modulePermissions, 
                              !allSelected
                            )}
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={moduleName}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ width: '100%' }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl component="fieldset">
                      <FormGroup>
                        {modulePermissions.map((permission) => (
                          <FormControlLabel
                            key={permission._id}
                            control={
                              <Checkbox
                                checked={!!selectedPermissions[permission._id]}
                                onChange={() => handlePermissionChange(permission._id)}
                              />
                            }
                            label={permission.description || permission.action}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button 
                onClick={onClose}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : 'Save Role'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </FormDrawer>
  );
};

export default RoleFormDrawer;
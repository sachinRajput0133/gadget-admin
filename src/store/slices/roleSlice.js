import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CONFIG from '../../../config/env';
import { getAuthHeader } from '../helper';

// Async thunks for roles
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/roles`, getAuthHeader());
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch roles');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch roles');
    }
  }
);

export const fetchRole = createAsyncThunk(
  'roles/fetchRole',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/roles/${id}`, getAuthHeader());
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch role');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch role');
    }
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/roles`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(roleData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create role');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create role');
    }
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, roleData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/roles/${id}`, {
        method: 'PUT',
        ...getAuthHeader(),
        body: JSON.stringify(roleData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update role');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update role');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/roles/${id}`, {
        method: 'DELETE',
        ...getAuthHeader(),
      });
      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.message || 'Failed to delete role');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete role');
    }
  }
);

export const updateRolePermissions = createAsyncThunk(
  'roles/updateRolePermissions',
  async ({ roleId, permissionIds }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/roles/${roleId}/permissions`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify({ permissionIds }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update role permissions');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update role permissions');
    }
  }
);

// Async thunks for permissions
export const fetchPermissions = createAsyncThunk(
  'roles/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/permissions`, getAuthHeader());
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch permissions');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch permissions');
    }
  }
);

export const fetchPermissionsByModule = createAsyncThunk(
  'roles/fetchPermissionsByModule',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/permissions/modules`, getAuthHeader());
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch permissions by module');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch permissions by module');
    }
  }
);

const initialState = {
  roles: [],
  selectedRole: null,
  permissions: [],
  permissionsByModule: {},
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single role
      .addCase(fetchRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRole.fulfilled, (state, action) => {
        state.selectedRole = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((role) => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole && state.selectedRole._id === action.payload._id) {
          state.selectedRole = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role._id !== action.payload);
        if (state.selectedRole && state.selectedRole._id === action.payload) {
          state.selectedRole = null;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update role permissions
      .addCase(updateRolePermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRolePermissions.fulfilled, (state, action) => {
        const index = state.roles.findIndex((role) => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole && state.selectedRole._id === action.payload._id) {
          state.selectedRole = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateRolePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch permissions by module
      .addCase(fetchPermissionsByModule.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissionsByModule.fulfilled, (state, action) => {
        state.permissionsByModule = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPermissionsByModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRoleError, clearSelectedRole } = roleSlice.actions;

export default roleSlice.reducer;

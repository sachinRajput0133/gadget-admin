import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../../../utils/routes';
import router from 'next/router';
import { setCookie, getCookie } from 'cookies-next';
import {KEYS} from '../../../utils/constant';
import commonApi from '../../../api/common';

const storeSessionData = async (data = {}) => {
  const token = data.token;

  // Store session data in Iron Session
  await fetch('/admin/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: token,
      user: {
        email: data.email,
        roles: data.roles,
        name: data.name,
        // compNm: data.compNm,
        // phone: `+${data.countryCode}-${data.mobNo}`,
      },
    }),
  });

  // Redirect to dashboard
  router.push(routes.dashboard);
};


export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log("loginnnn")
      const response = await commonApi({
        action: 'signInUser',
        data: { email, password },
      });
      console.log("🚀 ~ response:", response)
      const data = response.data;
      setCookie(KEYS.TOKEN, data.token);
      // setCookie(KEYS.EXPIRES, Math.floor(Date.now() / 1000) + response?.data?.expires);
      storeSessionData(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie(KEYS.TOKEN);
      if (!token) return rejectWithValue('No token found');
      const response = await commonApi({
        action: 'profile',
      });
      return response.data;
    } catch (error) {
      setCookie(KEYS.TOKEN, null);
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      setCookie(KEYS.TOKEN, null);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? getCookie(KEYS.TOKEN) : null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;

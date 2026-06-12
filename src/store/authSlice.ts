import type { PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const API_BASE = 'http://192.168.1.13:5001/api/v1/admin';
const WEB_API_BASE = 'http://192.168.1.13:5001/api/v1/admin';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface ProfileUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  profile: ProfileUser | null;
  profileLoading: boolean;
  profileError: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
  token: localStorage.getItem('admin_token'),
  loading: false,
  error: null,
  profile: null,
  profileLoading: false,
  profileError: null,
};

// ── Thunks ──

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res:any = await axios.post(`${API_BASE}/auth/login`, credentials);
      console.log(res,"Response")
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || 'Login failed'
      );
    }
  }
);

export const fetchAdminProfile = createAsyncThunk(
  'auth/fetchAdminProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      const res = await axios.get(`${WEB_API_BASE}/auth/profile`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data.user as ProfileUser;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || 'Failed to load profile'
      );
    }
  }
);
// ── Slice ──
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.profile = null;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── login ──
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user ?? action.payload.data ?? null;
        localStorage.setItem('admin_token', action.payload.token);
        localStorage.setItem('admin_user', JSON.stringify(state.user));
      })
      .addCase(loginAdmin.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ── fetchAdminProfile ──
      .addCase(fetchAdminProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action: PayloadAction<ProfileUser>) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action: PayloadAction<any>) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

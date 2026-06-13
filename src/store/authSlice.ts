import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://192.168.1.13:5001/api/v1/admin';

export interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  token: string | null;
  profile: ProfileUser | null;
  profileLoading: boolean;
  error: string | null;
   loading: boolean;
  
  
}

const initialState: any = {
  token: localStorage.getItem('admin_token'),
  profile: null,
  profileLoading: false,
  error: null,
};

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE}/auth/login`,
        {
          email,
          password,
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Login failed'
      );
    }
  }
);

// 1. Fetch Profile
export const fetchAdminProfile = createAsyncThunk('auth/fetchAdminProfile', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState };
    const res = await axios.get(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return res.data.data; // Path: res.data.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
  }
});

// 2. Update Profile (ID Based)
export const updateAdminProfile = createAsyncThunk('auth/updateAdminProfile', async ({ id, data }: { id: string; data: any }, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState };
    const res = await axios.put(`${API_BASE}/profile/${id}`, data, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

// 3. Delete Profile (ID Based)
export const deleteAdminProfile = createAsyncThunk('auth/deleteAdminProfile', async (id: string, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState };
    await axios.delete(`${API_BASE}/profile/${id}`, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Delete failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.profile = null;
      localStorage.clear();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProfile.pending, (state) => { state.profileLoading = true; })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileLoading = false;
      })
      .addCase(deleteAdminProfile.fulfilled, (state) => {
        state.profile = null;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
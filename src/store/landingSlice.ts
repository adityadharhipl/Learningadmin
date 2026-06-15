import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = 'http://localhost:5001/api/v1/admin/landing';

// Helper to get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// ---------------- TYPES ----------------
export interface Landing {
  _id?: string;
  [key: string]: any;
}

// ---------------- THUNKS ----------------

export const getLandings:any = createAsyncThunk(
  'landing/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API, getAuthHeaders());
      console.log('LANDING API RESPONSE:', res.data);
      
      const extracted = res.data.data || res.data.landings || res.data.result || res.data;
      
      // If the backend returns a single object (e.g., one global landing config), wrap it in an array so the table can map over it.
      if (extracted && !Array.isArray(extracted) && typeof extracted === 'object') {
        return [extracted];
      }
      
      return extracted || [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createLanding:any = createAsyncThunk(
  'landing/create',
  async (data: Landing, { rejectWithValue }) => {
    try {
      const res = await axios.post(API, data, getAuthHeaders());
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateLanding:any = createAsyncThunk(
  'landing/update',
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/${id}`, data, getAuthHeaders());
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteLanding:any = createAsyncThunk(
  'landing/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/${id}`, getAuthHeaders());
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ---------------- SLICE ----------------

const landingSlice = createSlice({
  name: 'landing',
  initialState: {
    landings: [] as Landing[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLandings.fulfilled, (state, action) => {
        state.landings = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload?.data || []);
      })
      .addCase(createLanding.fulfilled, (state, action) => {
        const newItem = action.payload?.data || action.payload;
        if (newItem) state.landings.unshift(newItem);
      })
      .addCase(updateLanding.fulfilled, (state, action) => {
        const updatedItem = action.payload?.data || action.payload;
        if (updatedItem && updatedItem._id) {
          state.landings = state.landings.map((l: any) =>
            l._id === updatedItem._id ? updatedItem : l
          );
        }
      })
      .addCase(deleteLanding.fulfilled, (state, action) => {
        state.landings = state.landings.filter(
          (l: any) => l._id !== action.payload
        );
      });
  },
});

export default landingSlice.reducer;
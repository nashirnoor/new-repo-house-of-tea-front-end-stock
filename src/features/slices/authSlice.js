import { login, logout } from '@/services/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'An error occurred');
    }
  }
);


export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return;
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue(error.response?.data || 'An error occurred during logout');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    isTokenExpired: false,
  },
  reducers: {
    setTokenExpired: (state, action) => {
      state.isTokenExpired = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.isTokenExpired = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.access;
      state.error = null;
      state.refreshToken = action.payload.refresh;
      state.isTokenExpired = false;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isTokenExpired = false;
      state.isLoading = false;
    })
    .addCase(logoutUser.rejected, (state, action) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isTokenExpired = false;
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { setTokenExpired, clearAuth } = authSlice.actions;
export default authSlice.reducer;

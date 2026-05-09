import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../api/APIs.js';
import { updateUserLocally } from '../authSliceTunk/authSlice.js';

export const fetchProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await userAPI.getProfile();
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await userAPI.updateProfile(data);
    dispatch(updateUserLocally(res.data.user));
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
  }
});

export const fetchStats = createAsyncThunk('user/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await userAPI.getStats();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    stats: null,
    recentDependencies: [],
    profileLoading: false,
    statsLoading: false,
    updateLoading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.profileLoading = true; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.profileLoading = false; state.profile = action.payload; })
      .addCase(fetchProfile.rejected, (state, action) => { state.profileLoading = false; state.error = action.payload; })

      .addCase(updateProfile.pending, (state) => { state.updateLoading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.updateLoading = false; state.profile = action.payload; })
      .addCase(updateProfile.rejected, (state, action) => { state.updateLoading = false; state.error = action.payload; })

      .addCase(fetchStats.pending, (state) => { state.statsLoading = true; })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.stats;
        state.recentDependencies = action.payload.recentDependencies;
      })
      .addCase(fetchStats.rejected, (state) => { state.statsLoading = false; });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
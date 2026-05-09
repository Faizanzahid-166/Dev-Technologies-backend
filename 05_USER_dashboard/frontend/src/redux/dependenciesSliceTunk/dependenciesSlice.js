import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dependenciesAPI } from '../../api/APIs.js';

export const fetchDependencies = createAsyncThunk('deps/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await dependenciesAPI.getAll(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch dependencies');
  }
});

export const createDependency = createAsyncThunk('deps/create', async (data, { rejectWithValue }) => {
  try {
    const res = await dependenciesAPI.create(data);
    return res.data.dependency;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create dependency');
  }
});

export const updateDependency = createAsyncThunk('deps/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await dependenciesAPI.update(id, data);
    return res.data.dependency;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update dependency');
  }
});

export const deleteDependency = createAsyncThunk('deps/delete', async (id, { rejectWithValue }) => {
  try {
    await dependenciesAPI.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete dependency');
  }
});

const depsSlice = createSlice({
  name: 'dependencies',
  initialState: {
    items: [],
    pagination: null,
    loading: false,
    actionLoading: false,
    error: null,
    filters: { status: '', priority: '', page: 1 },
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearDepsError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDependencies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDependencies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.dependencies;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDependencies.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createDependency.pending, (state) => { state.actionLoading = true; })
      .addCase(createDependency.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
        if (state.pagination) state.pagination.total += 1;
      })
      .addCase(createDependency.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })

      .addCase(updateDependency.pending, (state) => { state.actionLoading = true; })
      .addCase(updateDependency.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.items.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateDependency.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })

      .addCase(deleteDependency.pending, (state) => { state.actionLoading = true; })
      .addCase(deleteDependency.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter((d) => d._id !== action.payload);
        if (state.pagination) state.pagination.total -= 1;
      })
      .addCase(deleteDependency.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; });
  },
});

export const { setFilters, clearDepsError } = depsSlice.actions;
export default depsSlice.reducer;
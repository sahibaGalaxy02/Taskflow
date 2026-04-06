import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetchByBoard', async (boardId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/tasks/${boardId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load tasks');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/tasks', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => { state.error = null; },
    // Optimistic status update for drag & drop
    optimisticStatusUpdate: (state, action) => {
      const { id, status } = action.payload;
      const task = state.items.find((t) => t._id === id);
      if (task) task.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createTask.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(createTask.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearTaskError, optimisticStatusUpdate } = tasksSlice.actions;
export default tasksSlice.reducer;

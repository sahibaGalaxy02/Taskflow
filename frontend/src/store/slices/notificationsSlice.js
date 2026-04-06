import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/notifications');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load notifications');
    }
  }
);

export const markOneRead = createAsyncThunk(
  'notifications/markOneRead',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const markAllRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await api.patch('/notifications/read-all');
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notifications/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/notifications');
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const checkOverdue = createAsyncThunk(
  'notifications/checkOverdue',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/notifications/check-overdue');
      // Re-fetch notifications after checking
      const notifRes = await api.get('/notifications');
      return notifRes.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // markOneRead
      .addCase(markOneRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // markAllRead
      .addCase(markAllRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      })

      // delete one
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notif = state.items.find((n) => n._id === action.payload);
        if (notif && !notif.read) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.items = state.items.filter((n) => n._id !== action.payload);
      })

      // clear all
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.items = [];
        state.unreadCount = 0;
      })

      // checkOverdue refreshes the list
      .addCase(checkOverdue.fulfilled, (state, action) => {
        state.items = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      });
  },
});

export default notificationsSlice.reducer;

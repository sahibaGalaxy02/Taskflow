import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchBoards = createAsyncThunk('boards/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/boards');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load boards');
  }
});

export const createBoard = createAsyncThunk('boards/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/boards', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create board');
  }
});

export const deleteBoard = createAsyncThunk('boards/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/boards/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete board');
  }
});

const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBoardError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBoards.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchBoards.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createBoard.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(createBoard.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBoard.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearBoardError } = boardsSlice.actions;
export default boardsSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import boardsReducer from './slices/boardsSlice';
import tasksReducer from './slices/tasksSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
  },
});

export default store;

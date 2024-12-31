import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import fileReduser from '../features/files/fileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileReduser
  },
});

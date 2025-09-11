import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer:{
    auth: authReducer,
    ai: aiReducer,
  }
});

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

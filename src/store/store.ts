import { configureStore } from '@reduxjs/toolkit';
import pointReducer from './slices/pointSlice'
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer:{
    point: pointReducer,
    auth: authReducer,
  }
});

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

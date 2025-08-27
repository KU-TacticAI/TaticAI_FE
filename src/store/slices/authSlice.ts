import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  userId:string;
  nickname: string;
  profileLink: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    updateProfileLink: (state, action: PayloadAction<string | null>) => {
      if (state.user) {
        state.user.profileLink = action.payload;
      }
    },
  },
});

export const { login, logout, updateProfileLink } = authSlice.actions;
export default authSlice.reducer;

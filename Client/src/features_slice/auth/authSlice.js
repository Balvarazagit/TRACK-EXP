import { createSlice } from '@reduxjs/toolkit';
import { requestResetLink, resetPassword } from './authThunks';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    message: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestResetLink.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestResetLink.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(requestResetLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

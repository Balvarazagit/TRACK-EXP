import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './authAPI';

export const requestResetLink = createAsyncThunk(
  'auth/requestResetLink',
  async (email) => {
    const res = await api.sendResetLink(email);
    return res.data.message;
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }) => {
    const res = await api.submitNewPassword(token, password);
    return res.data.message;
  }
);

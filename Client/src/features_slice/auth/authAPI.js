import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

export const sendResetLink = (email) =>
  API.post('/api/auth/forgot-password', { email });

export const submitNewPassword = (token, password) =>
  API.post(`/api/auth/reset-password/${token}`, { password });

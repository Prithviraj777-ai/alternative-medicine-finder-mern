import API from './api';

export const register = async (userData) => {
  const response = await API.post('/api/auth/register', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await API.post('/api/auth/login', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await API.get('/api/auth/me');
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await API.post('/api/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await API.put(`/api/auth/reset-password/${token}`, { password });
  return response.data;
};
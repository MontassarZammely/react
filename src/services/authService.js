// src/services/authService.js
import axios from 'axios';

export const login = async (data) => {
  return await axios.post('/api/auth/login', data);
};

export const register = async (data) => {
  return await axios.post('/api/auth/register', data);
};

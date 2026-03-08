import axios from 'axios';

// Uses Next.js API routes which proxy to the backend server-side
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getUserOrders = async (telegramId: string | number) => {
  const response = await api.get(`/orders/${telegramId}`);
  return response.data;
};

export default api;

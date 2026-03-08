import axios from 'axios';

// Always use relative /api path - Next.js rewrites proxy this to the backend server
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

import axios from 'axios';

// In production: NEXT_PUBLIC_API_URL should be the PUBLIC backend domain (e.g. https://backend.traefik.me/api)
// In development: falls back to /api which is proxied by Next.js rewrites to localhost:3001
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

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

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  getRelatedProducts: (id) => api.get(`/products/${id}/related`),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getOrdersByStatus: (status) => api.get(`/orders/status/${status}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status?status=${status}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

// Promo Code API
export const promoAPI = {
  validatePromoCode: (code, originalPrice) => 
    api.post(`/promo/validate?code=${code}&originalPrice=${originalPrice}`),
};

export default api;
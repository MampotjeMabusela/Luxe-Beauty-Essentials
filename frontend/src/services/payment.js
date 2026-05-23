import api from './api';

export const paymentService = {
  initPaystack: (orderId) => api.post('/payments/paystack/initialize', { order_id: orderId }),
  verifyPaystack: (reference) => api.post('/payments/paystack/verify', { reference }),
  initEft: (orderId) => api.post('/payments/eft/initialize', { order_id: orderId }),
  getReceipt: (orderId) => api.get(`/payments/receipt/${orderId}`),
};

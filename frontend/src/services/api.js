import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Configure Axios with JWT authorization header interceptor
API.interceptors.request.use((req) => {
  const adminToken = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Check token
  if (adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  }
  return req;
});

// Export functions for non-auth APIs
export const searchMedicines = (name, config = {}) => API.get(`/medicines/search?name=${name}`, config);
export const getMedicineDetails = (id) => API.get(`/medicines/${id}`);
export const getAlternatives = (id) => API.get(`/medicines/${id}/alternatives`);
export const getLocalAvailability = (id, lat, lng) => API.get(`/medicines/${id}/local-availability`, { params: { lat, lng } });
export const getByCategory = (category, page = 1) => 
  API.get(`/medicines/category/${category}?page=${page}`);
export const createOrder = (orderData) => API.post(`/orders`, orderData);
export const createRazorpayOrder = (data) => API.post(`/payment/create-order`, data);
export const verifyRazorpayPayment = (data) => API.post(`/payment/verify-payment`, data);

export default API;
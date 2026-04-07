import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const searchMedicines = (name, config = {}) => API.get(`/medicines/search?name=${name}`, config);
export const getMedicineDetails = (id) => API.get(`/medicines/${id}`);
export const getAlternatives = (id) => API.get(`/medicines/${id}/alternatives`);
export const getByCategory = (category, page = 1) => 
  API.get(`/medicines/category/${category}?page=${page}`);
export const createOrder = (orderData) => API.post(`/orders`, orderData);

export default API;
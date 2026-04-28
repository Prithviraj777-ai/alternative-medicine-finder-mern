import API from './api';

export const getStats = async () => {
  const response = await API.get('/admin/stats');
  return response.data;
};

export const getUsers = async (page = 1, limit = 10) => {
  const response = await API.get(`/admin/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};

export const getMedicines = async (page = 1, limit = 10, search = '') => {
  const response = await API.get(`/admin/medicines?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const addMedicine = async (medicineData) => {
  const response = await API.post('/admin/medicines', medicineData);
  return response.data;
};

export const updateMedicine = async (id, medicineData) => {
  const response = await API.put(`/admin/medicines/${id}`, medicineData);
  return response.data;
};

export const deleteMedicine = async (id) => {
  const response = await API.delete(`/admin/medicines/${id}`);
  return response.data;
};

export const getOrders = async (page = 1, limit = 10) => {
  const response = await API.get(`/admin/orders?page=${page}&limit=${limit}`);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await API.delete(`/admin/orders/${id}`);
  return response.data;
};

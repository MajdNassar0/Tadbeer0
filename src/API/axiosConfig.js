import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://tadbeer0.runasp.net/api',
});

// إضافة التوكن تلقائياً لكل الطلبات دون تكرار الكود
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
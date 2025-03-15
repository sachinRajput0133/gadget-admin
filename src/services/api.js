import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors - logout user
    if (error.response && error.response.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Upload image to server/cloudinary
export const uploadImage = async (formData) => {
  const token = Cookies.get('token');
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.post(`${API_URL}/upload`, formData, config);
};

export default api;

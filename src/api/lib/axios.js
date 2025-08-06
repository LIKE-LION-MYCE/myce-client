import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_BASE_URL}`;

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // accessToken을 로컬 스토리지에서 가져옴
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as authStorage from '@/pages/login/utils/session';

const protectedApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const unprotectedApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

protectedApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

protectedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      authStorage.removeToken();
    }
    return Promise.reject(error);
  }
);

export { protectedApi, unprotectedApi };

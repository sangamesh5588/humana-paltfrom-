import axios from 'axios';
import Config from '../../app/config';
import Storage from '../storage';

export const ApiClient = axios.create({
  baseURL: Config.API_URL,
  timeout: Config.DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject Access Token
ApiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await Storage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Auto Refresh Tokens
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: ignore if not a 401 error or if request already tried to refresh
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return ApiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await Storage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh route using dedicated simple axios call to prevent circular interception
      const res = await axios.post(`${Config.API_URL}/auth/refresh`, { refreshToken });
      
      const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

      await Storage.setItem('accessToken', newAccess);
      await Storage.setItem('refreshToken', newRefresh);

      ApiClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      processQueue(null, newAccess);
      isRefreshing = false;

      return ApiClient(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      isRefreshing = false;

      // Wipe credentials and notify application context (can be handled by local redirect triggers)
      await Storage.removeItem('accessToken');
      await Storage.removeItem('refreshToken');
      
      return Promise.reject(refreshErr);
    }
  },
);

export default ApiClient;

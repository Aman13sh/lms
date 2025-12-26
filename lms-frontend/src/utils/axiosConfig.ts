// src/utils/axiosConfig.ts
// Axios configuration with interceptors for cookie-based authentication

import axios from 'axios';
import Cookies from 'js-cookie';

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.withCredentials = true; // Important: Send cookies with requests

// Request interceptor to add token to headers
axios.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = Cookies.get('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');

      if (refreshToken) {
        try {
          // Try to refresh the token
          const response = await axios.post('/api/auth/refresh-token', {
            refreshToken
          });

          if (response.data.success) {
            const { tokens } = response.data.data;
            const { accessToken, refreshToken: newRefreshToken } = tokens;

            // Update both tokens in cookies
            const isProduction = window.location.protocol === 'https:';
            Cookies.set('accessToken', accessToken, {
              expires: 7,
              secure: isProduction,
              sameSite: 'lax'
            });

            if (newRefreshToken) {
              Cookies.set('refreshToken', newRefreshToken, {
                expires: 30,
                secure: isProduction,
                sameSite: 'lax'
              });
            }

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, just clear cookies
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          Cookies.remove('user');
          Cookies.remove('customer');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
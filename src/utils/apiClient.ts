// apiClient.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_URL } from '@env';
import { useAuthStore } from 'store';
import Toast from 'react-native-toast-message';

interface FailedRequest {
  config: AxiosRequestConfig;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    // 'Content-Type': 'application/json',
  },
  validateStatus: (status) => true,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (prom.config.headers) {
        prom.config.headers["Authorization"] = `Bearer ${token}`;
      }
      prom.resolve(apiClient(prom.config));
    }
  });

  failedQueue = [];
};

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    console.log('Request:', config);
    const { token, guestToken, tokenType } = useAuthStore.getState();
    if ((token ? token : guestToken) && tokenType) {
      config.headers.Authorization = `${tokenType} ${token ? token : guestToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, setToken, logout } = useAuthStore.getState();

      if (!refreshToken) {
        // logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ config: originalRequest, resolve, reject });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(`${API_URL}/app_api/auth/refresh-token`, {
          refreshToken,
        });

        console.log("Refresh token response:", response.data);

        const { accessToken, tokenType } = response.data;

        setToken(accessToken, tokenType);

        processQueue(null, accessToken);

        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers.Authorization = `${tokenType} ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // logout();

        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please log in again.",
        });

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const status = error.response?.status;
    const data = (error.response?.data || {}) as { message?: string; error?: string };

    if (status === 403) {
      Toast.show({
        type: "error",
        text1: "Forbidden",
        text2: "You do not have permission to access this resource.",
      });
    } else if (status === 500) {
      Toast.show({
        type: "error",
        text1: "Server Error",
        text2: "Something went wrong on the server.",
      });
    } else if (error.message === "Network Error") {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Unable to connect. Please check your internet or VPN.",
      });
    } else if (error.code === "ECONNABORTED") {
      Toast.show({
        type: "error",
        text1: "Timeout",
        text2: "The request took too long. Please try again.",
      });
    } else {
      Toast.show({
        type: "error",
        text2: data.message || data.error || error.message || "An unexpected error occurred.",
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import { getUserSession } from '../../features/auth/services/authService';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the JWT token from Zustand store
axiosClient.interceptors.request.use(
  async (config) => {
    let token = useAuthStore.getState().token;

    // Fallback: if the store token is missing (e.g. race on first load),
    // fetch a fresh session directly from Amplify and update the store.
    if (!token) {
      const session = await getUserSession();
      token = session?.tokens?.idToken?.toString() ?? null;
      if (token) {
        useAuthStore.setState({ token });
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track whether a token refresh is already in flight so we don't fire multiple
// concurrent refresh attempts for simultaneous 401 responses.
let refreshPromise: Promise<string | null> | null = null;

// Interceptor to handle responses and global errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Deduplicate: if a refresh is already in flight, wait for it
      if (!refreshPromise) {
        refreshPromise = getUserSession(true) // force Cognito token refresh
          .then((session) => {
            const token = session?.tokens?.idToken?.toString() ?? null;
            if (token) useAuthStore.setState({ token });
            else useAuthStore.getState().checkSession(); // session truly gone
            return token;
          })
          .finally(() => { refreshPromise = null; });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { NavigateFunction } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 또는 배포용 주소
  withCredentials: true,
});

let refreshSubscribers: ((token: string) => void)[] = [];

const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = localStorage.getItem('Authorization');
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        let isRefreshing = false;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const response = await axios.post<{ token: string }>(
                '/refresh',
                {},
                { withCredentials: true }
            );
            const newToken = response.data.token;
            localStorage.setItem('Authorization', newToken);
            onRefreshed(newToken);
            isRefreshing = false;
          } catch (refreshError) {
            isRefreshing = false;
            localStorage.removeItem('Authorization');
            // useNavigate는 훅이므로 여기에서 직접 호출 불가 → App 단에서 catch 후 redirect 해야 함
            window.location.href = '/';
            return Promise.reject(refreshError);
          }
        }

        return new Promise((resolve) => {
          addSubscriber((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      return Promise.reject(error);
    }
);

export default axiosInstance;

import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { RankingItem } from '../ranking/table/RankingTable';

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

      const url = (config.url || '').toLowerCase();

      // 토큰을 붙이지 않을 경로들(로그인, 회원가입, 토큰 리프레시 등)
      const skipAuth = [
        '/users/sign-in',
        '/api/core/login',
        '/api/core/users/sign-in',
        '/token/refresh',
        '/refresh',
      ];

      if (skipAuth.some(path => url.endsWith(path))) {
        return config;
      }

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

export const getRankings = (params: { page: number; size: number; sort: string; }) => {
  return axiosInstance.get<RankingItem[]>('/api/user/ranking', { params });
};

export const login = (data: object) => {
    return axiosInstance.post('/api/core/login', data);
}

export const signIn = (data: object) => {
    return axiosInstance.post('/api/core/users/sign-in', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

export default axiosInstance;

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

      if (error.response?.status === 403) {
        const requestUrl = error.config?.url;
        if (requestUrl === '/api/core/users') {
          return Promise.reject(error);
        }
        alert("권한이 없습니다. 로그인 페이지로 이동합니다.");
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
);

/**
 * 랭킹을 가져오는 api
 * @param params : 'Pageable'
 */
export const getRankings = async (params: { page: number; size: number; sort: string; }) => {
  return await axiosInstance.get<RankingItem[]>('/api/core/api/user/ranking', { params });
};

/**
 * 로그인 api
 * -> 토큰을 localStoreage, Cookie에 저장
 * @param data : application/json
 */
export const loginApi = async (data: object) => {
    return await axiosInstance.post('/api/core/login', data);
}

/**
 * 로그아웃 api
 * -> 토큰 삭제
 */
export const logoutApi = async () => {
  const response = await axiosInstance.post('/api/core/logout', {});
  localStorage.removeItem('Authorization');
  return response;
}

/**
 * 회원가입 api
 * 회원 정보 + 프로필 사진
 * @param data : 'multipart/form-data'
 */
export const signIn = async (data: object) => {
  return await axiosInstance.post('/api/core/users/sign-in', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
}

/**
 * 회원 정보 조회
 */
export const getUser = async () => {
  return await axiosInstance.get('/api/core/users');
}

/**
 * 회원 정보 수정
 * @param data : 'multipart/form-data'
 */
export const updateUser = async (data: object) => {
  return await axiosInstance.put('/api/core/users', data, { // Changed to put and added a placeholder URL
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
}

/**
 * 비밀번호 변경
 * @param data : 'application/json'
 */
export const changePassword = async (data:object) => {
  return await axiosInstance.patch('/api/core/users/password', data, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

/**
 * 회원 삭제
 * @param data : 'application/json'
 */
export const deleteUser = async (data: object) => {
  return await axiosInstance.delete('/api/core/users', {
    data: data,
  });
}

export const getGameRoomsApi = async (gameName: string) => {
  return await axiosInstance.get(`/api/game/rooms/lobby/${gameName}`);
}

export const getGameRoomDetailApi = async (id: string) => {
  return await axiosInstance.get(`/api/game/rooms/${id}`);
}

export const getGameLobbyApi = async()=>{
  return await axiosInstance.get('/api/game/lobby')
}

export const createGameRoom = async(data:object)=>{
  return await axiosInstance.post('/api/game/rooms', data, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const enterGameRoom = async (id: string) => {
  return await axiosInstance.post(`/api/game/rooms/${id}`);
}

export const leaveGameRoom = async (id: string) => {
  return await axiosInstance.post(`/api/game/rooms/${id}/leave`);
}

export const getAiListApi = async () => {
  return await axiosInstance.get('/api/core/api/ai/user');
}

// export const getAiListsByUserIdsApi = async (params: { ids: number[]; }) => {
//   return await axiosInstance.get(`/api/core/api/ai/list`, {
//     params: {
//       ids: params.ids,
//     },
//   });
// }

export const selectAiApi = async (roomId: string, aiId: number) => {
  return await axiosInstance.post(`/api/game/rooms/${roomId}/ai/${aiId}`);
}

export default axiosInstance;
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

let isRefreshing = false;
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
    (response) => response,
    async (error: AxiosError) => {
      // let isRefreshing = false;

      const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean; });

      const status = error.response?.status;
      // 이미 한 번 재시도했거나, 리프레시/로그인 요청 자체면 패스
      const url = (originalRequest?.url || '').toString();
      const isRefreshCall = url.includes('/token/refresh');
      const isLoginCall = url.includes('/login');

      if (status !== 401 || originalRequest._retry || isRefreshCall || isLoginCall) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // 이미 누군가가 리프레시 중이면 큐에 넣고 토큰 갱신 후 재시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((newToken: string) => {
            try {
              originalRequest.headers = originalRequest.headers ?? {};
              (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;
              resolve(axiosInstance(originalRequest));
            } catch (e) {
              reject(e);
            }
          });
        });
      }

      // 내가 리프레시 담당자가 됨
      isRefreshing = true;
      try {
        // 주의: 인터셉터 미적용 인스턴스로 호출하거나 axios 기본 인스턴스 사용
        const { data } = await axiosInstance.post<{ token: string }>(
            '/api/core/token/refresh',
            {},
            { withCredentials: true }
        );

        const newAccess = data.token;
        // 저장 및 기본 헤더 갱신 (레이스 완화)
        localStorage.setItem('Authorization', newAccess);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccess}`;

        // 대기 중인 요청들 재시도
        onRefreshed(newAccess);

        // 내 것도 재시도
        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as any).Authorization = `Bearer ${newAccess}`;
        // isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        // 실패 시 큐 비우고 세션 정리
        refreshSubscribers = [];
        localStorage.removeItem('Authorization');
        // 필요하면 여기서 라우팅 처리
        alert("fail to get nefw tokens");
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
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
  return await axiosInstance.get('/api/core/api/ai');
}

export const createAiApi = async (formData: FormData) => {
  return await axiosInstance.post(`/api/core/api/ai`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const deleteAiApi = async  (id:string, data:object)=>{
  return await axiosInstance.delete(`/api/core/api/ai/${id}`, {
    data: data,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const updateAiApi = async (id: string, formData: FormData) => {
  return await axiosInstance.put(`/api/core/api/ai/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const selectAiApi = async (roomId: string, aiId: number) => {
  return await axiosInstance.post(`/api/game/rooms/${roomId}/ai/${aiId}`);
}

export const getAiResult = async ()=>{
  return await axiosInstance.get('/api/core/ai-statistics');
}

export const getGameResultDetail = async ()=>{
  return await axiosInstance.get('/api/game/result');
}

export default axiosInstance;
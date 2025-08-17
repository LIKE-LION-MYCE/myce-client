import axios, { HttpStatusCode } from 'axios';
import { reissue, setAccessTokenToStorage } from '../service/auth/AuthService';

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

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalRequest = err.config.url;
    const res = err.response;
    
    // 토큰 만료 처리
    if(err.status === HttpStatusCode.Unauthorized && res.data?.code === "EXPIRED_TOKEN") {
      try {
        const reissueResult = await reissue();
        if(reissueResult.status === HttpStatusCode.Ok) {
          console.log("Success to update token.");
          setAccessTokenToStorage(reissueResult);
          return instance(originalRequest);
        } 
      }catch(e) {
          console.log('Fail to update token.');
          localStorage.removeItem("access_token");
          cookieStore.delete("refresh_token");
          return Promise.reject(e);
        };
    }

    // 권한 없음 에러 처리 - 사용자 친화적인 메시지로 변환
    if (res?.status === 403 || res?.data?.code === "EXPO_ACCESS_DENIED" || 
        res?.data?.code === "EXPO_ADMIN_PERMISSION_DENIED" || res?.data?.code === "EXPO_EDIT_DENIED") {
      err.message = "접근 권한이 없습니다. 관리자에게 문의하세요.";
    }

    return Promise.reject(err);
  }
)

export default instance;

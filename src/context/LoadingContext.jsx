import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import axiosInstance from '../api/lib/axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import styles from './LoadingContext.module.css';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // useMemo를 사용하여 인터셉터 함수들이 컴포넌트 리렌더링 시 재생성되지 않도록 합니다.
  const interceptors = useMemo(() => {
    const requestInterceptor = (config) => {
      setIsLoading(true);
      return config;
    };

    const responseInterceptor = (response) => {
      setIsLoading(false);
      return response;
    };

    const errorInterceptor = (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    };

    return { requestInterceptor, responseInterceptor, errorInterceptor };
  }, []);

  useEffect(() => {
    const reqInterceptor = axiosInstance.interceptors.request.use(interceptors.requestInterceptor);
    const resInterceptor = axiosInstance.interceptors.response.use(interceptors.responseInterceptor, interceptors.errorInterceptor);

    // 클린업 함수: 컴포넌트가 언마운트될 때 인터셉터를 제거합니다.
    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [interceptors]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && (
        <div className={styles.overlay}>
          <LoadingSpinner message="요청을 처리 중입니다..." />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

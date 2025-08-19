import { useEffect, useState, useCallback } from 'react';
import { createSseInstance } from '../api/service/system/sse/SseListener';

const useRealtimeNotification = () => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [sseInstance, setSseInstance] = useState(null);

  const handleMessage = useCallback((event) => {
    try {
      console.log('SSE 알림 수신:', event.data);
      
      // SSE 연결 확인 메시지는 무시
      if (event.data.includes('SSE connected')) {
        return;
      }

      const notification = JSON.parse(event.data);
      
      if (notification.type && notification.message) {
        setCurrentNotification({
          ...notification,
          id: Date.now(),
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('알림 파싱 오류:', error);
    }
  }, []);

  const handleError = useCallback((error) => {
    console.error('SSE 연결 오류:', error);
    console.error('오류 상세 정보:', {
      type: error.type,
      target: error.target,
      readyState: error.target?.readyState,
      status: error.target?.status,
      url: error.target?.url
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('토큰이 없어 SSE 연결을 시작하지 않습니다.');
      return;
    }

    console.log('SSE 연결을 시작합니다.');
    const instance = createSseInstance(handleMessage, handleError);
    setSseInstance(instance);

    // 컴포넌트 언마운트 시 SSE 연결 종료
    return () => {
      if (instance) {
        instance.close();
        console.log('SSE 연결을 종료했습니다.');
      }
    };
  }, [handleMessage, handleError]);

  const closeNotification = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  const showTestNotification = useCallback((type = 'GENERAL', message = '테스트 알림입니다') => {
    setCurrentNotification({
      type,
      message,
      id: Date.now(),
      timestamp: new Date()
    });
  }, []);

  return {
    currentNotification,
    closeNotification,
    showTestNotification,
    isConnected: !!sseInstance
  };
};

export default useRealtimeNotification;
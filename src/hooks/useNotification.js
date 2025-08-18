import { useEffect, useState, useCallback } from 'react';
import { createSseInstance } from '../api/service/system/sse/SseListener';

/**
 * 실시간 알림을 관리하는 커스텀 훅
 * SSE 연결을 통해 실시간 알림을 받고 화면에 표시
 */
const useRealtimeNotification = () => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [sseInstance, setSseInstance] = useState(null);

  // 알림 메시지 처리
  const handleMessage = useCallback((event) => {
    try {
      console.log('SSE 알림 수신:', event.data);
      
      // SSE 연결 확인 메시지나 keep-alive 메시지는 무시
      if (event.data.includes('SSE connected') || 
          event.data.includes('keep-alive') ||
          event.data.trim() === 'keep-alive' ||
          !event.data.trim().startsWith('{')) {
        return;
      }

      const notification = JSON.parse(event.data);
      
      // 유효한 알림인지 확인
      if (notification.type && notification.message) {
        setCurrentNotification({
          ...notification,
          id: Date.now(), // 고유 ID 추가
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('알림 파싱 오류:', error);
    }
  }, []);

  // SSE 연결 오류 처리
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

  // SSE 연결 시작
  useEffect(() => {
    // 로그인된 사용자만 SSE 연결
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

  // 알림 닫기
  const closeNotification = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  // 알림 강제 표시 (테스트용)
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
    showTestNotification, // 개발/테스트용
    isConnected: !!sseInstance
  };
};

export default useRealtimeNotification;
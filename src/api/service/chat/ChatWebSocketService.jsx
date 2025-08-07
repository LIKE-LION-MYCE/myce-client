import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

/**
 * MYCE 채팅 WebSocket 서비스
 * @description STOMP over SockJS를 사용한 실시간 채팅 구현
 * @specification CHAT_SYSTEM_README.md 기반 구현
 */

// WebSocket 연결 상태 관리
let stompClient = null;
let subscriptions = new Map(); // 채팅방별 구독 관리
let messageHandlers = new Map(); // 메시지 핸들러 관리
let connected = false;

/**
 * WebSocket 연결 수립
 * @param {string} token - JWT 인증 토큰
 * @param {number} userId - 사용자 ID
 * @returns {Promise<void>}
 */
const connect = async (token, userId) => {
  try {
    // 기존 연결이 있으면 해제
    if (connected) {
      disconnect();
    }

    // SockJS 연결 URL 각 환경별 설정
    const getWebSocketURL = () => {
      if (import.meta.env.DEV) {
        // 개발 환경: localhost:8080 직접 연결
        return 'http://localhost:8080/ws/chat';
      } else {
        // 운영 환경: 현재 도메인 사용
        const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
        const host = window.location.host;
        return `${protocol}//${host}/ws/chat`;
      }
    };
    
    const sockJSUrl = getWebSocketURL();
    console.log('SockJS 연결 시작:', sockJSUrl);
    
    // STOMP over SockJS 클라이언트 생성
    const socket = new SockJS(sockJSUrl);
    stompClient = Stomp.over(socket);

    // 디버그 모드 설정 (개발환경만)
    stompClient.debug = import.meta.env.DEV ? console.log : () => {};

    return new Promise((resolve, reject) => {
      stompClient.connect(
        {},
        (frame) => {
          console.log('WebSocket 연결 성공:', frame);
          connected = true;
          
          // STOMP 연결 완료 후 약간의 지연을 두고 인증 처리
          setTimeout(() => {
            authenticate(token)
              .then(() => resolve())
              .catch(reject);
          }, 100);
        },
        (error) => {
          console.error('WebSocket 연결 실패:', error);
          connected = false;
          reject(error);
        }
      );
    });

  } catch (error) {
    console.error('WebSocket 연결 중 오류:', error);
    throw error;
  }
};

/**
 * WebSocket 연결 후 JWT 인증 수행
 * @param {string} token - JWT 토큰
 * @returns {Promise<void>}
 */
const authenticate = (token) => {
  return new Promise((resolve, reject) => {
    if (!connected || !stompClient?.connected) {
      reject(new Error('WebSocket이 연결되지 않음'));
      return;
    }

    let authResolved = false;

    // 인증 응답 구독 - 토픽 기반 응답
    const authSubscription = stompClient.subscribe('/topic/auth-test', (message) => {
      try {
        const response = JSON.parse(message.body);
        console.log('인증 응답:', response);
        
        if ((response.type === 'AUTH_ACK' || response.type === 'AUTH_TEST') && !authResolved) {
          console.log('WebSocket 인증 성공');
          authResolved = true;
          authSubscription.unsubscribe();
          resolve();
        } else if (response.type === 'ERROR' && !authResolved) {
          console.error('WebSocket 인증 실패:', response);
          authResolved = true;
          authSubscription.unsubscribe();
          reject(new Error(response.payload || '인증 실패'));
        }
      } catch (error) {
        console.error('인증 응답 파싱 에러:', error);
        if (!authResolved) {
          authResolved = true;
          authSubscription.unsubscribe();
          reject(error);
        }
      }
    });

    // 인증 타임아웃 설정 (10초)
    const timeoutId = setTimeout(() => {
      if (!authResolved) {
        console.warn('인증 타임아웃');
        authResolved = true;
        authSubscription.unsubscribe();
        reject(new Error('인증 타임아웃'));
      }
    }, 10000);

    // 인증 요청 전송
    try {
      const payload = { token: token };
      stompClient.send('/app/auth', {}, JSON.stringify(payload));
      console.log('인증 요청 전송됨');
    } catch (sendError) {
      console.error('인증 요청 전송 실패:', sendError);
      clearTimeout(timeoutId);
      if (!authResolved) {
        authResolved = true;
        authSubscription.unsubscribe();
        reject(sendError);
      }
    }
  });
};

/**
 * 채팅방 입장 및 메시지 구독
 * @param {string} roomId - 채팅방 ID (format: admin-{expoId}-{userId})
 * @returns {Promise<void>}
 */
const joinRoom = async (roomId) => {
  if (!connected) {
    throw new Error('WebSocket이 연결되지 않음');
  }

  console.log('채팅방 입장:', roomId);

  // 채팅방 메시지 구독
  if (!subscriptions.has(roomId)) {
    const subscription = stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
      const data = JSON.parse(message.body);
      console.log('새 메시지 수신:', data);
      
      // 메시지 핸들러 호출
      const handler = messageHandlers.get(roomId);
      if (handler && data.type === 'MESSAGE') {
        handler(data.payload);
      }
    });
    
    subscriptions.set(roomId, subscription);
  }

  // 방 입장 요청
  stompClient.send('/app/join', {}, JSON.stringify({
    roomId: roomId
  }));
};

/**
 * 채팅 메시지 전송
 * @param {string} roomId - 채팅방 ID
 * @param {string} content - 메시지 내용
 * @description CHAT_SYSTEM_README.md 메시지 페이로드 형식 준수
 */
const sendMessage = (roomId, content) => {
  if (!connected) {
    console.error('WebSocket이 연결되지 않음');
    return;
  }

  console.log('메시지 전송:', { roomId, content });

  // 문서 명세에 따른 메시지 페이로드 구성
  const messagePayload = {
    roomId: roomId,
    message: content,
    sentAt: new Date().toISOString()
  };

  stompClient.send('/app/chat.send', {}, JSON.stringify(messagePayload));
};

/**
 * 메시지 수신 핸들러 등록
 * @param {string} roomId - 채팅방 ID
 * @param {function} handler - 메시지 처리 함수
 */
const onMessage = (roomId, handler) => {
  messageHandlers.set(roomId, handler);
};

/**
 * 채팅방 나가기 및 구독 해제
 * @param {string} roomId - 채팅방 ID
 */
const leaveRoom = (roomId) => {
  const subscription = subscriptions.get(roomId);
  if (subscription) {
    subscription.unsubscribe();
    subscriptions.delete(roomId);
  }
  messageHandlers.delete(roomId);
};

/**
 * WebSocket 연결 완전 해제
 * @description 모든 구독 해제 후 연결 종료
 */
const disconnect = () => {
  if (stompClient && connected) {
    // 모든 구독 해제
    subscriptions.forEach(subscription => subscription.unsubscribe());
    subscriptions.clear();
    messageHandlers.clear();
    
    stompClient.disconnect(() => {
      console.log('WebSocket 연결 해제');
    });
    
    connected = false;
    stompClient = null;
  }
};

/**
 * WebSocket 연결 상태 확인
 * @returns {boolean} 연결 상태
 */
const isConnected = () => {
  return connected;
};

// ChatWebSocketService API 내보내기
export { 
  connect, 
  authenticate, 
  joinRoom, 
  sendMessage, 
  onMessage, 
  leaveRoom, 
  disconnect, 
  isConnected 
};
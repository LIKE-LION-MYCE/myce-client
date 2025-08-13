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
let unreadCountHandlers = new Map(); // unread count 핸들러 관리
let connected = false;
let currentSessionId = null; // 현재 세션 ID 저장

/**
 * WebSocket 연결 수립
 * @param {string} token - JWT 인증 토큰
 * @param {number} userId - 사용자 ID
 * @returns {Promise<void>}
 */
const connect = async (token, userId) => {
  try {
    if (connected) {
      disconnect();
    }

    const getWebSocketURL = () => {
      if (import.meta.env.DEV) {
        return 'http://localhost:8080/ws/chat';
      } else {
        return 'https://api.myce.live/ws/chat';  // SockJS는 https:// 사용
      }
    };
    
    const sockJSUrl = getWebSocketURL();
    const socket = new SockJS(sockJSUrl);
    stompClient = Stomp.over(socket);

    stompClient.debug = import.meta.env.DEV ? console.log : () => {};

    return new Promise((resolve, reject) => {
      stompClient.connect(
        {},
        (frame) => {
          connected = true;
          
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

    const authSubscription = stompClient.subscribe('/topic/auth-test', (message) => {
      try {
        const response = JSON.parse(message.body);
        
        if ((response.type === 'AUTH_ACK' || response.type === 'AUTH_TEST') && !authResolved) {
          currentSessionId = response.sessionId;
          authResolved = true;
          authSubscription.unsubscribe();
          resolve();
        } else if (response.type === 'ERROR' && !authResolved) {
          authResolved = true;
          authSubscription.unsubscribe();
          reject(new Error(response.payload || '인증 실패'));
        }
      } catch (error) {
        if (!authResolved) {
          authResolved = true;
          authSubscription.unsubscribe();
          reject(error);
        }
      }
    });

    const timeoutId = setTimeout(() => {
      if (!authResolved) {
        authResolved = true;
        authSubscription.unsubscribe();
        reject(new Error('인증 타임아웃'));
      }
    }, 10000);

    try {
      const payload = { token: token };
      stompClient.send('/app/auth', {}, JSON.stringify(payload));
    } catch (sendError) {
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

  if (!subscriptions.has(roomId)) {
    const subscription = stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
      const data = JSON.parse(message.body);
      
      const handler = messageHandlers.get(roomId);
      if (handler && (data.type === 'MESSAGE' || data.type === 'ADMIN_MESSAGE')) {
        handler(data.payload || data);
      }
      
      const unreadHandler = unreadCountHandlers.get(roomId);
      if (unreadHandler && data.type === 'read_status_update') {
        unreadHandler(data);
      }
    });
    
    subscriptions.set(roomId, subscription);
  }

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
 * 읽음 상태 WebSocket으로 업데이트
 * @param {string} roomId - 채팅방 ID
 * @param {string} messageId - 읽은 메시지 ID (선택적)
 */
const markAsReadViaWebSocket = (roomId, messageId = null) => {
  if (!connected) {
    return;
  }

  const payload = {
    roomId: roomId,
    messageId: messageId
  };

  stompClient.send('/app/read', {}, JSON.stringify(payload));
};

/**
 * Unread count 업데이트 구독
 * @param {string} roomId - 채팅방 ID
 * @param {function} handler - unread count 업데이트 핸들러
 */
const subscribeToUnreadUpdates = (roomId, handler) => {
  unreadCountHandlers.set(roomId, handler);
};

/**
 * 박람회 전체 관리자 업데이트 구독
 * @param {number} expoId - 박람회 ID
 * @param {function} handler - 업데이트 핸들러
 */
const subscribeToExpoAdminUpdates = (expoId, handler) => {
  if (!connected || !stompClient) {
    return null;
  }

  const expoChannel = `/topic/expo/${expoId}/admin-updates`;
  
  try {
    const subscription = stompClient.subscribe(expoChannel, (message) => {
      try {
        const data = JSON.parse(message.body);
        handler(data);
      } catch (parseError) {
        console.error('메시지 파싱 에러:', parseError);
      }
    });
    
    subscriptions.set(`expo-${expoId}`, subscription);
    return subscription;
  } catch (subscribeError) {
    console.error('구독 실패:', subscribeError);
    return null;
  }
};

/**
 * WebSocket으로 unread count 요청
 * @param {string} roomId - 채팅방 ID
 */
const requestUnreadCount = (roomId) => {
  if (!connected) {
    return;
  }

  stompClient.send('/app/unread-count', {}, JSON.stringify({
    roomId: roomId
  }));
};

/**
 * 읽음 상태 WebSocket 알림 전송
 * @param {string} roomId - 채팅방 ID
 */
const sendReadStatusNotification = (roomId) => {
  if (!connected) {
    return;
  }

  stompClient.send('/app/read-status-notify', {}, JSON.stringify({
    roomId: roomId,
    readerType: "USER",
    unreadCount: 0
  }));
};

/**
 * WebSocket 연결 완전 해제
 * @description 모든 구독 해제 후 연결 종료
 */
const disconnect = () => {
  if (stompClient && connected) {
    subscriptions.forEach(subscription => subscription.unsubscribe());
    subscriptions.clear();
    messageHandlers.clear();
    unreadCountHandlers.clear();
    
    stompClient.disconnect();
    connected = false;
    stompClient = null;
  }
};

/**
 * 관리자 채팅 메시지 전송 (담당자 배정 포함)
 * @param {string} roomCode - 채팅방 코드 (admin-{expoId}-{userId})
 * @param {string} content - 메시지 내용
 * @param {number} expoId - 박람회 ID
 * @description 백엔드의 /app/admin/chat.send 엔드포인트 사용
 */
const sendAdminMessage = (roomCode, content, expoId) => {
  if (!connected) {
    console.error('WebSocket이 연결되지 않음');
    return;
  }

  const messagePayload = {
    roomCode: roomCode,
    message: content,
    expoId: expoId,
    sentAt: new Date().toISOString()
  };

  stompClient.send('/app/admin/chat.send', {}, JSON.stringify(messagePayload));
};

/**
 * WebSocket 연결 상태 확인
 * @returns {boolean} 연결 상태
 */
const isConnected = () => {
  return connected;
};

/**
 * 개별 사용자 에러 메시지 구독
 * @param {function} callback - 에러 메시지 콜백 함수
 */
const subscribeToUserErrors = (callback) => {
  if (!stompClient || !connected) {
    return;
  }

  if (!currentSessionId) {
    return;
  }

  const errorChannel = `/topic/user/${currentSessionId}/errors`;
  
  try {
    const subscription = stompClient.subscribe(errorChannel, (message) => {
      try {
        const errorData = JSON.parse(message.body);
        callback(errorData);
      } catch (parseError) {
        console.error('에러 메시지 파싱 실패:', parseError);
      }
    });
    
    subscriptions.set('user-errors', subscription);
    return subscription;
  } catch (subscribeError) {
    console.error('구독 과정 중 에러:', subscribeError);
    return null;
  }
};

/**
 * 박람회별 전체 채팅방 목록 업데이트 구독 (unread count 실시간 업데이트용)
 * @param {number} expoId - 박람회 ID
 * @param {function} handler - 채팅방 목록 업데이트 핸들러
 */
const subscribeToExpoChatRoomUpdates = (expoId, handler) => {
  if (!connected || !stompClient) {
    return null;
  }

  const chatRoomUpdatesChannel = `/topic/expo/${expoId}/chat-room-updates`;
  
  try {
    const subscription = stompClient.subscribe(chatRoomUpdatesChannel, (message) => {
      try {
        const data = JSON.parse(message.body);
        // 새 메시지로 인한 unread count 업데이트 처리
        if (data.type === 'unread_count_update' || data.type === 'new_message') {
          handler(data);
        }
      } catch (parseError) {
        console.error('채팅방 업데이트 메시지 파싱 에러:', parseError);
      }
    });
    
    subscriptions.set(`expo-chat-rooms-${expoId}`, subscription);
    return subscription;
  } catch (subscribeError) {
    console.error('채팅방 업데이트 구독 실패:', subscribeError);
    return null;
  }
};

/**
 * 플랫폼 버튼 상태 업데이트 구독 (AI 상담용)
 * @param {string} roomCode - 채팅방 코드  
 * @param {function} callback - 버튼 상태 업데이트 콜백
 * @returns {Object|null} - 구독 객체
 */
const subscribeToButtonUpdates = (roomCode, callback) => {
  try {
    if (!connected || !stompClient?.connected) {
      console.warn('WebSocket이 연결되지 않아 버튼 업데이트 구독 불가');
      return null;
    }

    const topic = `/topic/chat/${roomCode}`;
    const subscription = stompClient.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        if (data.type === 'BUTTON_STATE_UPDATE') {
          console.log('버튼 상태 업데이트 수신:', data);
          callback(data);
        }
      } catch (error) {
        console.error('버튼 상태 메시지 파싱 실패:', error);
      }
    });

    console.log('버튼 상태 업데이트 구독 완료:', roomCode);
    return subscription;
  } catch (error) {
    console.error('버튼 상태 업데이트 구독 실패:', error);
    return null;
  }
};

/**
 * 관리자 연결 요청 (플랫폼 상담용)
 * @param {string} roomCode - 채팅방 코드
 * @returns {Promise<void>}
 */
const requestHandoff = async (roomCode) => {
  try {
    if (!connected || !stompClient?.connected) {
      throw new Error('WebSocket이 연결되지 않음');
    }

    const requestMessage = {
      roomId: roomCode
    };

    console.log('관리자 연결 요청 전송:', requestMessage);
    stompClient.send('/app/request-handoff', {}, JSON.stringify(requestMessage));
  } catch (error) {
    console.error('관리자 연결 요청 실패:', error);
    throw error;
  }
};

/**
 * 관리자 연결 요청 취소 (플랫폼 상담용)
 * @param {string} roomCode - 채팅방 코드
 * @returns {Promise<void>}
 */
const cancelHandoff = async (roomCode) => {
  try {
    if (!connected || !stompClient?.connected) {
      throw new Error('WebSocket이 연결되지 않음');
    }

    const requestMessage = {
      roomId: roomCode
    };

    console.log('관리자 연결 요청 취소 전송:', requestMessage);
    stompClient.send('/app/cancel-handoff', {}, JSON.stringify(requestMessage));
  } catch (error) {
    console.error('관리자 연결 요청 취소 실패:', error);
    throw error;
  }
};

/**
 * AI로 복귀 요청 (플랫폼 상담용)
 * @param {string} roomCode - 채팅방 코드
 * @returns {Promise<void>}
 */
const requestAI = async (roomCode) => {
  try {
    if (!connected || !stompClient?.connected) {
      throw new Error('WebSocket이 연결되지 않음');
    }

    const requestMessage = {
      roomId: roomCode
    };

    console.log('AI 복귀 요청 전송:', requestMessage);
    stompClient.send('/app/request-ai', {}, JSON.stringify(requestMessage));
  } catch (error) {
    console.error('AI 복귀 요청 실패:', error);
    throw error;
  }
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
  isConnected,
  markAsReadViaWebSocket,
  subscribeToUnreadUpdates,
  subscribeToExpoAdminUpdates,
  subscribeToExpoChatRoomUpdates,
  requestUnreadCount,
  sendAdminMessage,
  sendReadStatusNotification,
  subscribeToUserErrors,
  // 플랫폼 AI 상담 관련 함수들
  subscribeToButtonUpdates,
  requestHandoff,
  cancelHandoff,
  requestAI
};
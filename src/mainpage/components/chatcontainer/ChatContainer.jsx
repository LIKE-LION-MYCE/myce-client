import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatContainer.module.css';
import instance from '../../../api/lib/axios';
import * as ChatWebSocketService from '../../../api/service/chat/ChatWebSocketService';
import { getAllUnreadCounts, markAsRead } from '../../../api/service/chat/chatService';
import { jwtDecode } from 'jwt-decode';

export default function ChatContainer() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [buttonStates, setButtonStates] = useState({}); // roomCode -> 버튼 상태
  const messagesEndRef = useRef(null);

  // 플랫폼 상담방인지 확인하는 헬퍼 함수
  const isPlatformRoom = (room) => {
    return room && (room.expoTitle === '플랫폼 상담' || room.roomCode?.startsWith('platform-'));
  };

  // 현재 버튼 상태 조회
  const getCurrentButtonState = (roomCode) => {
    return buttonStates[roomCode] || 'AI_ACTIVE';
  };

  // 상태별 버튼 텍스트 반환
  const getButtonText = (state) => {
    switch (state) {
      case 'AI_ACTIVE': return '상담원 연결';
      case 'WAITING_FOR_ADMIN': return '요청 취소';
      case 'HUMAN_ACTIVE': return 'AI로 돌아가기';
      case 'HUMAN_INACTIVE': return 'AI로 계속하기';
      default: return '상담원 연결';
    }
  };

  // 상태별 버튼 액션 반환
  const getButtonAction = (state) => {
    switch (state) {
      case 'AI_ACTIVE': return 'request-handoff';
      case 'WAITING_FOR_ADMIN': return 'cancel-handoff';
      case 'HUMAN_ACTIVE': return 'request-ai';
      case 'HUMAN_INACTIVE': return 'request-ai';
      default: return 'request-handoff';
    }
  };

  // WebSocket 연결 및 초기화
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.warn('로그인 토큰이 없습니다');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.memberId;
        
        console.log('WebSocket 연결 시도...', userId);
        await ChatWebSocketService.connect(token, userId);
        setWsConnected(true);
        console.log('WebSocket 연결 성공');
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
      }
    };

    const fetchChatRooms = async () => {
      try {
        const response = await instance.get('/chats/rooms');
        setChatRooms(response.data.chatRooms);
        if (response.data.chatRooms.length > 0) {
          setSelectedRoom(response.data.chatRooms[0]);
        }
      } catch (error) {
        console.error('채팅방 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadCounts = async () => {
      try {
        const response = await getAllUnreadCounts();
        const counts = {};
        response.data.unreadCounts.forEach(item => {
          counts[item.roomCode] = item.unreadCount;
        });
        setUnreadCounts(counts);
      } catch (error) {
        console.error('읽지 않은 메시지 개수 조회 실패:', error);
      }
    };

    initializeWebSocket();
    fetchChatRooms();
    fetchUnreadCounts();

    return () => {
      ChatWebSocketService.disconnect();
    };
  }, []);

  // 선택된 채팅방 변경 시 메시지 로드
  useEffect(() => {
    if (!selectedRoom) {
      console.log('선택된 채팅방이 없음');
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        console.log('메시지 히스토리 로딩 시도:', selectedRoom.roomCode);
        const response = await instance.get(`/chats/rooms/${selectedRoom.roomCode}/messages`);
        console.log('메시지 히스토리 응답:', response.data);
        const messages = response.data.content || response.data.messages || [];
        // 메시지를 시간순으로 정렬 (오래된 메시지가 위로)
        const sortedMessages = messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
        setMessages(sortedMessages);
        
        // 메시지 로드 후 자동으로 읽음 처리
        if (sortedMessages.length > 0) {
          await handleMarkAsRead(selectedRoom.roomCode);
        }
      } catch (error) {
        console.error('메시지 로드 실패:', error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedRoom]);

  // WebSocket 구독 관리 (selectedRoom과 wsConnected 모두 준비된 후)
  useEffect(() => {
    if (!selectedRoom || !wsConnected) {
      return;
    }

    const joinRoomAndSubscribe = async () => {
      try {
        console.log('WebSocket 채팅방 입장 시도:', selectedRoom.roomCode);
        
        // WebSocket 채팅방 입장
        await ChatWebSocketService.joinRoom(selectedRoom.roomCode);
        
        // 메시지 수신 핸들러 등록
        ChatWebSocketService.onMessage(selectedRoom.roomCode, (message) => {
          console.log('새 메시지 수신:', message);
          
          // 메시지에 unreadCount가 있으면 그대로 사용, 없으면 1로 설정 (새 메시지)
          const newMessage = {
            ...message,
            unreadCount: message.unreadCount !== undefined ? message.unreadCount : 1
          };
          
          setMessages(prev => [...prev, newMessage]);
          
          // 현재 선택된 채팅방의 메시지면 자동으로 읽음 처리 (자신의 메시지가 아닌 경우만)
          const token = localStorage.getItem('access_token');
          const messageRoomCode = message.roomId || message.roomCode;  // roomId 또는 roomCode 사용
          
          console.log('메시지 roomCode 체크:', {
            messageRoomCode,
            selectedRoomCode: selectedRoom?.roomCode,
            isMatch: selectedRoom && selectedRoom.roomCode === messageRoomCode
          });
          
          if (token && selectedRoom && selectedRoom.roomCode === messageRoomCode) {
            try {
              const decodedToken = jwtDecode(token);
              const currentUserId = decodedToken.memberId;
              
              console.log('메시지 수신 - senderId:', message.senderId, 'currentUserId:', currentUserId, 'senderType:', message.senderType);
              
              // 자신이 보낸 메시지가 아닌 경우만 읽음 처리
              if (message.senderId !== currentUserId) {
                console.log('관리자 메시지 자동 읽음 처리 시작');
                
                // 읽음 처리 API 호출 (비동기로 처리)
                setTimeout(async () => {
                  await handleMarkAsRead(selectedRoom.roomCode);
                  // 읽음 처리 후 unreadCount를 0으로 업데이트
                  setMessages(prev => prev.map(msg => ({
                    ...msg,
                    unreadCount: msg.senderType === 'ADMIN' ? 0 : msg.unreadCount
                  })));
                }, 100); // 100ms 지연으로 "1"이 잠깐 보이게
              } else {
                console.log('내가 보낸 메시지이므로 읽음 처리 안함');
              }
            } catch (error) {
              console.error('토큰 디코딩 실패:', error);
            }
          }
        });

        // 버튼 상태 업데이트 핸들러 등록 (플랫폼 상담방용)
        if (isPlatformRoom(selectedRoom)) {
          ChatWebSocketService.subscribeToButtonUpdates(selectedRoom.roomCode, (buttonData) => {
            console.log('버튼 상태 업데이트:', buttonData);
            if (buttonData.type === 'BUTTON_STATE_UPDATE') {
              const { roomId, state } = buttonData.payload;
              setButtonStates(prev => ({
                ...prev,
                [roomId]: state
              }));
            }
          });
        }

        // unread count 업데이트 핸들러 등록 (읽음 상태 실시간 업데이트)
        ChatWebSocketService.subscribeToUnreadUpdates(selectedRoom.roomCode, (unreadData) => {
          console.log('Unread count 업데이트:', unreadData);
          
          // read_status_update 메시지 처리
          if (unreadData.type === 'read_status_update') {
            const payload = unreadData.payload || unreadData;
            const readerType = payload.readerType;
            
            console.log('읽음 상태 업데이트 처리:', { readerType, payload });
            
            // 관리자가 읽었을 때 → 내가 보낸 메시지들의 "1" 제거
            if (readerType === 'ADMIN') {
              setMessages(prev => prev.map(msg => {
                const token = localStorage.getItem('access_token');
                if (token) {
                  try {
                    const decodedToken = jwtDecode(token);
                    // 내가 보낸 메시지의 unreadCount를 0으로
                    if (msg.senderId === decodedToken.memberId) {
                      return { ...msg, unreadCount: 0 };
                    }
                  } catch (error) {
                    console.error('토큰 디코딩 실패:', error);
                  }
                }
                return msg;
              }));
            }
            return; // read_status_update는 여기서 처리 완료
          }
          
          // 기존 unreadCounts 업데이트 (다른 타입의 메시지들)
          if (unreadData.roomCode && unreadData.unreadCount !== undefined) {
            setUnreadCounts(prev => ({
              ...prev,
              [unreadData.roomCode]: unreadData.unreadCount
            }));
          }
        });
        
        console.log('채팅방 구독 완료:', selectedRoom.roomCode);
      } catch (error) {
        console.error('채팅방 구독 실패:', error);
      }
    };

    joinRoomAndSubscribe();

    return () => {
      if (selectedRoom) {
        ChatWebSocketService.leaveRoom(selectedRoom.roomCode);
      }
    };
  }, [selectedRoom, wsConnected]);

  // 메시지 스크롤 하단 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom || !wsConnected) return;

    console.log('메시지 전송:', newMessage);
    ChatWebSocketService.sendMessage(selectedRoom.roomCode, newMessage.trim());
    setNewMessage('');
  };

  // 읽음 처리 함수
  const handleMarkAsRead = async (roomCode) => {
    try {
      console.log('읽음 처리 시작:', roomCode);
      const response = await markAsRead(roomCode);
      console.log('읽음 처리 API 응답:', response);
      
      // 로컬 상태에서 unread count를 0으로 설정
      setUnreadCounts(prev => ({
        ...prev,
        [roomCode]: 0
      }));
      
      // 내가 보낸 메시지들은 상대가 읽을 때까지 1 유지
      // 상대가 보낸 메시지들은 내가 읽었으므로 0으로 변경
      const token = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = jwtDecode(token);
        setMessages(prev => prev.map(msg => {
          // 상대방(관리자)이 보낸 메시지는 읽음 처리
          if (msg.senderId !== decodedToken.memberId) {
            return { ...msg, unreadCount: 0 };
          }
          return msg; // 내 메시지는 그대로 유지
        }));
      }
      
      // 관리자에게 읽음 상태 알림 전송
      if (ChatWebSocketService.isConnected()) {
        console.log('WebSocket 읽음 알림 전송 시도:', roomCode);
        ChatWebSocketService.sendReadStatusNotification(roomCode);
      } else {
        console.log('WebSocket 연결되지 않아 읽음 알림 전송 못함');
      }
      
      console.log('읽음 처리 완료:', roomCode);
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  // 채팅방 선택 핸들러
  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    
    // 채팅방 선택 시 자동으로 읽음 처리
    if (unreadCounts[room.roomCode] > 0) {
      await handleMarkAsRead(room.roomCode);
    }
  };

  // 플랫폼 버튼 클릭 핸들러
  const handlePlatformButtonClick = async (roomCode, action) => {
    if (!wsConnected) {
      console.warn('WebSocket 연결이 없어 버튼 액션 불가');
      return;
    }

    try {
      console.log('플랫폼 버튼 액션 실행:', { roomCode, action });
      
      switch (action) {
        case 'request-handoff':
          await ChatWebSocketService.requestHandoff(roomCode);
          break;
        case 'cancel-handoff':
          await ChatWebSocketService.cancelHandoff(roomCode);
          break;
        case 'request-ai':
          await ChatWebSocketService.requestAI(roomCode);
          break;
        default:
          console.warn('알 수 없는 버튼 액션:', action);
      }
    } catch (error) {
      console.error('플랫폼 버튼 액션 실패:', error);
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 시간 포맷팅 함수
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (daysDiff === 1) {
      return '어제';
    } else {
      return `${daysDiff}일 전`;
    }
  };

  return (
    <div className={styles.chatWrapper}>
      {/* 좌측 채팅 리스트 */}
      <aside className={styles.chatList}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>상담 채팅</h2>
          <div style={{ fontSize: '12px', color: wsConnected ? '#4CAF50' : '#f44336' }}>
            {wsConnected ? '🟢 연결됨' : '🔴 연결 안됨'}
          </div>
        </div>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
        ) : chatRooms.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            아직 채팅방이 없습니다.
          </div>
        ) : (
          <ul className={styles.chatRoomList}>
            {chatRooms.map((room) => (
              <li 
                key={room.roomCode} 
                className={`${styles.chatRoom} ${selectedRoom?.roomCode === room.roomCode ? styles.selected : ''}`}
                onClick={() => handleRoomSelect(room)}
              >
                <img 
                  src={room.expoTitle === '플랫폼 상담' 
                    ? "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f916/u1f916_u1f42d.png" 
                    : "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx"} 
                  alt="avatar" 
                />
                <div className={styles.chatRoomText}>
                  <div style={room.expoTitle === '플랫폼 상담' ? {fontWeight: 'bold', color: '#2196F3'} : {}}>
                    {room.expoTitle || '박람회명 없음'}
                  </div>
                  <span>{formatTime(room.lastMessageAt)}</span>
                </div>
                {unreadCounts[room.roomCode] > 0 && (
                  <span className={styles.unreadBadge}>{unreadCounts[room.roomCode]}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* 우측 채팅 내용 */}
      <main className={styles.chatArea}>
        {selectedRoom ? (
          <>
            <header className={styles.chatHeader}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span>{selectedRoom.expoTitle || '박람회명 없음'}</span>
                {isPlatformRoom(selectedRoom) && (
                  <button 
                    className={styles.platformButton}
                    onClick={() => handlePlatformButtonClick(
                      selectedRoom.roomCode, 
                      getButtonAction(getCurrentButtonState(selectedRoom.roomCode))
                    )}
                    disabled={!wsConnected}
                    style={{
                      backgroundColor: getCurrentButtonState(selectedRoom.roomCode) === 'WAITING_FOR_ADMIN' ? '#ff9800' : '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: wsConnected ? 'pointer' : 'not-allowed',
                      opacity: wsConnected ? 1 : 0.5
                    }}
                  >
                    {getButtonText(getCurrentButtonState(selectedRoom.roomCode))}
                  </button>
                )}
              </div>
            </header>

            <section className={styles.chatMessages}>
              {messages.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  아직 메시지가 없습니다. 첫 메시지를 보내보세요!
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    // 현재 로그인한 사용자인지 확인
                    const token = localStorage.getItem('access_token');
                    let isMyMessage = false;
                    
                    if (token) {
                      try {
                        const decodedToken = jwtDecode(token);
                        isMyMessage = message.senderId === decodedToken.memberId;
                      } catch (error) {
                        console.error('토큰 디코딩 실패:', error);
                      }
                    }
                    
                    // senderType 기반으로 메시지 타입 결정
                    const isAdminMessage = message.senderType === 'ADMIN';
                    const isAIMessage = message.senderType === 'AI';
                    
                    return (
                      <div key={index} className={`${styles.messageRow} ${isMyMessage ? styles.messageRight : styles.messageLeft}`}>
                        {(isAdminMessage || isAIMessage) && (
                          <img 
                            src={isAIMessage 
                              ? "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f916/u1f916_u1f42d.png"
                              : "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx"
                            } 
                            alt="avatar" 
                          />
                        )}
                        <div className={styles.messageWrapper}>
                          {isAIMessage && message.senderName && (
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#666', 
                              marginBottom: '2px',
                              fontWeight: 'bold'
                            }}>
                              {message.senderName}
                            </div>
                          )}
                          <div className={`${styles.messageBubble} 
                            ${isAIMessage ? styles.aiMessage : isAdminMessage ? styles.adminMessage : styles.userMessage} 
                            ${isMyMessage ? styles.myMessage : styles.otherMessage}`}
                            style={isAIMessage ? {
                              backgroundColor: '#e3f2fd',
                              border: '1px solid #2196F3',
                              color: '#1976d2'
                            } : {}}
                          >
                            {message.content || message.message}
                          </div>
                          <div className={styles.messageInfo}>
                            {message.unreadCount > 0 && (
                              <span className={`${styles.unreadIndicator} ${
                                isMyMessage ? styles.unreadIndicatorBlue : styles.unreadIndicatorGray
                              }`}>{message.unreadCount}</span>
                            )}
                            <div className={styles.messageTime}>
                              {formatTime(message.sentAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </section>

            <footer className={styles.chatInput}>
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메세지를 입력해주세요"
                disabled={!wsConnected}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!wsConnected || !newMessage.trim()}
              >
                전송
              </button>
            </footer>
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            color: '#666' 
          }}>
            {chatRooms.length === 0 ? '채팅방이 없습니다.' : '채팅방을 선택해주세요.'}
          </div>
        )}
      </main>
    </div>
  );
}

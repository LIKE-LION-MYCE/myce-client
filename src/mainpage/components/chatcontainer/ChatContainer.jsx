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
  const messagesEndRef = useRef(null);

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
                <img src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx" alt="avatar" />
                <div className={styles.chatRoomText}>
                  <div>{room.expoTitle || '박람회명 없음'}</div>
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
              {selectedRoom.expoTitle || '박람회명 없음'}
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
                    
                    return (
                      <div key={index} className={`${styles.messageRow} ${isMyMessage ? styles.messageRight : styles.messageLeft}`}>
                        {isAdminMessage && (
                          <img src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx" alt="avatar" />
                        )}
                        <div className={styles.messageWrapper}>
                          <div className={`${styles.messageBubble} ${isAdminMessage ? styles.adminMessage : styles.userMessage} ${isMyMessage ? styles.myMessage : styles.otherMessage}`}>
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

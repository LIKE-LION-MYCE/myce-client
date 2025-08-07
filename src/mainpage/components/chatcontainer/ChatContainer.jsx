import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatContainer.module.css';
import instance from '../../../api/lib/axios';
import * as ChatWebSocketService from '../../../api/service/chat/ChatWebSocketService';
import { jwtDecode } from 'jwt-decode';

export default function ChatContainer() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
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

    initializeWebSocket();
    fetchChatRooms();

    return () => {
      ChatWebSocketService.disconnect();
    };
  }, []);

  // 선택된 채팅방 변경 시 메시지 로드 및 WebSocket 구독
  useEffect(() => {
    if (!selectedRoom) {
      console.log('선택된 채팅방이 없음');
      return;
    }

    const loadMessages = async () => {
      try {
        console.log('메시지 히스토리 로딩 시도:', selectedRoom.roomCode);
        const response = await instance.get(`/chats/rooms/${selectedRoom.roomCode}/messages`);
        console.log('메시지 히스토리 응답:', response.data);
        setMessages(response.data.content || response.data.messages || []);
      } catch (error) {
        console.error('메시지 로드 실패:', error);
        setMessages([]);
      }
    };

    const joinRoomAndSubscribe = async () => {
      if (!wsConnected) {
        console.log('WebSocket 연결 대기 중...');
        return;
      }

      try {
        console.log('WebSocket 채팅방 입장 시도:', selectedRoom.roomCode);
        
        // WebSocket 채팅방 입장
        await ChatWebSocketService.joinRoom(selectedRoom.roomCode);
        
        // 메시지 수신 핸들러 등록
        ChatWebSocketService.onMessage(selectedRoom.roomCode, (message) => {
          console.log('새 메시지 수신:', message);
          setMessages(prev => [...prev, message]);
        });
        
        console.log('채팅방 구독 완료:', selectedRoom.roomCode);
      } catch (error) {
        console.error('채팅방 구독 실패:', error);
      }
    };

    // 메시지 히스토리는 WebSocket 연결 상관없이 로드
    loadMessages();
    
    // WebSocket 구독은 연결된 후에만
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
                onClick={() => setSelectedRoom(room)}
              >
                <img src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx" alt="avatar" />
                <div className={styles.chatRoomText}>
                  <div>{room.expoTitle || '박람회명 없음'}</div>
                  <span>{formatTime(room.lastMessageAt)}</span>
                </div>
                {room.unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{room.unreadCount}</span>
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
                  {messages.map((message, index) => (
                    <div key={index} className={styles.messageRow}>
                      <img src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx" alt="avatar" />
                      <div className={styles.messageBubble}>
                        <div className={styles.messageContent}>{message.content || message.message}</div>
                        <div className={styles.messageTime}>
                          {formatTime(message.sentAt)}
                        </div>
                      </div>
                    </div>
                  ))}
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

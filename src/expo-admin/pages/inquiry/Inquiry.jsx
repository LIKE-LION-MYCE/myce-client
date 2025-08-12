import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './Inquiry.module.css';
import { getExpoChatRooms, getExpoChatMessages, markExpoChatAsRead } from '../../../api/service/expo-admin/expoChatService';
import { connect, joinRoom, leaveRoom, onMessage, sendAdminMessage, disconnect, isConnected, subscribeToUnreadUpdates, subscribeToExpoAdminUpdates, subscribeToExpoChatRoomUpdates, subscribeToUserErrors } from '../../../api/service/chat/ChatWebSocketService';


function Inquiry() {
  const { expoId } = useParams();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // 현재 선택된 채팅방 정보
  const selectedRoom = selectedRoomIndex >= 0 ? chatRooms[selectedRoomIndex] : null;

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadChatRooms();
    connectWebSocket();
    
    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (isConnected()) {
        disconnect();
      }
    };
  }, [expoId]);

  // 메시지 자동 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * 채팅방 목록 로드
   */
  const loadChatRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getExpoChatRooms(expoId);
      const roomsData = response.data[0]?.chatRooms || [];
      
      setChatRooms(roomsData);
      
      // 자동 선택 제거 - 사용자가 직접 선택해야 함
      
    } catch (err) {
      console.error('채팅방 목록 로드 실패:', err);
      setError('채팅방 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * WebSocket 연결
   */
  const connectWebSocket = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('인증 토큰이 없습니다.');
        return;
      }

      if (!isConnected()) {
        console.log('WebSocket 연결 시작...');
        await connect(token);
        
        // connect 완료 후 상태 업데이트
        console.log('WebSocket 연결 완료, wsConnected 상태 업데이트');
        setWsConnected(true);
        
        // 상태 업데이트 후 구독 (약간의 지연)
        setTimeout(() => {
          subscribeToExpoAdminUpdatesFunc();
          subscribeToUserErrorsFunc();
          subscribeToExpoChatRoomUpdatesFunc(); // 실시간 채팅방 목록 업데이트 구독 추가
        }, 100);
      }
    } catch (err) {
      console.error('WebSocket 연결 실패:', err);
      setError('실시간 채팅 연결에 실패했습니다.');
      setWsConnected(false);
    }
  };

  /**
   * 박람회 전체 관리자 업데이트 구독
   */
  const subscribeToExpoAdminUpdatesFunc = () => {
    if (!isConnected()) {
      setTimeout(() => {
        if (isConnected()) {
          subscribeToExpoAdminUpdatesFunc();
        }
      }, 3000);
      return;
    }

    try {
      const subscription = subscribeToExpoAdminUpdates(expoId, (updateData) => {
        if (updateData.type === 'admin_assignment_update') {
          const payload = updateData.payload || updateData;
          
          setChatRooms(prev => {
            const updated = prev.map(room => {
              if (room.roomCode === payload.roomCode) {
                if (room.currentAdminCode === payload.currentAdminCode) {
                  return room;
                }
                
                return {
                  ...room,
                  currentAdminCode: payload.currentAdminCode,
                  adminDisplayName: payload.adminDisplayName
                };
              }
              return room;
            });
            return updated;
          });
        }
      });
      
    } catch (err) {
      console.error('박람회 업데이트 구독 실패:', err);
    }
  };

  /**
   * 개별 사용자 에러 메시지 구독
   */
  const subscribeToUserErrorsFunc = () => {
    if (!isConnected()) {
      return;
    }

    try {
      subscribeToUserErrors((errorData) => {
        if (errorData.errorCode === 'C002') {
          setError(errorData.message || '이미 다른 관리자가 담당하고 있는 상담입니다.');
          setTimeout(() => setError(null), 3000);
        } else {
          setError(errorData.message || '메시지 전송에 실패했습니다.');
          setTimeout(() => setError(null), 3000);
        }
      });
      
    } catch (err) {
      console.error('개별 에러 구독 실패:', err);
    }
  };

  /**
   * 박람회 전체 채팅방 목록 업데이트 구독 (실시간 unread count 업데이트)
   */
  const subscribeToExpoChatRoomUpdatesFunc = () => {
    if (!isConnected()) {
      return;
    }

    try {
      subscribeToExpoChatRoomUpdates(expoId, (updateData) => {
        // 새 메시지로 인한 unread count 업데이트 처리
        if (updateData.type === 'unread_count_update' || updateData.type === 'new_message') {
          const payload = updateData.payload || updateData;
          const { roomCode, unreadCount } = payload;
          
          // 해당 채팅방의 unread count 실시간 업데이트
          setChatRooms(prev => prev.map(room => 
            room.roomCode === roomCode 
              ? { ...room, unreadCount: unreadCount || 0 }
              : room
          ));
          
        }
      });
      
    } catch (err) {
      console.error('채팅방 목록 업데이트 구독 실패:', err);
    }
  };

  /**
   * 특정 채팅방의 메시지 히스토리 로드
   */
  const loadMessages = async (roomCode) => {
    if (!roomCode) return;

    try {
      const response = await getExpoChatMessages(expoId, roomCode, {
        page: 0,
        size: 50
      });
      
      const messagesData = response.data?.content || [];
      
      // 메시지를 시간순으로 정렬 (오래된 것부터)
      const sortedMessages = messagesData.sort((a, b) => 
        new Date(a.sentAt) - new Date(b.sentAt)
      );
      
      setMessages(sortedMessages);
      
      // WebSocket 채팅방 입장 및 실시간 메시지 수신 설정
      if (wsConnected && isConnected()) {
        // 실시간 메시지 핸들러 등록 (joinRoom 전에!)
        onMessage(roomCode, (newMessage) => {
          // 일반 메시지 처리
          if (newMessage.type === 'MESSAGE' || newMessage.type === 'ADMIN_MESSAGE' || !newMessage.type) {
            // roomCode 검증: 현재 채팅방의 메시지인지 확인
            const messageRoomCode = newMessage.payload?.roomCode || newMessage.payload?.roomId || 
                                  newMessage.roomCode || newMessage.roomId;
            
            // 현재 선택된 채팅방과 메시지의 roomCode가 일치하는 경우에만 처리
            if (messageRoomCode === roomCode) {
              const messageData = {
                id: newMessage.payload?.messageId || newMessage.messageId,
                content: newMessage.payload?.content || newMessage.content,
                senderId: newMessage.payload?.senderId || newMessage.senderId,
                senderType: newMessage.payload?.senderType || newMessage.senderType || 'USER',
                adminCode: newMessage.payload?.adminCode || newMessage.adminCode,
                adminDisplayName: newMessage.payload?.adminDisplayName || newMessage.adminDisplayName,
                sentAt: newMessage.payload?.sentAt || newMessage.sentAt,
                unreadCount: newMessage.payload?.unreadCount !== undefined ? newMessage.payload?.unreadCount : 
                            (newMessage.unreadCount !== undefined ? newMessage.unreadCount : 1)
              };
              
              setMessages(prev => [...prev, messageData]);
              
              // 사용자 메시지가 오면 자동으로 읽음 처리
              if (messageData.senderType === 'USER') {
                markExpoChatAsRead(expoId, roomCode, null)
                  .then(() => {
                    // 읽음 처리 후 기존 USER 메시지들의 unreadCount를 0으로 업데이트
                    setMessages(prev => prev.map(msg => ({
                      ...msg,
                      unreadCount: msg.senderType === 'USER' ? 0 : msg.unreadCount
                    })));
                  })
                  .catch(err => console.error('읽음 처리 실패:', err));
              }
            }
          }
          
          // 담당자 배정 업데이트 처리
          if (newMessage.type === 'admin_assignment_update') {
            const payload = newMessage.payload || newMessage;
            
            setChatRooms(prev => prev.map(room => {
              if (room.roomCode === payload.roomCode) {
                if (room.currentAdminCode === payload.currentAdminCode) {
                  return room;
                }
                
                return {
                  ...room,
                  currentAdminCode: payload.currentAdminCode,
                  adminDisplayName: payload.adminDisplayName
                };
              }
              return room;
            }));
          }
        });
        
        
        // 읽음 상태 업데이트 핸들러 등록 (joinRoom 전에!)
        subscribeToUnreadUpdates(roomCode, (updateData) => {
          if (updateData.type === 'read_status_update') {
            const payload = updateData.payload || updateData;
            const readerType = payload.readerType;
            
            // 유저가 읽었을 때 → 내(관리자)가 보낸 메시지들의 "1" 제거
            if (readerType === 'USER') {
              setMessages(prev => prev.map(msg => ({
                ...msg,
                unreadCount: msg.senderType === 'ADMIN' ? 0 : msg.unreadCount
              })));
            }
          }
        });
        
        // 이제 joinRoom 호출 (핸들러들이 모두 등록된 후!)
        await joinRoom(roomCode);
        
        // 에러 메시지는 이제 백엔드에서 개별 사용자에게만 전송됨
        // 채팅방 전체가 아닌 에러 발생시킨 사용자에게만 표시
      }
      
    } catch (err) {
      console.error('메시지 로드 실패:', err);
      setError('메시지를 불러올 수 없습니다.');
    }
  };

  /**
   * 채팅방 선택 처리
   */
  const handleRoomSelect = async (index) => {
    if (index === selectedRoomIndex) return;
    
    // 이전 채팅방 구독 해제
    const previousRoom = selectedRoom;
    if (previousRoom?.roomCode && wsConnected && isConnected()) {
      try {
        leaveRoom(previousRoom.roomCode);
      } catch (err) {
        console.error('이전 채팅방 구독 해제 실패:', err);
      }
    }
    
    setSelectedRoomIndex(index);
    setMessages([]);
    
    const room = chatRooms[index];
    if (room?.roomCode) {
      await loadMessages(room.roomCode);
      
      // 읽음 처리
      try {
        await markExpoChatAsRead(expoId, room.roomCode, null);
        
        // 읽음 처리 후 UI에서 안읽은 개수를 0으로 업데이트
        setChatRooms(prev => prev.map(r => 
          r.roomCode === room.roomCode 
            ? { ...r, unreadCount: 0 }
            : r
        ));
        
        // 메시지들의 unreadCount도 0으로 업데이트
        setMessages(prev => prev.map(msg => ({
          ...msg,
          unreadCount: msg.senderType === 'USER' ? 0 : msg.unreadCount
        })));
        
      } catch (err) {
        console.error('읽음 처리 실패:', err);
      }
    }
  };

  /**
   * 메시지 전송
   */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom?.roomCode) return;

    try {
      if (wsConnected && isConnected()) {
        const messageContent = newMessage;
        const currentUser = jwtDecode(localStorage.getItem('access_token'));
        
        // WebSocket으로 실시간 전송
        sendAdminMessage(selectedRoom.roomCode, messageContent, parseInt(expoId));
        
        // optimistic UI update 제거 - 서버 응답을 기다려서 담당자 배정 처리
        
        // 메시지 전송 후 입력창 초기화 (실제 전송 성공은 WebSocket 응답으로 확인)
        setNewMessage('');
      } else {
        setError('실시간 채팅이 연결되지 않았습니다.');
      }
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      setError('메시지 전송에 실패했습니다.');
    }
  };

  /**
   * Enter 키로 메시지 전송
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * 메시지 렌더링 헬퍼
   */
  const renderMessage = (msg, index) => {
    // senderType 기반으로 메시지 구분 (서버에서 올바르게 설정됨)
    const isAdminMessage = msg.senderType === 'ADMIN';
    
    // 모든 관리자 메시지는 우측, 사용자 메시지는 좌측
    const isMyMessage = isAdminMessage;
    const messageTime = new Date(msg.sentAt).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div key={msg.id || index} className={styles.messageRow}>
        {isAdminMessage && msg.adminDisplayName && (
          <div className={styles.adminInfoAbove}>{msg.adminDisplayName}</div>
        )}
        <div className={isMyMessage ? styles.messageRight : styles.messageLeft}>
          <div className={`${styles.messageBubble} ${isAdminMessage ? styles.adminMessage : styles.userMessage}`}>
            {msg.content}
          </div>
          <div className={styles.messageInfo}>
            {msg.unreadCount > 0 && (
              <span className={styles.unreadIndicator}>{msg.unreadCount}</span>
            )}
            <span className={styles.time}>{messageTime}</span>
          </div>
        </div>
      </div>
    );
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.inquiryWrapper}>
        <div className={styles.sectionTitle}>문의 내역</div>
        <div className={styles.loadingMessage}>채팅방을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.inquiryWrapper}>
      <div className={styles.sectionTitle}>
        문의 내역 
        {wsConnected && (
          <span className={styles.connectionStatus}>● 실시간 연결됨</span>
        )}
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div className={styles.chatContainer}>
        {/* 좌측: 사용자 목록 */}
        <aside className={styles.sidebar}>
          <header className={styles.sidebarHeader}>
            상담자 목록 ({chatRooms.length})
          </header>
          <ul className={styles.userList}>
            {chatRooms.length === 0 ? (
              <li className={styles.emptyMessage}>문의가 없습니다.</li>
            ) : (
              chatRooms.map((room, i) => (
                <li
                  key={room.roomCode || i}
                  className={`${styles.userItem} ${i === selectedRoomIndex ? styles.active : ''}`}
                  onClick={() => handleRoomSelect(i)}
                >
                  <div className={styles.userAvatar}>
                    {room.otherMemberName?.charAt(0) || '?'}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userDetails}>
                      <span className={styles.userName}>{room.otherMemberName || '익명'}</span>
                      <div className={styles.adminInfo}>
                        {room.currentAdminCode ? (
                          <span className={styles.adminAssigned}>
                            담당자: {room.adminDisplayName || room.currentAdminCode}
                          </span>
                        ) : (
                          <span className={styles.adminUnassigned}>미배정</span>
                        )}
                      </div>
                    </div>
                    {room.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>{room.unreadCount}</span>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* 우측: 채팅창 */}
        <section className={styles.chatArea}>
          {selectedRoom ? (
            <>
              <header className={styles.chatHeader}>
                {selectedRoom.otherMemberName || '익명'}님과의 상담
              </header>

              <div className={styles.chatBody}>
                {messages.length === 0 ? (
                  <div className={styles.emptyChat}>메시지가 없습니다.</div>
                ) : (
                  messages.map((msg, idx) => renderMessage(msg, idx))
                )}
                <div ref={messagesEndRef} />
              </div>

              <footer className={styles.chatInputBox}>
                <input
                  className={styles.input}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="메시지를 입력해주세요"
                  disabled={!wsConnected}
                />
                <button 
                  className={styles.sendButton} 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !wsConnected}
                >
                  전송
                </button>
              </footer>
            </>
          ) : (
            <div className={styles.noRoomSelected}>
              왼쪽에서 채팅방을 선택해주세요.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Inquiry;
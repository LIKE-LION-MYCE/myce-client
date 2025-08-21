import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './Inquiry.module.css';
import { getChatMessages, markAsRead } from '../../../api/service/chat/chatService';
import * as ChatWebSocketService from '../../../api/service/chat/ChatWebSocketService';
import instance from '../../../api/lib/axios';
import { useWorkingChatScroll } from '../../../hooks/useWorkingChatScroll';
import SharedChatArea from '../../../components/shared/chat/SharedChatArea';
import SharedChatRoomList from '../../../components/shared/chat/SharedChatRoomList';


function Inquiry() {
  const { expoId } = useParams();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Use the same working chat scroll that platform and user chat use
  const {
    messages,
    loading: loadingMessages,
    loadingOlder,
    hasMore,
    error: messageError,
    containerRef: messagesContainerRef,
    messagesEndRef,
    loadInitialMessages,
    handleScroll,
    scrollToBottom,
    addMessage,
    updateMessage,
    reset: resetMessages,
    isNearBottom
  } = useWorkingChatScroll(getChatMessages);

  // For compatibility with SharedChatArea
  const isInitialLoad = loadingMessages;


  // 초기 데이터 로드
  useEffect(() => {
    loadChatRooms();
    connectWebSocket();
    
    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (selectedRoom?.roomCode) {
        ChatWebSocketService.leaveRoom(selectedRoom.roomCode);
      }
    };
  }, [expoId]);


  /**
   * 채팅방 목록 로드
   */
  const loadChatRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use expo-specific endpoint for this expo's chat rooms
      const response = await instance.get(`/expos/${expoId}/chats/rooms`);
      const roomsData = response.data[0]?.chatRooms || response.data || [];
      
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

      if (!ChatWebSocketService.isConnected()) {
        console.log('WebSocket 연결 시작...');
        const decodedToken = jwtDecode(token);
        setCurrentUserId(decodedToken.memberId);
        
        await ChatWebSocketService.connect(token, decodedToken.memberId);
        
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
    if (!ChatWebSocketService.isConnected()) {
      setTimeout(() => {
        if (ChatWebSocketService.isConnected()) {
          subscribeToExpoAdminUpdatesFunc();
        }
      }, 3000);
      return;
    }

    try {
      const subscription = ChatWebSocketService.subscribeToExpoAdminUpdates(expoId, (updateData) => {
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
        } else if (updateData.type === 'ADMIN_RELEASED') {
          // 담당자 타임아웃으로 인한 자동 해제 처리
          const payload = updateData.payload || updateData;
          const roomCodes = payload.roomCodes || [];
          
          console.log('담당자 자동 해제 알림 수신:', roomCodes);
          
          setChatRooms(prev => {
            const updated = prev.map(room => {
              if (roomCodes.includes(room.roomCode)) {
                // 해당 채팅방의 담당자를 해제
                return {
                  ...room,
                  currentAdminCode: null,
                  adminDisplayName: null
                };
              }
              return room;
            });
            return updated;
          });
          
          // 사용자에게 알림 표시 (선택적)
          if (roomCodes.length > 0) {
            console.log(`${roomCodes.length}개 채팅방의 담당자가 비활성으로 인해 자동 해제되었습니다.`);
          }
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
    if (!ChatWebSocketService.isConnected()) {
      return;
    }

    try {
      ChatWebSocketService.subscribeToUserErrors((errorData) => {
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
    if (!ChatWebSocketService.isConnected()) {
      return;
    }

    try {
      ChatWebSocketService.subscribeToExpoChatRoomUpdates(expoId, (updateData) => {
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

  // Handle room selection with WebSocket integration
  const handleRoomSelect = useCallback(async (room) => {
    // Leave previous room
    if (selectedRoom?.roomCode && wsConnected && ChatWebSocketService.isConnected()) {
      try {
        ChatWebSocketService.leaveRoom(selectedRoom.roomCode);
      } catch (err) {
        console.error('이전 채팅방 구독 해제 실패:', err);
      }
    }

    setSelectedRoom(room);
    resetMessages();
    
    if (room?.roomCode) {
      await loadInitialMessages(room.roomCode);
      
      // 읽음 처리
      try {
        await markAsRead(room.roomCode, expoId);
        
        // 읽음 처리 후 UI에서 안읽은 개수를 0으로 업데이트
        setChatRooms(prev => prev.map(r => 
          r.roomCode === room.roomCode 
            ? { ...r, unreadCount: 0 }
            : r
        ));
        
      } catch (err) {
        console.error('읽음 처리 실패:', err);
      }
      
      // WebSocket room join for real-time updates
      if (wsConnected && ChatWebSocketService.isConnected()) {
        try {
          // Set up message handler for this room
          ChatWebSocketService.onMessage(room.roomCode, (newMessage) => {
          // 일반 메시지 처리
          if (newMessage.type === 'MESSAGE' || newMessage.type === 'ADMIN_MESSAGE' || !newMessage.type) {
            // roomCode 검증: 현재 채팅방의 메시지인지 확인
            const messageRoomCode = newMessage.payload?.roomCode || newMessage.payload?.roomId || 
                                  newMessage.roomCode || newMessage.roomId;
            
            // 현재 선택된 채팅방과 메시지의 roomCode가 일치하는 경우에만 처리
            if (messageRoomCode === room.roomCode) {
              const messageData = {
                id: newMessage.payload?.messageId || newMessage.messageId,
                content: newMessage.payload?.content || newMessage.content,
                senderId: newMessage.payload?.senderId || newMessage.senderId,
                senderType: newMessage.payload?.senderType || newMessage.senderType || 'USER',
                senderName: newMessage.payload?.senderName || newMessage.senderName,
                sentAt: newMessage.payload?.sentAt || newMessage.sentAt,
                unreadCount: newMessage.payload?.unreadCount !== undefined ? newMessage.payload?.unreadCount : 
                            (newMessage.unreadCount !== undefined ? newMessage.unreadCount : 1)
              };
              
              addMessage(messageData);
              
              // 사용자 메시지가 오면 자동으로 읽음 처리
              if (messageData.senderType === 'USER') {
                markAsRead(room.roomCode, expoId)
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
        
        // 읽음 상태 업데이트 핸들러 등록
        ChatWebSocketService.subscribeToUnreadUpdates(room.roomCode, (updateData) => {
          if (updateData.type === 'read_status_update') {
            const payload = updateData.payload || updateData;
            const readerType = payload.readerType;
            
            // 유저가 읽었을 때 → 내(관리자)가 보낸 메시지들의 "1" 제거  
            if (readerType === 'USER') {
              try {
                // Immediate state update: remove badges from my admin messages
                const myAdminMessages = messages.filter(msg => {
                  const isMyMsg = msg.senderType === 'ADMIN' && msg.senderId === currentUserId;
                  return isMyMsg && msg.unreadCount > 0;
                });
                const updatedCount = myAdminMessages.length;
                
                if (messages.length === 0) {
                  // 메시지가 아직 로드되지 않았다면 즉시 로드
                  if (selectedRoom && selectedRoom.roomCode) {
                    loadInitialMessages(selectedRoom.roomCode).catch(console.error);
                  }
                } else if (updatedCount > 0) {
                  // Update messages state to remove unread badges
                  messages.forEach(msg => {
                    const isMyMsg = msg.senderType === 'ADMIN' && msg.senderId === currentUserId;
                    if (isMyMsg && msg.unreadCount > 0) {
                      updateMessage(msg.id, { unreadCount: 0 });
                    }
                  });
                } else {
                  // 업데이트할 메시지가 없어도 안전을 위해 새로고침
                  if (selectedRoom && selectedRoom.roomCode) {
                    loadInitialMessages(selectedRoom.roomCode).catch(console.error);
                  }
                }
              } catch (error) {
                console.error('Failed to update admin read status, falling back to immediate refetch:', error);
                // Fallback: immediate refetch if state update fails
                if (selectedRoom && selectedRoom.roomCode) {
                  loadInitialMessages(selectedRoom.roomCode).catch(console.error);
                }
              }
            }
          }
        });
        
        // 이제 joinRoom 호출 (핸들러들이 모두 등록된 후!)
        await ChatWebSocketService.joinRoom(room.roomCode);
        
        } catch (error) {
          console.error('WebSocket 방 입장 실패:', error);
        }
      }
    }
  }, [selectedRoom, wsConnected, resetMessages, loadInitialMessages, addMessage]);


  // Handle message send
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedRoom?.roomCode || !wsConnected) return;
    
    try {
      ChatWebSocketService.sendAdminMessage(selectedRoom.roomCode, newMessage.trim(), parseInt(expoId));
      setNewMessage('');
      
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      setError('메시지 전송에 실패했습니다.');
    }
  }, [newMessage, selectedRoom, wsConnected, expoId]);


  // Custom room list functions for expo admin
  const getRoomTitle = (room) => room.otherMemberName || '익명';
  
  const getRoomSubtitle = (room) => {
    if (room.currentAdminCode) {
      return `담당자: ${room.adminDisplayName || room.currentAdminCode}`;
    }
    return '미배정';
  };
  
  const getRoomAvatar = (room) => {
    return 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f464/emoji.svg'; // User silhouette emoji
  };
  
  // Custom header content
  const renderChatHeader = () => (
    <div className={styles.defaultHeader}>
      <h3>{selectedRoom.otherMemberName || '익명'}님과의 상담</h3>
      <div className={styles.connectionStatus}>
        <span className={`${styles.statusDot} ${wsConnected ? styles.connected : styles.disconnected}`} />
        {wsConnected ? '실시간 연결됨' : '연결 끊김'}
      </div>
    </div>
  );

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
        {/* Left: Chat Room List */}
        <aside className={styles.sidebar}>
          <SharedChatRoomList
            chatRooms={chatRooms}
            selectedRoom={selectedRoom}
            loading={loading}
            error={error}
            unreadCounts={{}}
            onRoomSelect={handleRoomSelect}
            onRefresh={loadChatRooms}
            title={`상담자 목록 (${chatRooms.length})`}
            emptyMessage="문의가 없습니다"
            getRoomTitle={getRoomTitle}
            getRoomSubtitle={getRoomSubtitle}
            getRoomAvatar={getRoomAvatar}
          />
        </aside>

        {/* Right: Chat Area */}
        <section className={styles.chatArea}>
          <SharedChatArea
            messages={messages}
            loading={loadingMessages}
            loadingOlder={loadingOlder}
            hasMore={hasMore}
            isInitialLoad={isInitialLoad}
            error={messageError}
            currentUserId={currentUserId}
            currentUserType="ADMIN"
            selectedRoom={selectedRoom}
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            placeholder="메시지를 입력해주세요"
            messagesContainerRef={messagesContainerRef}
            messagesEndRef={messagesEndRef}
            onScroll={handleScroll}
            onScrollToBottom={scrollToBottom}
            headerContent={selectedRoom ? renderChatHeader() : null}
            isConnected={wsConnected}
          />
        </section>
      </div>
    </div>
  );
}

export default Inquiry;
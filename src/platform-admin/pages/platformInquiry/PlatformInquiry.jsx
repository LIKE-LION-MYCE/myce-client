import { useState, useEffect, useCallback } from 'react';
import { getChatRooms, getChatMessages, markAsRead } from '../../../api/service/chat/chatService';
import * as ChatWebSocketService from '../../../api/service/chat/ChatWebSocketService';
import { useWorkingChatScroll } from '../../../hooks/useWorkingChatScroll';
import SharedChatArea from '../../../components/shared/chat/SharedChatArea';
import SharedChatRoomList from '../../../components/shared/chat/SharedChatRoomList';
import styles from './PlatformInquiry.module.css';

// Room states from backend ChatRoom.ChatRoomState enum
const ROOM_STATES = {
  AI_ACTIVE: 'AI_ACTIVE',                    // AI handling chat - "Request Human" button
  WAITING_FOR_ADMIN: 'WAITING_FOR_ADMIN',   // User requested human help - "Cancel Request" button  
  HUMAN_ACTIVE: 'HUMAN_ACTIVE',             // Admin took over - "Request AI" button
  HUMAN_INACTIVE: 'HUMAN_INACTIVE'          // Admin inactive for 5+ mins - "Continue with AI" button
};

function PlatformInquiry() {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hasNewHandoffRequest, setHasNewHandoffRequest] = useState(false);
  const [requestingRooms, setRequestingRooms] = useState(new Set()); // Track specific rooms requesting handoff
  
  // Use the optimized pagination hook
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
    reset: resetMessages
  } = useWorkingChatScroll(getChatMessages);

  // For compatibility with SharedChatArea
  const isInitialLoad = loadingMessages;

  // Load platform chat rooms (only platform rooms for admin)
  const loadChatRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getChatRooms();
      
      console.log('Raw API response:', {
        status: response.status,
        data: response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data)
      });
      
      // Handle different response formats
      let allRooms = [];
      if (Array.isArray(response.data)) {
        allRooms = response.data;
      } else if (response.data && Array.isArray(response.data.chatRooms)) {
        // Backend returns { chatRooms: [...], totalCount: ... }
        allRooms = response.data.chatRooms;
      } else if (response.data && Array.isArray(response.data.content)) {
        // Paginated response format
        allRooms = response.data.content;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Nested data format
        allRooms = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        console.warn('Unexpected response format:', response.data);
        allRooms = [];
      }
      
      console.log('Chat rooms after parsing:', {
        totalRooms: allRooms.length,
        isArray: Array.isArray(allRooms),
        rooms: allRooms.length > 0 ? allRooms.map(r => ({ roomCode: r.roomCode, type: r.roomCode?.split('-')[0] })) : []
      });
      
      // Filter only platform rooms (format: platform-{userId})
      // Platform admins should only see platform support rooms, not expo rooms
      const platformRooms = allRooms
        .filter(room => {
          const isPlatformRoom = room.roomCode?.startsWith('platform-');
          
          console.log('Platform admin room filtering:', {
            roomCode: room.roomCode,
            expoId: room.expoId,
            expoTitle: room.expoTitle,
            isPlatformRoom,
            shouldInclude: isPlatformRoom
          });
          
          return isPlatformRoom;
        })
        .map(room => ({
          ...room,
          // Add state detection logic
          needsAttention: room.isWaitingForAdmin || room.hasUnansweredMessages,
          currentState: determineRoomState(room)
        }));

      // Sort by priority: handoff requested first, then by last message time
      platformRooms.sort((a, b) => {
        if (a.needsAttention && !b.needsAttention) return -1;
        if (!a.needsAttention && b.needsAttention) return 1;
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      });

      console.log('Platform rooms after filtering:', {
        originalCount: allRooms.length,
        platformCount: platformRooms.length,
        platformRooms: platformRooms.map(r => ({ 
          roomCode: r.roomCode, 
          lastMessage: r.lastMessage,
          needsAttention: r.needsAttention 
        }))
      });

      setChatRooms(platformRooms);
      
      
    } catch (err) {
      console.error('채팅방 로딩 실패:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      let errorMessage = '채팅방을 불러올 수 없습니다.';
      if (err.response?.status === 401) {
        errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
      } else if (err.response?.status === 403) {
        errorMessage = '플랫폼 관리자 권한이 필요합니다.';
      } else if (err.response?.status >= 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Determine room state for UI
  const determineRoomState = (room) => {
    if (room.hasAssignedAdmin) {
      return room.isAdminActive ? ROOM_STATES.HUMAN_ACTIVE : ROOM_STATES.HUMAN_INACTIVE;
    } else if (room.isWaitingForAdmin) {
      return ROOM_STATES.WAITING_FOR_ADMIN;
    } else {
      return ROOM_STATES.AI_ACTIVE;
    }
  };

  // Handle room selection
  const handleRoomSelect = useCallback(async (room) => {
    if (selectedRoom?.roomCode) {
      try {
        await ChatWebSocketService.leaveRoom(selectedRoom.roomCode);
      } catch (err) {
        console.error('이전 채팅방 구독 해제 실패:', err);
      }
    }

    setSelectedRoom(room);
    resetMessages();
    
    // Clear handoff request notification for the selected room
    setRequestingRooms(prev => {
      const newSet = new Set(prev);
      newSet.delete(room.roomCode);
      if (newSet.size === 0) {
        setHasNewHandoffRequest(false);
      }
      return newSet;
    });
    
    if (room?.roomCode) {
      await loadInitialMessages(room.roomCode);
      await markAsRead(room.roomCode);
      
      // Join WebSocket room for real-time updates
      if (isConnected) {
        try {
          ChatWebSocketService.onMessage(room.roomCode, (messageData) => {
            const newMessage = {
              id: messageData.messageId,
              senderId: messageData.senderId,
              senderType: messageData.senderType || 'USER',
              senderName: messageData.senderName,
              content: messageData.content,
              sentAt: messageData.sentAt,
              unreadCount: 0
            };
            addMessage(newMessage);
            
            // Auto-scroll only if user is near bottom (handled by SharedChatArea)
          });
          
          await ChatWebSocketService.joinRoom(room.roomCode);
        } catch (err) {
          console.error('WebSocket 방 구독 실패:', err);
        }
      }
    }
  }, [selectedRoom, isConnected, resetMessages, loadInitialMessages, addMessage, hasNewHandoffRequest]);

  // Handle message send
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedRoom?.roomCode || !isConnected) return;
    
    try {
      const messageData = {
        roomCode: selectedRoom.roomCode,
        message: newMessage.trim(),
        expoId: null // Platform rooms have no expo
      };
      
      await ChatWebSocketService.sendAdminMessage(messageData);
      setNewMessage('');
      
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      alert('메시지 전송에 실패했습니다.');
    }
  }, [newMessage, selectedRoom, isConnected]);

  // Handle admin takeover with AI summary
  const handleTakeOver = useCallback(async () => {
    if (!selectedRoom?.roomCode) return;
    
    try {
      console.log('🎯 Starting handoff process for room:', selectedRoom.roomCode);
      
      // Step 1: Request AI conversation summary
      console.log('📋 Requesting AI conversation summary...');
      try {
        const summaryResponse = await fetch(`/api/ai/chat/${selectedRoom.roomCode}/summary`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          console.log('✅ AI Summary received:', summaryData);
          
          // Send summary as admin message
          await ChatWebSocketService.sendAdminMessage({
            roomCode: selectedRoom.roomCode,
            message: `📋 **상담 요약**\n\n${summaryData.summary || '요약을 생성할 수 없습니다.'}`,
            expoId: null
          });
        } else {
          console.warn('⚠️ Failed to get AI summary, proceeding without it');
        }
      } catch (summaryError) {
        console.error('❌ AI summary failed:', summaryError);
        // Continue with handoff even if summary fails
      }
      
      // Step 2: Send handoff message
      await ChatWebSocketService.sendAdminMessage({
        roomCode: selectedRoom.roomCode,
        message: "👨‍💼 관리자가 상담을 인계받았습니다. 어떻게 도와드릴까요?",
        expoId: null,
        isHandoffMessage: true
      });
      
      // Step 3: Update room state and clear notification for this room
      setRequestingRooms(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedRoom.roomCode);
        if (newSet.size === 0) {
          setHasNewHandoffRequest(false);
        }
        return newSet;
      });
      loadChatRooms();
      
      console.log('✅ Handoff completed successfully');
      
    } catch (err) {
      console.error('❌ 상담 인계 실패:', err);
      alert('상담 인계에 실패했습니다.');
    }
  }, [selectedRoom, loadChatRooms]);

  // Play notification sound for handoff requests
  const playNotificationSound = useCallback(() => {
    // Simple notification sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio notification not supported:', error);
    }
  }, []);

  // Trigger handoff notification (subtle visual alerts only)
  const triggerHandoffNotification = useCallback(() => {
    console.log('🔔 Triggering handoff notification...');
    setHasNewHandoffRequest(true);
    
    // Auto-refresh room list to show new requests
    setTimeout(() => {
      loadChatRooms();
    }, 100);
    
    // Keep notification until operator clicks on the room (don't auto-clear)
  }, [loadChatRooms]);

  // WebSocket setup and get user info
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
          return;
        }
        
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.memberId;
        setCurrentUserId(userId);
        
        console.log('Platform admin connecting to WebSocket...', { 
          userId, 
          role: tokenPayload.role,
          authorities: tokenPayload.authorities,
          token: token.substring(0, 50) + '...' // Show first 50 chars for debugging
        });
        await ChatWebSocketService.connect(token, userId);
        setIsConnected(true);
        
        // Subscribe to platform-wide admin notifications
        console.log('🔗 Setting up platform admin notifications subscription...');
        const platformSubscription = ChatWebSocketService.subscribeToPlatformAdminUpdates((updateData) => {
          console.log('🚨 Platform admin update received:', updateData);
          
          if (updateData.type === 'HANDOFF_REQUEST' || 
              (updateData.type === 'BUTTON_STATE_UPDATE' && 
               updateData.payload?.state === 'WAITING_FOR_ADMIN')) {
            
            console.log('🔔 New handoff request detected!');
            triggerHandoffNotification();
          }
        });
        
        
        // Also set up a global handler for any new platform rooms
        window.globalPlatformNotificationHandler = (data, roomCode) => {
          console.log('🔍 Global handler - checking room message for handoff:', { data, roomCode });
          
          if (data.type === 'AI_HANDOFF_REQUEST' || 
              (data.type === 'BUTTON_STATE_UPDATE' && 
               data.payload?.state === 'WAITING_FOR_ADMIN')) {
            
            console.log('🔔 Handoff request detected from global handler:', roomCode);
            triggerHandoffNotification();
          }
        };
        
        
      } catch (err) {
        console.error('WebSocket 연결 실패:', err);
        setError('실시간 연결에 실패했습니다.');
        setIsConnected(false);
      }
    };

    connectWebSocket();
    loadChatRooms();
    
    return () => {
      if (selectedRoom?.roomCode) {
        ChatWebSocketService.leaveRoom(selectedRoom.roomCode);
      }
    };
  }, [loadChatRooms, selectedRoom?.roomCode, triggerHandoffNotification]);

  // Subscribe to all platform rooms for handoff notifications
  useEffect(() => {
    if (isConnected && chatRooms.length > 0) {
      console.log('🔗 Subscribing to all platform room channels for notifications...');
      
      chatRooms.forEach(room => {
        if (room.roomCode?.startsWith('platform-')) {
          console.log('📡 Setting up notification handler for room:', room.roomCode);
          
          // Set up message handler FIRST (this overwrites any existing handler)
          ChatWebSocketService.onMessage(room.roomCode, (messageData) => {
            console.log('📥 Platform admin notification from', room.roomCode, ':', messageData);
            console.log('📋 Message type:', messageData.type, 'Payload:', messageData.payload);
            
            // SIMPLE TEST: Make ANY message from this room cause glow
            console.log('🧪 TEST: Making room glow for ANY message type');
            setRequestingRooms(prev => new Set([...prev, room.roomCode]));
            setHasNewHandoffRequest(true);
            
            // Also check specific conditions (but don't rely on them for now)
            if (messageData.type === 'AI_HANDOFF_REQUEST' || 
                (messageData.type === 'BUTTON_STATE_UPDATE' && 
                 messageData.payload?.state === 'WAITING_FOR_ADMIN')) {
              
              console.log('🔔 Specific handoff request detected from room', room.roomCode);
            }
          });
          
          // Then join room (this may reuse existing subscription, but handler is already set)
          ChatWebSocketService.joinRoom(room.roomCode);
        }
      });
    }
  }, [isConnected, chatRooms, triggerHandoffNotification]);

  // Custom header content for AI chat monitoring
  const renderChatHeader = () => (
    <div className={styles.chatHeaderContent}>
      <div className={styles.chatInfo}>
        <span className={styles.chatTitle}>
          {selectedRoom.otherMemberName || `사용자 ${selectedRoom.roomCode.split('-')[1]}`}님과의 AI 상담
        </span>
        {renderRoomStateBadge(selectedRoom)}
      </div>
      
      {selectedRoom.needsAttention && (
        <button 
          className={styles.takeOverButton}
          onClick={handleTakeOver}
          disabled={!isConnected}
        >
          ✋ 상담 인계받기
        </button>
      )}
    </div>
  );

  // Render room state badge
  const renderRoomStateBadge = (room) => {
    const state = room.currentState;
    const badgeClass = {
      [ROOM_STATES.AI_ACTIVE]: styles.badgeAiActive,
      [ROOM_STATES.WAITING_FOR_ADMIN]: styles.badgeWaiting,
      [ROOM_STATES.HUMAN_ACTIVE]: styles.badgeHumanActive,
      [ROOM_STATES.HUMAN_INACTIVE]: styles.badgeHumanInactive
    }[state] || styles.badgeDefault;

    const badgeText = {
      [ROOM_STATES.AI_ACTIVE]: '🤖 AI 상담',
      [ROOM_STATES.WAITING_FOR_ADMIN]: '⏳ 상담원 대기',
      [ROOM_STATES.HUMAN_ACTIVE]: '👨‍💼 상담원 활성',
      [ROOM_STATES.HUMAN_INACTIVE]: '💤 상담원 비활성'
    }[state] || '❓ 알 수 없음';

    return (
      <span className={`${styles.stateBadge} ${badgeClass}`}>
        {badgeText}
      </span>
    );
  };

  // Custom room list functions
  const getRoomPriority = (room) => {
    if (room.needsAttention) return 100; // Highest priority
    if (room.currentState === ROOM_STATES.HUMAN_ACTIVE) return 50;
    return 0;
  };

  const getRoomBadges = (room) => {
    const badges = [];
    if (room.needsAttention) {
      badges.push(<span key="attention" className={styles.attentionBadge}>🚨</span>);
    }
    return badges;
  };

  const getRoomClassName = (room) => {
    // Show glowing effect if room needs attention OR is specifically requesting handoff
    if (room.needsAttention || requestingRooms.has(room.roomCode)) {
      return styles.glowingRoom;
    }
    return '';
  };

  const filterPlatformRooms = (rooms) => 
    rooms.filter(room => room.roomCode?.startsWith('platform-'));

  return (
    <div className={styles.platformInquiry}>
      <div className={styles.header}>
        <h1>플랫폼 AI 상담 모니터링</h1>
        <div className={styles.connectionStatus}>
          <span className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`} />
          {isConnected ? '실시간 연결됨' : '연결 끊김'}
        </div>
      </div>

      <div className={styles.chatContainer}>
        {/* Left: Chat Room List */}
        <aside className={styles.sidebar}>
          <SharedChatRoomList
            chatRooms={chatRooms}
            selectedRoom={selectedRoom}
            loading={loading}
            error={error}
            unreadCounts={unreadCounts}
            onRoomSelect={handleRoomSelect}
            onRefresh={loadChatRooms}
            title="AI 상담 목록"
            emptyMessage="현재 진행 중인 AI 상담이 없습니다"
            getRoomPriority={getRoomPriority}
            getRoomBadges={getRoomBadges}
            getRoomClassName={getRoomClassName}
            filterRooms={filterPlatformRooms}
          />
        </aside>

        {/* Right: Chat Area */}
        <main className={styles.chatMain}>
          <SharedChatArea
            messages={messages}
            loading={loadingMessages}
            hasMore={hasMore}
            isInitialLoad={isInitialLoad}
            error={messageError}
            currentUserId={currentUserId}
            currentUserType="PLATFORM_ADMIN"
            selectedRoom={selectedRoom}
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            placeholder="관리자 메시지를 입력해주세요"
            messagesContainerRef={messagesContainerRef}
            messagesEndRef={messagesEndRef}
            onScroll={handleScroll}
            onScrollToBottom={scrollToBottom}
            headerContent={selectedRoom ? renderChatHeader() : null}
            isConnected={isConnected}
          />
        </main>
      </div>
    </div>
  );
}

export default PlatformInquiry;
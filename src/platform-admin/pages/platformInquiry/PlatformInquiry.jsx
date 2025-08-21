import { useState, useEffect, useCallback } from 'react';
import { getChatRooms, getChatMessages, markAsRead } from '../../../api/service/chat/chatService';
import * as ChatWebSocketService from '../../../api/service/chat/ChatWebSocketService';
import { useWorkingChatScroll } from '../../../hooks/useWorkingChatScroll';
import SharedChatArea from '../../../components/shared/chat/SharedChatArea';
import SharedChatRoomList from '../../../components/shared/chat/SharedChatRoomList';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import styles from './PlatformInquiry.module.css';

// Room states from backend ChatRoom.ChatRoomState enum (3-state system)
const ROOM_STATES = {
  AI_ACTIVE: 'AI_ACTIVE',                    // AI handling chat - "Request Human" button
  WAITING_FOR_ADMIN: 'WAITING_FOR_ADMIN',   // User requested human help - "Cancel Request" button  
  ADMIN_ACTIVE: 'ADMIN_ACTIVE'              // Admin took over - "Request AI" button
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
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  // Toast helper function
  const triggerToastFail = useCallback((message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 4000); // 4 seconds duration
  }, []);
  
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
        allRooms = [];
      }
      
      // Filter only platform rooms (format: platform-{userId})
      // Platform admins should only see platform support rooms, not expo rooms
      const platformRooms = allRooms
        .filter(room => room.roomCode?.startsWith('platform-'))
        .map(room => {
          const finalState = determineRoomState(room);
          
          console.log('🎭 ROOM STATE:', room.roomCode, '→', finalState);
          
          return {
            ...room,
            // Add state detection logic
            needsAttention: room.isWaitingForAdmin || room.hasUnansweredMessages,
            currentState: finalState
          };
        });

      // Sort by priority: handoff requested first, then by last message time
      platformRooms.sort((a, b) => {
        if (a.needsAttention && !b.needsAttention) return -1;
        if (!a.needsAttention && b.needsAttention) return 1;
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
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

  // Determine room state for UI (3-state system)
  const determineRoomState = (room) => {
    // Use currentState if available (from backend ChatRoomState enum)
    if (room.currentState) {
      return room.currentState;
    }
    
    // Fallback to legacy logic
    if (room.hasAssignedAdmin) {
      return ROOM_STATES.ADMIN_ACTIVE;
    } else if (room.isWaitingForAdmin) {
      return ROOM_STATES.WAITING_FOR_ADMIN;
    } else {
      return ROOM_STATES.AI_ACTIVE;
    }
  };

  // Handle system messages for state synchronization
  const handleSystemMessage = useCallback((messageData, roomCode, shouldDisplayMessage = true) => {
    
    // Handle room state updates from all message types
    if (messageData.roomState) {
      const roomState = messageData.roomState;
      
      // Update requesting rooms based on actual backend state
      if (roomState.current === 'WAITING_FOR_ADMIN') {
        setRequestingRooms(prev => new Set([...prev, roomCode]));
        setHasNewHandoffRequest(true);
      } else {
        // Clear handoff request for any non-waiting state
        setRequestingRooms(prev => {
          const newSet = new Set(prev);
          newSet.delete(roomCode);
          if (newSet.size === 0) {
            setHasNewHandoffRequest(false);
          }
          return newSet;
        });
      }
      
      // Update selected room if this is for the currently selected room
      setSelectedRoom(prevRoom => {
        if (prevRoom && prevRoom.roomCode === roomCode) {
          return {
            ...prevRoom,
            currentState: roomState.current,
            hasAssignedAdmin: roomState.adminInfo ? true : false,
            isWaitingForAdmin: roomState.current === 'WAITING_FOR_ADMIN',
            adminDisplayName: roomState.adminInfo?.displayName || prevRoom.adminDisplayName,
            currentAdminCode: roomState.adminInfo?.adminCode || prevRoom.currentAdminCode,
            lastAdminActivity: roomState.adminInfo?.lastActivity || prevRoom.lastAdminActivity
          };
        }
        return prevRoom;
      });
      
      // ALSO update the room in the chatRooms list to sync avatars
      setChatRooms(prevRooms => prevRooms.map(room => {
        if (room.roomCode === roomCode) {
          console.log('🔄 UPDATING ROOM LIST STATE:', roomCode, '→', roomState.current);
          return {
            ...room,
            currentState: roomState.current,
            hasAssignedAdmin: roomState.adminInfo ? true : false,
            isWaitingForAdmin: roomState.current === 'WAITING_FOR_ADMIN'
          };
        }
        return room;
      }));
      
      // Note: Room list is already updated above via setChatRooms(), no need to reload from API
    }
    
    switch (messageData.type) {
      case 'AI_HANDOFF_REQUEST':
        console.log('🔔 Handoff request detected for room:', roomCode);
        // State handling is done above via roomState
        break;
        
      case 'BUTTON_STATE_UPDATE':
        console.log('🔘 Button state update:', messageData.payload?.state);
        // State handling is done above via roomState
        break;
        
      case 'ADMIN_ASSIGNMENT_UPDATE':
        console.log('👨‍💼 Admin assignment update:', messageData.payload);
        // State is already updated via BUTTON_STATE_UPDATE - no need to refresh
        break;
        
      case 'AI_MESSAGE':
        // Handle AI messages (including summaries and handoff completion)
        if (shouldDisplayMessage) {
          const aiMessage = {
            id: messageData.payload.messageId,
            senderId: messageData.payload.senderId,
            senderType: messageData.payload.senderType,
            senderName: messageData.payload.senderName,
            content: messageData.payload.content,
            sentAt: messageData.payload.sentAt,
            unreadCount: 0
          };
          addMessage(aiMessage);
        }
        break;
        
      case 'ADMIN_MESSAGE':
        // Handle admin messages during handoff
        if (shouldDisplayMessage) {
          const adminMessage = {
            id: messageData.payload.messageId,
            senderId: messageData.payload.senderId,
            senderType: messageData.payload.senderType,
            senderName: messageData.payload.senderName || messageData.payload.adminDisplayName,
            content: messageData.payload.content,
            sentAt: messageData.payload.sentAt,
            unreadCount: 0
          };
          addMessage(adminMessage);
        }
        break;
        
      case 'ADMIN_INTERVENTION':
        // Handle proactive admin intervention messages
        if (shouldDisplayMessage) {
          const interventionMessage = {
            id: messageData.payload.messageId,
            senderId: messageData.payload.senderId,
            senderType: messageData.payload.senderType,
            senderName: messageData.payload.adminDisplayName || 'Platform Admin',
            content: messageData.payload.content,
            sentAt: messageData.payload.sentAt,
            unreadCount: 0
          };
          addMessage(interventionMessage);
        }
        
        // State is already updated via BUTTON_STATE_UPDATE - no need to refresh
        console.log('🚀 Admin intervention completed');
        break;
        
      case 'AI_TIMEOUT_TAKEOVER':
        // Handle admin timeout and AI takeover messages
        if (shouldDisplayMessage) {
          const timeoutMessage = {
            id: messageData.payload.messageId,
            senderId: messageData.payload.senderId,
            senderType: messageData.payload.senderType,
            senderName: messageData.payload.senderName || 'AI 상담사',
            content: messageData.payload.content,
            sentAt: messageData.payload.sentAt,
            unreadCount: 0
          };
          addMessage(timeoutMessage);
        }
        
        // State is already updated via BUTTON_STATE_UPDATE - no need to refresh
        console.log('⏰ Admin timeout occurred');
        break;
        
      case 'SYSTEM_MESSAGE':
        // Handle system messages (not chat bubbles, but special UI elements)
        console.log('🎭 System message received:', messageData.payload);
        if (shouldDisplayMessage) {
          const systemMessage = {
            id: `system-${Date.now()}`,
            type: 'SYSTEM_MESSAGE',
            payload: messageData.payload,
            timestamp: messageData.payload?.timestamp || new Date().toISOString(),
            sentAt: messageData.payload?.timestamp || new Date().toISOString(),
            unreadCount: 0
          };
          console.log('🎭 Admin side - Adding system message:', systemMessage);
          addMessage(systemMessage);
        }
        
        // Refresh room list after state transitions
        if (messageData.payload?.type === 'ADMIN_INTERVENTION_START') {
          console.log('🔄 System message received - state handled via WebSocket');
          // State updates handled via WebSocket - no refresh needed
        }
        break;
        
      default:
        console.log('🤷‍♂️ Unknown system message type:', messageData.type);
    }
  }, [setRequestingRooms, setHasNewHandoffRequest, loadChatRooms, addMessage]);

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
    
    // Don't clear handoff request notification when selecting room
    // Let it persist until operator explicitly accepts the handoff
    
    if (room?.roomCode) {
      await loadInitialMessages(room.roomCode);
      await markAsRead(room.roomCode);
      
      // Join WebSocket room for real-time updates
      if (isConnected) {
        try {
          // Set up unified message handler that handles regular messages and system messages for selected room
          ChatWebSocketService.onMessage(room.roomCode, (messageData) => {
            console.log('🎯 ADMIN SIDE - Raw message received for selected room:', {
              type: messageData.type,
              senderType: messageData.senderType,
              content: messageData.content?.substring(0, 50),
              hasPayload: !!messageData.payload,
              hasRoomState: !!messageData.roomState,
              fullData: messageData
            });
            
            // Use the same unified system message handler for consistency
            if (messageData.type) {
              console.log('🔧 ROOM HANDLER - Processing message via unified handler:', messageData.type);
              handleSystemMessage(messageData, room.roomCode, true); // Display messages for room-specific handler
            } else {
              console.log('🔧 ROOM HANDLER - Processing as regular message');
              
              // Skip persistent system messages in live WebSocket to avoid duplicates
              if (messageData.senderType === 'SYSTEM') {
                console.log('🎭 ROOM HANDLER - Skipping persistent system message in live WebSocket to avoid duplicate');
                return;
              }
              
              // Handle regular message format
              const newMessage = {
                id: messageData.messageId || messageData.id,
                senderId: messageData.senderId,
                senderType: messageData.senderType || 'USER',
                senderName: messageData.senderName,
                content: messageData.content,
                sentAt: messageData.sentAt,
                unreadCount: 0
              };
              addMessage(newMessage);
            }
          });
          
          // Subscribe to unread updates for read status handling
          ChatWebSocketService.subscribeToUnreadUpdates(room.roomCode, (updateData) => {
            if (updateData.type === 'read_status_update') {
              const payload = updateData.payload || updateData;
              const readerType = payload.readerType;
              
              // 유저가 읽었을 때 → 내(플랫폼 관리자)가 보낸 메시지들의 "1" 제거  
              if (readerType === 'USER') {
                try {
                  // Immediate state update: remove badges from my platform admin messages
                  const updatedCount = messages.filter(msg => {
                    const isMyMsg = msg.senderType === 'PLATFORM_ADMIN' && msg.senderId === currentUserId;
                    return isMyMsg && msg.unreadCount > 0;
                  }).length;
                  
                  if (updatedCount > 0) {
                    console.log(`🔄 Removing ${updatedCount} unread badges from my platform admin messages (USER read them)`);
                    
                    // Update messages state to remove unread badges
                    messages.forEach(msg => {
                      const isMyMsg = msg.senderType === 'PLATFORM_ADMIN' && msg.senderId === currentUserId;
                      if (isMyMsg && msg.unreadCount > 0) {
                        updateMessage(msg.id, { unreadCount: 0 });
                      }
                    });
                    
                    // Background refetch for accuracy after 1.5 seconds
                    setTimeout(async () => {
                      try {
                        if (selectedRoom && selectedRoom.roomCode) {
                          console.log('🔄 Platform admin background refetch for accuracy after read status update');
                          await loadInitialMessages(selectedRoom.roomCode);
                        }
                      } catch (error) {
                        console.error('Platform admin background refetch failed:', error);
                      }
                    }, 1500);
                  }
                } catch (error) {
                  console.error('Failed to update platform admin read status, falling back to immediate refetch:', error);
                  // Fallback: immediate refetch if state update fails
                  if (selectedRoom && selectedRoom.roomCode) {
                    loadInitialMessages(selectedRoom.roomCode).catch(console.error);
                  }
                }
              }
            }
          });
          
          await ChatWebSocketService.joinRoom(room.roomCode);
        } catch (err) {
          console.error('WebSocket 방 구독 실패:', err);
        }
      }
    }
  }, [selectedRoom, isConnected, resetMessages, loadInitialMessages, addMessage]);

  // Check if current user has admin permission for selected room
  const hasAdminPermission = useCallback((room) => {
    if (!room || !room.currentAdminCode) return true; // No admin assigned, permission granted
    
    // Platform admins use "PLATFORM_ADMIN" as their adminCode
    const currentAdminCode = "PLATFORM_ADMIN";
    return room.currentAdminCode === currentAdminCode;
  }, []);

  // Handle message send with permission check
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedRoom?.roomCode || !isConnected) return;
    
    // Check room state first - operators cannot send messages during AI_ACTIVE state
    const currentState = determineRoomState(selectedRoom);
    if (currentState === ROOM_STATES.AI_ACTIVE) {
      triggerToastFail('AI 상담 중에는 직접 메시지를 보낼 수 없습니다. "개입하기" 버튼을 사용해주세요.');
      return;
    }
    
    // Permission check: Only allow message if user has admin permission
    if (!hasAdminPermission(selectedRoom)) {
      triggerToastFail(`이 상담은 다른 관리자(${selectedRoom.adminDisplayName || '관리자'})가 담당하고 있습니다.`);
      return;
    }
    
    try {
      // Call sendAdminMessage with three separate parameters, not an object
      await ChatWebSocketService.sendAdminMessage(
        selectedRoom.roomCode,
        newMessage.trim(),
        null // Platform rooms have no expo
      );
      setNewMessage('');
      
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      if (err.response?.data?.message?.includes('권한')) {
        triggerToastFail(`상담 권한이 없습니다: ${err.response.data.message}`);
      } else if (err.response?.data?.message?.includes('개입하기')) {
        triggerToastFail('AI 상담 중에는 직접 메시지를 보낼 수 없습니다. "개입하기" 버튼을 사용해주세요.');
      } else {
        triggerToastFail('메시지 전송에 실패했습니다.');
      }
    }
  }, [newMessage, selectedRoom, isConnected, hasAdminPermission, triggerToastFail]);

  // Handle proactive admin intervention for AI_ACTIVE rooms (with permission check)
  const handleProactiveIntervention = useCallback(async () => {
    if (!selectedRoom?.roomCode) return;
    
    // Permission check for intervention
    if (selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom)) {
      alert(`다른 관리자(${selectedRoom.adminDisplayName || '관리자'})가 이미 이 상담을 담당하고 있습니다.`);
      return;
    }
    
    try {
      
      // Call the new proactive intervention endpoint
      await ChatWebSocketService.proactiveIntervention(selectedRoom.roomCode);
      
      
    } catch (err) {
      console.error('Proactive intervention failed:', err);
      if (err.response?.data?.message?.includes('권한') || err.response?.data?.message?.includes('담당')) {
        alert(`개입 권한이 없습니다: ${err.response.data.message}`);
      } else {
        alert('관리자 개입에 실패했습니다.');
      }
    }
  }, [selectedRoom, hasAdminPermission]);

  // Handle admin takeover with AI summary (user-requested handoff, with permission check)
  const handleTakeOver = useCallback(async () => {
    if (!selectedRoom?.roomCode) return;
    
    // Permission check for takeover
    if (selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom)) {
      alert(`다른 관리자(${selectedRoom.adminDisplayName || '관리자'})가 이미 이 상담을 담당하고 있습니다.`);
      return;
    }
    
    try {
      console.log('🎯 Starting formal handoff process for room:', selectedRoom.roomCode);
      
      // Send admin message with handoff trigger - backend will detect WAITING_FOR_ADMIN state and:
      // 1. Generate AI conversation summary and broadcast it  
      // 2. Call handoffAIToAdmin() for proper state transition
      // 3. Assign admin and enable operator chat
      // 4. Send handoff completion message with admin info
      // 5. Update button state to ADMIN_ACTIVE
      
      // Use proper state transition endpoint instead of chat message
      await ChatWebSocketService.acceptHandoff(selectedRoom.roomCode);
      
      // Clear frontend notification - backend will handle the rest
      setRequestingRooms(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedRoom.roomCode);
        if (newSet.size === 0) {
          setHasNewHandoffRequest(false);
        }
        return newSet;
      });
      
      console.log('✅ Formal handoff initiated - backend will generate AI summary and complete transition');
      
    } catch (err) {
      console.error('❌ 상담 인계 실패:', err);
      if (err.response?.data?.message?.includes('권한') || err.response?.data?.message?.includes('담당')) {
        alert(`인계 권한이 없습니다: ${err.response.data.message}`);
      } else {
        alert('상담 인계에 실패했습니다.');
      }
    }
  }, [selectedRoom, hasAdminPermission]);

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

  // Removed periodic refresh - WebSocket provides real-time updates
  // useEffect(() => {
  //   if (isConnected) {
  //     // Refresh room list every 5 seconds to catch new handoff requests
  //     const refreshInterval = setInterval(() => {
  //       loadChatRooms();
  //     }, 5000);
  //     
  //     return () => clearInterval(refreshInterval);
  //   }
  // }, [isConnected, loadChatRooms]);

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
              updateData.type === 'PLATFORM_HANDOFF_REQUEST' ||  // 🆕 새로운 플랫폼 알림 타입 추가
              (updateData.type === 'BUTTON_STATE_UPDATE' && 
               updateData.payload?.state === 'WAITING_FOR_ADMIN')) {
            
            console.log('🔔 New handoff request detected!');
            triggerHandoffNotification();
          }
        });
        
        // Subscribe to error messages
        ChatWebSocketService.subscribeToUserErrors((errorData) => {
          console.log('❌ WebSocket error received:', errorData);
          if (errorData.error === 'INTERVENTION_REQUIRED') {
            alert(errorData.message);
          } else if (errorData.error === 'PERMISSION_DENIED') {
            alert(`권한이 없습니다: ${errorData.message}`);
          }
        });
        
        
        // Also set up a global handler for any new platform rooms
        window.globalPlatformNotificationHandler = (data, roomCode) => {
          console.log('🔍 Global handler - checking room message for handoff:', { data, roomCode });
          
          if (data.type === 'AI_HANDOFF_REQUEST' || 
              data.type === 'PLATFORM_HANDOFF_REQUEST' ||  // 🆕 새로운 플랫폼 알림 타입 추가
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

  // Subscribe to all platform rooms for handoff notifications (using multiple handler system)
  useEffect(() => {
    if (isConnected && chatRooms.length > 0) {
      console.log('🔗 Subscribing to all platform room channels for notifications...');
      
      const cleanupFunctions = [];
      
      chatRooms.forEach(room => {
        if (room.roomCode?.startsWith('platform-')) {
          console.log('📡 Setting up global notification handler for room:', room.roomCode);
          
          // Add a GLOBAL handler for notifications (works alongside room-specific handlers)
          const removeHandler = ChatWebSocketService.addMessageHandler(room.roomCode, (messageData) => {
            console.log('📥 GLOBAL Platform admin notification from', room.roomCode, ':', {
              type: messageData.type,
              payload: messageData.payload,
              hasRoomState: !!messageData.roomState,
              fullData: messageData
            });
            
            // Use the unified system message handler for consistent state management
            if (messageData.type) {
              console.log('🔧 GLOBAL - Calling handleSystemMessage with type:', messageData.type);
              handleSystemMessage(messageData, room.roomCode, false); // Don't display messages for global handler (notifications only)
            } else {
              console.log('🔧 GLOBAL - No type field, ignoring message');
            }
          });
          
          cleanupFunctions.push(removeHandler);
          
          // Force join room to ensure subscription is active
          console.log('🔗 Force joining room to ensure active subscription:', room.roomCode);
          ChatWebSocketService.joinRoom(room.roomCode);
        }
      });
      
      // Return cleanup function to remove all global handlers
      return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    }
  }, [isConnected, chatRooms, handleSystemMessage]);

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
          disabled={!isConnected || (selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom))}
          title={
            selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom) 
              ? `다른 관리자(${selectedRoom.adminDisplayName || '관리자'})가 담당 중` 
              : '상담 인계받기'
          }
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
      [ROOM_STATES.ADMIN_ACTIVE]: styles.badgeAdminActive
    }[state] || styles.badgeDefault;

    const badgeText = {
      [ROOM_STATES.AI_ACTIVE]: '🤖 AI 상담',
      [ROOM_STATES.WAITING_FOR_ADMIN]: '⏳ 상담원 대기',
      [ROOM_STATES.ADMIN_ACTIVE]: '👨‍💼 상담원 활성'
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
    if (room.currentState === ROOM_STATES.ADMIN_ACTIVE) return 50;
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

  // Custom room display functions
  const getRoomTitle = (room) => {
    // Backend now provides correct user name in otherMemberName field
    const userName = room.otherMemberName || room.memberName || `사용자 ${room.roomCode.split('-')[1]}`;
    return `${userName}님`;
  };

  const getRoomAvatar = (room) => {
    const currentState = determineRoomState(room);
    
    console.log('🖼️ AVATAR:', room.roomCode, currentState === ROOM_STATES.ADMIN_ACTIVE ? '👤 HUMAN' : '🤖 ROBOT');
    
    if (currentState === ROOM_STATES.ADMIN_ACTIVE) {
      // Human silhouette for human chatting
      return "https://fonts.gstatic.com/s/e/notoemoji/latest/1f464/emoji.svg";
    } else {
      // Robot mouse for AI chatting (AI_ACTIVE or WAITING_FOR_ADMIN)
      return "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f916/u1f916_u1f42d.png";
    }
  };

  return (
    <div className={styles.platformInquiry}>
      <div className={styles.header}>
        <h1>플랫폼 상담 모니터링</h1>
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
            title="상담 목록"
            emptyMessage="현재 진행 중인 AI 상담이 없습니다"
            getRoomPriority={getRoomPriority}
            getRoomBadges={getRoomBadges}
            getRoomClassName={getRoomClassName}
            filterRooms={filterPlatformRooms}
            getRoomTitle={getRoomTitle}
            getRoomAvatar={getRoomAvatar}
          />
        </aside>

        {/* Right: Chat Area */}
        <main className={styles.chatMain}>
          {/* Handoff Request Notification Banner */}
          {selectedRoom && requestingRooms.has(selectedRoom.roomCode) && (
            <div className={styles.handoffBanner}>
              <div className={styles.handoffContent}>
                <div className={styles.handoffIcon}>🔔</div>
                <div className={styles.handoffText}>
                  <strong>상담 인계 요청</strong>
                  <p>사용자가 상담원 연결을 요청했습니다. 클릭하여 상담을 인계받으세요.</p>
                </div>
                <button 
                  className={styles.acceptHandoffButton}
                  onClick={handleTakeOver}
                  disabled={
                    !isConnected || 
                    (selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom))
                  }
                  title={
                    selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom)
                      ? `다른 관리자(${selectedRoom.adminDisplayName || '관리자'})가 이미 담당 중`
                      : '상담 인계받기'
                  }
                >
                  ✋ 상담 인계받기
                </button>
              </div>
            </div>
          )}
          
          {/* Admin Active Banner - shows when admin is handling the chat */}
          {selectedRoom && determineRoomState(selectedRoom) === ROOM_STATES.ADMIN_ACTIVE && (
            <div className={styles.adminActiveBanner}>
              <div className={styles.adminActiveContent}>
                <div className={styles.adminActiveIcon}>
                  <img 
                    src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f464/emoji.svg" 
                    alt="관리자" 
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                <div className={styles.adminActiveText}>
                  <strong>관리자 상담 진행 중</strong>
                  <p>{selectedRoom.adminDisplayName || '박람회 관리자 (PLATFORM_ADMIN)'} (상담원)이 직접 상담을 진행하고 있습니다.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Proactive Intervention Banner - shows for AI_ACTIVE rooms */}
          {selectedRoom && !requestingRooms.has(selectedRoom.roomCode) && (() => {
            const currentState = determineRoomState(selectedRoom);
            console.log('🎯 Banner state check:', {
              roomCode: selectedRoom.roomCode,
              currentState,
              hasAssignedAdmin: selectedRoom.hasAssignedAdmin,
              isWaitingForAdmin: selectedRoom.isWaitingForAdmin,
              roomCurrentState: selectedRoom.currentState,
              shouldShowBanner: currentState === ROOM_STATES.AI_ACTIVE
            });
            return currentState === ROOM_STATES.AI_ACTIVE;
          })() && (
            <div className={styles.interventionBanner}>
              <div className={styles.interventionContent}>
                <div className={styles.interventionIcon}>
                  <img 
                    src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f916/u1f916_u1f42d.png" 
                    alt="찍찍봇" 
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                <div className={styles.interventionText}>
                  <strong>AI 상담 진행 중</strong>
                  <p>필요시 관리자가 직접 개입하여 상담을 진행할 수 있습니다.</p>
                </div>
                <button 
                  className={styles.interventionButton}
                  onClick={handleProactiveIntervention}
                  disabled={
                    !isConnected || 
                    (selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom))
                  }
                  title={
                    selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom)
                      ? `다른 관리자(${selectedRoom.adminDisplayName || '관리자'})가 이미 담당 중`
                      : '상담에 개입하기'
                  }
                >
                  🚀 개입하기
                </button>
              </div>
            </div>
          )}
          
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
            placeholder={
              selectedRoom && selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom)
                ? `이 상담은 다른 관리자(${selectedRoom.adminDisplayName || '관리자'})가 담당하고 있습니다`
                : "관리자 메시지를 입력해주세요"
            }
            messagesContainerRef={messagesContainerRef}
            messagesEndRef={messagesEndRef}
            onScroll={handleScroll}
            onScrollToBottom={scrollToBottom}
            headerContent={selectedRoom ? renderChatHeader() : null}
            isConnected={isConnected}
            inputDisabled={
              selectedRoom && selectedRoom.hasAssignedAdmin && !hasAdminPermission(selectedRoom)
            }
          />
        </main>
      </div>

      {/* Toast notifications */}
      {showFailToast && (
        <ToastFail
          message={failMessage}
          onClose={() => setShowFailToast(false)}
        />
      )}
    </div>
  );
}

export default PlatformInquiry;
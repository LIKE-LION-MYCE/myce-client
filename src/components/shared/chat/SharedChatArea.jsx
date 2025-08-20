import { useState } from 'react';
import { formatChatTime } from '../../../utils/timeUtils';
import styles from './SharedChatArea.module.css';
import SystemMessage from './SystemMessage';

/**
 * Shared Chat Area Component
 * 
 * Used by:
 * - User Platform Chat ↔ AI/Admin
 * - Platform Admin Chat ↔ User  
 * - User Expo Chat ↔ Expo Admin
 * - Expo Admin Chat ↔ User
 * 
 * Props customize behavior while sharing UI/UX
 */
export default function SharedChatArea({
  // Data
  messages,
  loading,
  hasMore,
  isInitialLoad,
  error,
  
  // User info
  currentUserId,
  currentUserType, // 'USER' | 'ADMIN' | 'PLATFORM_ADMIN'
  
  // Chat room info
  selectedRoom,
  
  // Input
  newMessage,
  onMessageChange,
  onSendMessage,
  placeholder = "메시지를 입력해주세요",
  
  // Pagination
  messagesContainerRef,
  messagesEndRef,
  onScroll,
  onScrollToBottom,
  
  // Custom header content (optional)
  headerContent,
  
  // Custom message actions (optional)
  onMessageAction,
  
  // State indicators
  isConnected = true,
  
  // Scroll helper
  isNearBottom
}) {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Handle scroll with scroll button visibility
  const handleScroll = (e) => {
    onScroll(e);
    
    // Use the isNearBottom function from the hook if available, otherwise fallback
    const nearBottom = isNearBottom ? isNearBottom() : (() => {
      const container = e.target;
      return container.scrollTop + container.clientHeight >= container.scrollHeight - 200;
    })();
    
    setShowScrollButton(!nearBottom && messages.length > 5);
  };

  // Determine if message is from current user
  const isMyMessage = (message) => {
    const result = currentUserType === 'USER' 
      ? message.senderType === 'USER' && message.senderId === currentUserId
      : message.senderType === 'ADMIN' && message.senderId === currentUserId;
    
    // Remove debug logging
    
    return result;
  };

  // Get message sender display info
  const getMessageSenderInfo = (message) => {
    switch (message.senderType) {
      case 'AI':
        return { 
          name: '찍찍봇 (AI)', 
          type: 'ai', 
          avatar: 'https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f916/u1f916_u1f42d.png' // Robot mouse (original)
        };
      case 'ADMIN':
      case 'PLATFORM_ADMIN':
        const adminName = message.senderName || '상담원';
        const displayName = adminName.includes('상담원') ? adminName : `${adminName} (상담원)`;
        return { 
          name: displayName, 
          type: 'admin', 
          avatar: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f464/emoji.svg' // Simple human silhouette
        };
      case 'USER':
        return { 
          name: message.senderName || '사용자', 
          type: 'user', 
          avatar: null // Users don't show avatar for their own messages
        };
      case 'SYSTEM':
        return { 
          name: '시스템', 
          type: 'system', 
          avatar: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f464/emoji.svg' // Simple human silhouette (same as admin)
        };
      default:
        return { name: '알 수 없음', type: 'unknown', avatar: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2754/emoji.svg' };
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  if (!selectedRoom) {
    return (
      <div className={styles.noChatSelected}>
        <div className={styles.noChatContent}>
          <h3>채팅을 선택해주세요</h3>
          <p>좌측에서 대화를 선택하면 채팅을 시작할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatArea}>
      {/* Header */}
      <header className={styles.chatHeader}>
        {headerContent || (
          <div className={styles.defaultHeader}>
            <h3>{selectedRoom.title || selectedRoom.otherMemberName || '채팅'}</h3>
            <div className={styles.connectionStatus}>
              <span className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`} />
              {isConnected ? '연결됨' : '연결 끊김'}
            </div>
          </div>
        )}
      </header>

      {/* Messages Area */}
      <section 
        className={styles.messagesContainer}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {/* Simple loading indicator only during initial load */}
        {loading && messages.length === 0 && (
          <div className={styles.emptyChat}>
            메시지를 불러오는 중...
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className={styles.errorMessage}>
            <span>메시지 로드 실패: {error}</span>
          </div>
        )}

        {/* Messages */}
        {messages.length === 0 && !loading ? (
          <div className={styles.emptyChat}>
            아직 메시지가 없습니다. 첫 메시지를 보내보세요!
          </div>
        ) : messages.length > 0 && (
          <>
            {messages.map((message, index) => {
              
              // Check if this is a system message (either from WebSocket or persistent from database)
              if (message.type === 'SYSTEM_MESSAGE' || 
                  message.senderType === 'SYSTEM') {
                
                // Removed overly aggressive time-based filtering
                // Let React handle duplicates with proper keys (message.id || index)
                
                // Handle persistent system messages from database
                if (message.senderType === 'SYSTEM' && message.content) {
                  // Parse content to extract type and message (only split on first colon)
                  const colonIndex = message.content.indexOf(':');
                  const systemType = colonIndex > -1 ? message.content.substring(0, colonIndex) : message.content;
                  const systemMessage = colonIndex > -1 ? message.content.substring(colonIndex + 1) : '';
                  
                  // Special handling for different system message types
                  let systemPayload;
                  if (systemType === 'HANDOFF_TO_OPERATOR') {
                    systemPayload = {
                      type: systemType,
                      message: "상담원이 인계받았습니다",
                      aiSummary: systemMessage || "대화 요약을 불러올 수 없습니다",
                      timestamp: message.sentAt,
                      messageId: message.id
                    };
                  } else if (systemType === 'ADMIN_HANDOFF_ACCEPTED') {
                    systemPayload = {
                      type: systemType,
                      message: systemMessage || "관리자가 상담에 참여했습니다",
                      timestamp: message.sentAt,
                      messageId: message.id
                    };
                  } else {
                    systemPayload = {
                      type: systemType,
                      message: systemMessage || systemType,
                      timestamp: message.sentAt,
                      messageId: message.id
                    };
                  }
                  
                  return (
                    <SystemMessage 
                      key={message.id || index}
                      type={systemType}
                      payload={systemPayload}
                      timestamp={message.sentAt}
                    />
                  );
                }
                
                // Handle WebSocket system messages
                return (
                  <SystemMessage 
                    key={message.id || index}
                    type={message.payload?.type}
                    payload={message.payload}
                    timestamp={message.timestamp || message.sentAt}
                  />
                );
              }
              
              const isMyMsg = isMyMessage(message);
              const senderInfo = getMessageSenderInfo(message);
              
              return (
                <div
                  key={message.id || index}
                  className={`${styles.messageRow} ${isMyMsg ? styles.messageRight : styles.messageLeft}`}
                >
                  {/* Avatar (for others' messages) */}
                  {!isMyMsg && senderInfo.avatar && (
                    <div className={styles.messageAvatar}>
                      <img 
                        src={senderInfo.avatar} 
                        alt={senderInfo.name}
                        className={`${styles.avatar} ${styles[senderInfo.type]}`}
                      />
                    </div>
                  )}

                  <div className={styles.messageContent}>
                    {/* Sender name (for others' messages) */}
                    {!isMyMsg && (
                      <div className={styles.senderName}>
                        {senderInfo.name}
                      </div>
                    )}

                    <div className={styles.messageBubbleContainer}>
                      {/* Message bubble */}
                      <div 
                        className={`${styles.messageBubble} ${
                          isMyMsg ? styles.myMessage : 
                          message.senderType === 'AI' ? styles.aiMessage :
                          message.senderType === 'ADMIN' || message.senderType === 'PLATFORM_ADMIN' ? styles.adminMessage : ''
                        }`}
                      >
                        {message.content}
                      </div>

                      {/* Message metadata */}
                      <div className={styles.messageMetadata}>
                        {/* Unread count (for my messages) */}
                        {isMyMsg && message.unreadCount > 0 && (
                          <span className={styles.unreadCount}>
                            {message.unreadCount}
                          </span>
                        )}
                        
                        {/* Timestamp */}
                        <span className={styles.timestamp}>
                          {formatChatTime(message.sentAt)}
                        </span>
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

      {/* Scroll to bottom button */}
      <button
        className={`${styles.scrollToBottomButton} ${showScrollButton ? styles.visible : ''}`}
        onClick={() => {
          onScrollToBottom('smooth');
          setShowScrollButton(false);
        }}
        title="새로운 메시지로 이동"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </button>

      {/* Input Area */}
      <footer className={styles.inputArea}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={!isConnected}
            className={styles.messageInput}
          />
          <button
            onClick={onSendMessage}
            disabled={!isConnected || !newMessage.trim()}
            className={styles.sendButton}
          >
            전송
          </button>
        </div>
      </footer>
    </div>
  );
}
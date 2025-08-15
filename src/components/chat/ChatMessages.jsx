import React from 'react';
import { useChatPagination } from '../../hooks/useChatPagination';

/**
 * Reusable ChatMessages component with pagination
 * Used across all chat interfaces for consistent behavior
 * 
 * Props:
 * - roomCode: Current room identifier
 * - loadMessagesFn: Function to load messages from API
 * - renderMessage: Function to render individual message
 * - onScroll: Optional additional scroll handler
 * - className: CSS class for the container
 * - messagesPerPage: Number of messages to load per page (default: 20)
 */
const ChatMessages = ({ 
  roomCode, 
  loadMessagesFn, 
  renderMessage,
  onScroll,
  className = '',
  messagesPerPage = 20,
  emptyMessage = '메시지가 없습니다.',
  loadingMessage = '메시지를 불러오는 중...'
}) => {
  const {
    messages,
    loadingMore,
    hasMoreMessages,
    isLoadingMessages,
    messagesEndRef,
    messagesContainerRef,
    loadMessages,
    handleScroll,
    addMessage,
    resetPagination
  } = useChatPagination(loadMessagesFn, messagesPerPage);

  // Load messages when room changes
  React.useEffect(() => {
    if (roomCode) {
      resetPagination();
      loadMessages(roomCode, 0, true);
    }
  }, [roomCode, loadMessages, resetPagination]);

  // Combined scroll handler
  const combinedScrollHandler = React.useCallback((e) => {
    handleScroll(e, roomCode);
    if (onScroll) {
      onScroll(e);
    }
  }, [handleScroll, roomCode, onScroll]);

  // Expose addMessage for real-time updates
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    addMessage,
    scrollToBottom: () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }), [addMessage]);

  return (
    <div 
      className={className}
      ref={messagesContainerRef}
      onScroll={combinedScrollHandler}
      style={{
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Loading indicator for older messages */}
      {loadingMore && (
        <div style={{ 
          textAlign: 'center', 
          padding: '10px', 
          color: '#666',
          fontSize: '14px'
        }}>
          이전 메시지를 불러오는 중...
        </div>
      )}
      
      {/* Start of conversation indicator */}
      {!hasMoreMessages && messages.length > messagesPerPage && (
        <div style={{ 
          textAlign: 'center', 
          padding: '10px', 
          color: '#999', 
          fontSize: '12px',
          borderBottom: '1px solid #eee',
          margin: '0 20px'
        }}>
          대화의 시작입니다
        </div>
      )}
      
      {/* Messages or empty state */}
      {messages.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px', 
          color: '#666',
          fontSize: '16px'
        }}>
          {isLoadingMessages ? loadingMessage : emptyMessage}
        </div>
      ) : (
        messages.map((msg, idx) => renderMessage(msg, idx))
      )}
      
      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

// Forward ref version for imperative API access
const ChatMessagesWithRef = React.forwardRef((props, ref) => {
  const chatMessagesRef = React.useRef();
  
  React.useImperativeHandle(ref, () => ({
    addMessage: chatMessagesRef.current?.addMessage,
    scrollToBottom: chatMessagesRef.current?.scrollToBottom
  }));
  
  return <ChatMessages {...props} ref={chatMessagesRef} />;
});

export default ChatMessages;
export { ChatMessagesWithRef };
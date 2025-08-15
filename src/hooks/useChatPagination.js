import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Reusable chat pagination hook for all chat interfaces
 * Handles loading messages with pagination, scroll detection, and performance optimization
 * 
 * Used by:
 * - Platform Chat (User ↔ AI/Human Platform Operator)
 * - Expo Chat (User ↔ Expo Operator)
 * - Platform Inquiry (Platform Admin monitoring AI chats)
 * - Expo Operator Chat (Expo Admin ↔ User)
 */
export const useChatPagination = (loadMessagesFn, messagesPerPage = 20) => {
  const [messages, setMessages] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  // Store all messages in a ref to avoid reloading
  const allMessagesRef = useRef([]);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Use refs to avoid stale closures
  const currentPageRef = useRef(currentPage);
  const messagesRef = useRef(messages);
  
  // Keep refs updated
  useEffect(() => {
    currentPageRef.current = currentPage;
    messagesRef.current = messages;
  }, [currentPage, messages]);
  
  // Load messages with pagination
  const loadMessages = useCallback(async (roomCode, page = 0, reset = true) => {
    if (!roomCode || !loadMessagesFn) return;
    
    try {
      setIsLoadingMessages(true);
      
      // Only fetch from API on initial load or reset
      if (reset || allMessagesRef.current.length === 0) {
        // Call the provided message loading function
        const response = await loadMessagesFn(roomCode);
        const allMessages = response.data?.content || response.data || [];
        
        // Sort messages by time (oldest first)
        allMessagesRef.current = allMessages.sort((a, b) => 
          new Date(a.sentAt) - new Date(b.sentAt)
        );
      }
      
      const totalMessages = allMessagesRef.current.length;
      const totalPages = Math.ceil(totalMessages / messagesPerPage);
      
      if (reset) {
        // Initial load: get the most recent messages
        const startIndex = Math.max(0, totalMessages - messagesPerPage);
        const recentMessages = allMessagesRef.current.slice(startIndex);
        
        setMessages(recentMessages);
        setCurrentPage(totalPages - 1);
        setHasMoreMessages(startIndex > 0); // Has more if there are older messages
      } else {
        // Load more (older messages)
        const currentMessageCount = messagesRef.current.length;
        const remainingOlderMessages = totalMessages - currentMessageCount;
        
        if (remainingOlderMessages > 0) {
          // Calculate how many older messages to load
          const endIndex = Math.max(0, remainingOlderMessages - messagesPerPage);
          const startIndex = remainingOlderMessages;
          
          // Get the older messages
          const olderMessages = allMessagesRef.current.slice(
            Math.max(0, totalMessages - currentMessageCount - messagesPerPage),
            totalMessages - currentMessageCount
          );
          
          if (olderMessages.length > 0) {
            setMessages(prev => [...olderMessages, ...prev]);
            setCurrentPage(prev => prev - 1);
            setHasMoreMessages(totalMessages - currentMessageCount - olderMessages.length > 0);
          } else {
            setHasMoreMessages(false);
          }
        } else {
          setHasMoreMessages(false);
        }
      }
      
    } catch (err) {
      console.error('메시지 로드 실패:', err);
      throw err;
    } finally {
      setIsLoadingMessages(false);
    }
  }, [messagesPerPage, loadMessagesFn]);

  // Load more older messages
  const loadMoreMessages = useCallback(async (roomCode) => {
    if (!roomCode || loadingMore || !hasMoreMessages) return;
    
    setLoadingMore(true);
    try {
      await loadMessages(roomCode, currentPage - 1, false);
    } catch (err) {
      console.error('더 많은 메시지 로드 실패:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMoreMessages, loadMessages]);

  // Handle scroll to load more messages
  const handleScroll = useCallback((e, roomCode) => {
    const container = e.target;
    const scrollTop = container.scrollTop;
    const threshold = 50; // Pixels from top to trigger load
    
    if (scrollTop <= threshold && hasMoreMessages && !loadingMore && !isLoadingMessages) {
      // Store current scroll height to maintain position after loading
      const oldScrollHeight = container.scrollHeight;
      
      loadMoreMessages(roomCode).then(() => {
        // Maintain scroll position after loading older messages
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - oldScrollHeight;
        }, 50);
      });
    }
  }, [hasMoreMessages, loadingMore, isLoadingMessages, loadMoreMessages]);

  // Auto scroll when new messages arrive (but not when loading older messages)
  useEffect(() => {
    if (!loadingMore && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
      
      // Always scroll to bottom for initial load or when user is at bottom
      if (isAtBottom || messages.length <= messagesPerPage) {
        setTimeout(() => scrollToBottom(), 100);
      }
    }
  }, [messages, loadingMore, messagesPerPage, scrollToBottom]);

  // Add new message (for real-time WebSocket messages)
  const addMessage = useCallback((newMessage) => {
    setMessages(prev => [...prev, newMessage]);
  }, []);

  // Reset pagination state (when switching rooms)
  const resetPagination = useCallback(() => {
    setMessages([]);
    setCurrentPage(0);
    setHasMoreMessages(true);
    setLoadingMore(false);
    setIsLoadingMessages(false);
    allMessagesRef.current = []; // Clear cached messages
  }, []);

  return {
    // State
    messages,
    loadingMore,
    hasMoreMessages,
    isLoadingMessages,
    
    // Refs for components
    messagesEndRef,
    messagesContainerRef,
    
    // Functions
    loadMessages,
    loadMoreMessages,
    handleScroll,
    scrollToBottom,
    addMessage,
    resetPagination,
    
    // Pagination config
    messagesPerPage
  };
};
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Advanced chat pagination hook with smooth reverse infinite scroll
 * Optimized for chat interfaces where users scroll up to load older messages
 * 
 * Features:
 * - Loads 10 messages at a time for better performance
 * - Smooth scroll position maintenance
 * - Debounced scroll detection
 * - Optimistic loading states
 */
export const useChatPaginationV2 = (loadMessagesFn, messagesPerPage = 10) => {
  // State management
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Refs for scroll management
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollPositionBeforeLoad = useRef(null);
  const isLoadingRef = useRef(false);
  const allMessagesCache = useRef([]);
  const currentIndexRef = useRef(0);
  
  // Debounce timer
  const scrollDebounceTimer = useRef(null);

  /**
   * Scroll to bottom smoothly
   */
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior, 
        block: 'end' 
      });
    }
  }, []);

  /**
   * Load initial messages (most recent)
   */
  const loadInitialMessages = useCallback(async (roomCode) => {
    if (!roomCode || !loadMessagesFn) return;
    
    try {
      setLoading(true);
      setError(null);
      setIsInitialLoad(true);
      
      // Fetch all messages once and cache them (using increased page size for full history)
      const response = await loadMessagesFn(roomCode, 0, 1000);
      const allMessages = response.data?.content || response.data || [];
      
      // Sort messages chronologically (oldest first)
      const sortedMessages = allMessages.sort((a, b) => 
        new Date(a.sentAt) - new Date(b.sentAt)
      );
      
      // Cache all messages
      allMessagesCache.current = sortedMessages;
      
      // Load only the most recent messages
      const totalMessages = sortedMessages.length;
      const startIndex = Math.max(0, totalMessages - messagesPerPage);
      const initialMessages = sortedMessages.slice(startIndex);
      
      // Update state
      setMessages(initialMessages);
      currentIndexRef.current = startIndex;
      setHasMore(startIndex > 0);
      
      // Scroll to bottom after initial load
      setTimeout(() => {
        scrollToBottom('auto');
      }, 100);
      
    } catch (err) {
      console.error('Failed to load initial messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [loadMessagesFn, messagesPerPage, scrollToBottom]);

  /**
   * Load more older messages when scrolling up
   */
  const loadMoreMessages = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingRef.current || !hasMore || currentIndexRef.current <= 0) {
      return;
    }
    
    isLoadingRef.current = true;
    setLoading(true);
    
    try {
      const container = messagesContainerRef.current;
      if (container) {
        // Save current scroll position
        scrollPositionBeforeLoad.current = {
          scrollHeight: container.scrollHeight,
          scrollTop: container.scrollTop
        };
      }
      
      // Calculate next batch
      const endIndex = currentIndexRef.current;
      const startIndex = Math.max(0, endIndex - messagesPerPage);
      const olderMessages = allMessagesCache.current.slice(startIndex, endIndex);
      
      // Update state with older messages prepended
      setMessages(prev => [...olderMessages, ...prev]);
      currentIndexRef.current = startIndex;
      setHasMore(startIndex > 0);
      
      // Maintain scroll position after DOM update (double RAF for better timing)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (container && scrollPositionBeforeLoad.current) {
            const newScrollHeight = container.scrollHeight;
            const scrollDiff = newScrollHeight - scrollPositionBeforeLoad.current.scrollHeight;
            const newScrollTop = scrollPositionBeforeLoad.current.scrollTop + scrollDiff;
            
            // Smooth scroll to new position
            container.scrollTo({
              top: newScrollTop,
              behavior: 'auto' // Instant, not smooth to avoid jarring
            });
          }
        });
      });
      
    } catch (err) {
      console.error('Failed to load more messages:', err);
      setError(err.message || 'Failed to load more messages');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [hasMore, messagesPerPage]);

  /**
   * Handle scroll events with debouncing
   */
  const handleScroll = useCallback((e) => {
    const container = e.target;
    
    // Clear previous debounce timer
    if (scrollDebounceTimer.current) {
      clearTimeout(scrollDebounceTimer.current);
    }
    
    // Debounce scroll handling
    scrollDebounceTimer.current = setTimeout(() => {
      const scrollTop = container.scrollTop;
      const threshold = 100; // Load more when within 100px from top
      
      // Check if we should load more (scrolled near top)
      if (scrollTop <= threshold && hasMore && !isLoadingRef.current) {
        loadMoreMessages();
      }
    }, 150); // 150ms debounce delay
  }, [hasMore, loadMoreMessages]);

  /**
   * Add a new message (for real-time updates)
   */
  const addMessage = useCallback((newMessage) => {
    setMessages(prev => {
      // Check if message already exists (by id)
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) return prev;
      
      // Add to the end and update cache
      const updated = [...prev, newMessage];
      
      // Also add to cache if it's a new message
      if (allMessagesCache.current.length > 0) {
        allMessagesCache.current = [...allMessagesCache.current, newMessage];
      }
      
      return updated;
    });
    
    // Auto scroll to bottom for new messages
    setTimeout(() => {
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        if (isNearBottom) {
          scrollToBottom();
        }
      }
    }, 50);
  }, [scrollToBottom]);

  /**
   * Update an existing message (for read status updates)
   */
  const updateMessage = useCallback((messageId, updates) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  }, []);

  /**
   * Reset all state (when switching rooms)
   */
  const reset = useCallback(() => {
    setMessages([]);
    setLoading(false);
    setHasMore(true);
    setError(null);
    setIsInitialLoad(true);
    allMessagesCache.current = [];
    currentIndexRef.current = 0;
    isLoadingRef.current = false;
    
    if (scrollDebounceTimer.current) {
      clearTimeout(scrollDebounceTimer.current);
    }
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (scrollDebounceTimer.current) {
        clearTimeout(scrollDebounceTimer.current);
      }
    };
  }, []);

  return {
    // State
    messages,
    loading,
    hasMore,
    error,
    isInitialLoad,
    
    // Refs
    messagesContainerRef,
    messagesEndRef,
    
    // Methods
    loadInitialMessages,
    loadMoreMessages,
    handleScroll,
    scrollToBottom,
    addMessage,
    updateMessage,
    reset,
    
    // Config
    messagesPerPage
  };
};
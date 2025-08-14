import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Optimized chat pagination hook for super fast initial load
 * 
 * Strategy:
 * 1. Load 10 most recent messages immediately (fast display)
 * 2. Load remaining messages in background for pagination
 * 3. Smooth scroll when loading older messages
 * 4. Smart auto-scroll (only when user is at bottom)
 */
export function useChatPaginationV3(loadMessagesFn, messagesPerPage = 10) {
  // States
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  // Refs for stable references
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const allMessagesCache = useRef([]);
  const currentIndexRef = useRef(0);
  const isLoadingRef = useRef(false);
  const scrollPositionBeforeLoad = useRef(null);
  const scrollDebounceTimer = useRef(null);
  const backgroundLoadingRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollDebounceTimer.current) {
        clearTimeout(scrollDebounceTimer.current);
      }
    };
  }, []);

  /**
   * Scroll to bottom of chat
   */
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, []);

  /**
   * Fast initial load - only 10 most recent messages
   */
  const loadInitialMessages = useCallback(async (roomCode) => {
    if (!roomCode || !loadMessagesFn) return;
    
    try {
      setLoading(true);
      setError(null);
      setIsInitialLoad(true);
      
      console.log(`Fast loading initial 10 messages for room: ${roomCode}`);
      
      // Load only 10 most recent messages for immediate display
      const response = await loadMessagesFn(roomCode, 0, 10);
      const recentMessages = response.data?.content || response.data || [];
      
      console.log(`Received ${recentMessages.length} initial messages`);
      
      if (recentMessages.length > 0) {
        // Sort messages chronologically (oldest first)
        const sortedMessages = recentMessages.sort((a, b) => 
          new Date(a.sentAt) - new Date(b.sentAt)
        );
        
        setMessages(sortedMessages);
        allMessagesCache.current = sortedMessages;
        currentIndexRef.current = 0;
        setHasMore(recentMessages.length === 10); // Assume more if we got exactly 10
        
        // Scroll to bottom after initial load
        setTimeout(() => scrollToBottom('auto'), 100);
      }
      
      // Background loading of all messages for pagination
      if (!backgroundLoadingRef.current) {
        backgroundLoadingRef.current = true;
        setTimeout(() => loadAllMessagesInBackground(roomCode), 500);
      }
      
    } catch (err) {
      console.error('Failed to load initial messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [loadMessagesFn, scrollToBottom]);

  /**
   * Background loading of all messages for pagination
   */
  const loadAllMessagesInBackground = useCallback(async (roomCode) => {
    try {
      console.log(`Background loading all messages for room: ${roomCode}`);
      
      // Load all messages with larger page size
      const response = await loadMessagesFn(roomCode, 0, 500);
      const allMessages = response.data?.content || response.data || [];
      
      if (allMessages.length > allMessagesCache.current.length) {
        console.log(`Background loaded ${allMessages.length} total messages`);
        
        // Sort messages chronologically (oldest first)
        const sortedMessages = allMessages.sort((a, b) => 
          new Date(a.sentAt) - new Date(b.sentAt)
        );
        
        // Update cache with all messages
        allMessagesCache.current = sortedMessages;
        
        // Update hasMore based on total vs displayed
        const totalMessages = sortedMessages.length;
        const displayedMessages = messages.length;
        setHasMore(totalMessages > displayedMessages);
        
        console.log(`Background load complete: ${totalMessages} total, ${displayedMessages} displayed, hasMore: ${totalMessages > displayedMessages}`);
      }
      
    } catch (err) {
      console.warn('Background message loading failed:', err);
    } finally {
      backgroundLoadingRef.current = false;
    }
  }, [loadMessagesFn, messages.length]);

  /**
   * Load more older messages when scrolling up
   */
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) {
      return;
    }
    
    isLoadingRef.current = true;
    setLoading(true);
    
    try {
      const container = messagesContainerRef.current;
      if (container) {
        // Save current scroll position for smooth restoration
        scrollPositionBeforeLoad.current = {
          scrollHeight: container.scrollHeight,
          scrollTop: container.scrollTop
        };
      }
      
      // Calculate how many older messages to load
      const currentDisplayed = messages.length;
      const totalAvailable = allMessagesCache.current.length;
      const startIndex = Math.max(0, totalAvailable - currentDisplayed - messagesPerPage);
      const endIndex = totalAvailable - currentDisplayed;
      
      if (startIndex < endIndex) {
        const olderMessages = allMessagesCache.current.slice(startIndex, endIndex);
        
        // Prepend older messages
        setMessages(prev => [...olderMessages, ...prev]);
        setHasMore(startIndex > 0);
        
        console.log(`Loaded ${olderMessages.length} older messages, ${startIndex} remaining`);
        
        // Industry standard: Invisible buffer strategy (WhatsApp/Instagram style)
        // User's scroll position should NEVER jump - new content loads invisibly above
        requestAnimationFrame(() => {
          if (container && scrollPositionBeforeLoad.current) {
            const newScrollHeight = container.scrollHeight;
            const heightDiff = newScrollHeight - scrollPositionBeforeLoad.current.scrollHeight;
            const oldScrollTop = scrollPositionBeforeLoad.current.scrollTop;
            
            // CRITICAL: True WhatsApp/Kakao behavior
            // If user is at absolute top (0), stay at absolute top (0)
            // Otherwise, compensate for new content height
            const newScrollTop = oldScrollTop === 0 ? 0 : oldScrollTop + heightDiff;
            
            console.log('📜 Invisible buffer scroll restoration:', {
              oldScrollHeight: scrollPositionBeforeLoad.current.scrollHeight,
              newScrollHeight,
              heightDiff,
              oldScrollTop,
              newScrollTop,
              messagesAdded: olderMessages.length,
              strategy: oldScrollTop === 0 ? 'stay-at-top' : 'invisible-buffer'
            });
            
            // Instantly compensate for height change - user feels no movement
            container.scrollTop = newScrollTop;
            
            console.log('✅ Scroll position maintained seamlessly');
          }
        });
      } else {
        setHasMore(false);
      }
      
    } catch (err) {
      console.error('Failed to load more messages:', err);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [hasMore, messages.length, messagesPerPage]);

  /**
   * Handle scroll events with smart debouncing
   */
  const handleScroll = useCallback((e) => {
    const container = e.target;
    
    if (scrollDebounceTimer.current) {
      clearTimeout(scrollDebounceTimer.current);
    }
    
    scrollDebounceTimer.current = setTimeout(() => {
      const scrollTop = container.scrollTop;
      const threshold = 100;
      
      // Load more when near top
      if (scrollTop <= threshold && hasMore && !isLoadingRef.current) {
        console.log('🔼 Loading more messages - scrollTop:', scrollTop, 'threshold:', threshold);
        loadMoreMessages();
      }
    }, 150);
  }, [hasMore, loadMoreMessages]);

  /**
   * Add new message (real-time)
   */
  const addMessage = useCallback((newMessage) => {
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) return prev;
      
      const updated = [...prev, newMessage];
      
      // Also add to cache
      if (allMessagesCache.current.length > 0) {
        allMessagesCache.current = [...allMessagesCache.current, newMessage];
      }
      
      return updated;
    });
  }, []);

  /**
   * Update existing message or messages with callback
   */
  const updateMessage = useCallback((messageIdOrUpdater, updates) => {
    if (typeof messageIdOrUpdater === 'function') {
      // Callback-based update
      setMessages(messageIdOrUpdater);
    } else {
      // ID-based update
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageIdOrUpdater ? { ...msg, ...updates } : msg
        )
      );
      
      // Also update cache
      allMessagesCache.current = allMessagesCache.current.map(msg =>
        msg.id === messageIdOrUpdater ? { ...msg, ...updates } : msg
      );
    }
  }, []);

  /**
   * Reset pagination state
   */
  const reset = useCallback(() => {
    setMessages([]);
    setLoading(false);
    setIsInitialLoad(false);
    setHasMore(false);
    setError(null);
    allMessagesCache.current = [];
    currentIndexRef.current = 0;
    backgroundLoadingRef.current = false;
    
    if (scrollDebounceTimer.current) {
      clearTimeout(scrollDebounceTimer.current);
    }
  }, []);

  return {
    messages,
    loading,
    isInitialLoad,
    hasMore,
    error,
    messagesContainerRef,
    messagesEndRef,
    loadInitialMessages,
    handleScroll,
    scrollToBottom,
    addMessage,
    updateMessage,
    setMessages, // Export for direct message state updates
    reset
  };
}
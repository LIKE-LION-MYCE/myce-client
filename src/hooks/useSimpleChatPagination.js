import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Simple, professional chat pagination like WhatsApp/Kakao
 * 
 * Key principles:
 * 1. Load all messages at once (or large chunks)
 * 2. No visible loading states
 * 3. Anchor-based scroll restoration
 * 4. Minimal complexity
 */
export function useSimpleChatPagination(loadMessagesFn) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const firstMessageRef = useRef(null);
  const currentRoomCode = useRef(null);
  
  /**
   * Load initial messages for a room (professional approach: 50 messages)
   */
  const loadMessages = useCallback(async (roomCode) => {
    if (!roomCode || !loadMessagesFn) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Professional approach: Load only 50 most recent messages initially
      const response = await loadMessagesFn(roomCode, 0, 50);
      const recentMessages = response.data?.content || response.data || [];
      
      if (recentMessages.length > 0) {
        // Sort chronologically (oldest first)
        const sortedMessages = recentMessages.sort((a, b) => 
          new Date(a.sentAt) - new Date(b.sentAt)
        );
        
        setMessages(sortedMessages);
        // Assume there are more messages if we got exactly 50
        setHasMore(recentMessages.length === 50);
        currentRoomCode.current = roomCode;
        
        // Scroll to bottom after loading
        setTimeout(() => scrollToBottom('auto'), 50);
      } else {
        setMessages([]);
        setHasMore(false);
      }
      
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError(err.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [loadMessagesFn]);

  /**
   * Load older messages (professional approach: 20 more messages)
   */
  const loadMoreMessages = useCallback(async () => {
    if (!currentRoomCode.current || !loadMessagesFn || !hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      
      // Calculate offset: skip messages we already have
      const currentCount = messages.length;
      const response = await loadMessagesFn(currentRoomCode.current, Math.floor(currentCount / 20), 20);
      const olderMessages = response.data?.content || response.data || [];
      
      if (olderMessages.length > 0) {
        // Sort chronologically (oldest first)
        const sortedOlderMessages = olderMessages.sort((a, b) => 
          new Date(a.sentAt) - new Date(b.sentAt)
        );
        
        // Filter out messages we already have
        const newMessages = sortedOlderMessages.filter(msg => 
          !messages.some(existingMsg => existingMsg.id === msg.id)
        );
        
        if (newMessages.length > 0) {
          // Save scroll position before adding messages
          const container = messagesContainerRef.current;
          const oldScrollHeight = container?.scrollHeight || 0;
          const oldScrollTop = container?.scrollTop || 0;
          
          // Add older messages to the beginning
          setMessages(prev => [...newMessages, ...prev]);
          
          // Restore scroll position (WhatsApp-style)
          setTimeout(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              const heightDiff = newScrollHeight - oldScrollHeight;
              container.scrollTop = oldScrollTop + heightDiff;
            }
          }, 0);
        }
        
        // Update hasMore
        setHasMore(olderMessages.length === 20);
      } else {
        setHasMore(false);
      }
      
    } catch (err) {
      console.error('Failed to load more messages:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [messages, hasMore, loadingMore, loadMessagesFn]);

  /**
   * Handle scroll events for pagination
   */
  const handleScroll = useCallback((e) => {
    const container = e.target;
    const scrollTop = container.scrollTop;
    
    // Load more when near top (50px threshold)
    if (scrollTop <= 50 && hasMore && !loadingMore) {
      loadMoreMessages();
    }
  }, [hasMore, loadingMore, loadMoreMessages]);
  
  /**
   * Scroll to bottom of chat
   */
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, []);
  
  /**
   * Add new message (real-time)
   */
  const addMessage = useCallback((newMessage) => {
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) return prev;
      
      return [...prev, newMessage];
    });
  }, []);
  
  /**
   * Update existing message
   */
  const updateMessage = useCallback((messageId, updates) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  }, []);
  
  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setMessages([]);
    setLoading(false);
    setHasMore(false);
    setError(null);
  }, []);
  
  return {
    messages,
    loading,
    hasMore,
    error,
    loadingMore,
    messagesContainerRef,
    messagesEndRef,
    firstMessageRef,
    loadMessages,
    loadMoreMessages,
    handleScroll,
    scrollToBottom,
    addMessage,
    updateMessage,
    reset
  };
}
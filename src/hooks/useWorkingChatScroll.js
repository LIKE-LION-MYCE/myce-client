import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';

/**
 * REAL working chat scroll implementation based on Stack Overflow and StackBlitz examples
 * 
 * Based on: https://stackoverflow.com/questions/65277683/react-js-chat-when-scrolling-up-load-old-messages
 * And: https://stackblitz.com/edit/react-fnqbh9
 */
export function useWorkingChatScroll(loadMessagesFn) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentRoomCode = useRef(null);
  const currentPage = useRef(0);
  const isFirstLoad = useRef(true);
  
  // For proper scroll position restoration (Facebook Messenger pattern)
  const previousScrollHeight = useRef(0);
  const previousScrollTop = useRef(0);
  const isLoadingOlderMessages = useRef(false);
  
  // Preloading for smoother experience
  const preloadedMessages = useRef(null);
  const isPreloading = useRef(false);
  
  /**
   * Load initial messages (fast, instant appearance)
   */
  const loadInitialMessages = useCallback(async (roomCode) => {
    if (!roomCode || !loadMessagesFn) return;
    
    try {
      setLoading(true);
      setError(null);
      currentRoomCode.current = roomCode;
      currentPage.current = 0;
      isFirstLoad.current = true; // Mark as first load
      
      console.log('🚀 Loading initial 8 messages for instant appearance:', roomCode);
      
      // Fewer messages so viewport starts at bottom
      const response = await loadMessagesFn(roomCode, 0, 8);
      const initialMessages = response.data?.content || response.data || [];
      
      if (initialMessages.length > 0) {
        // Sort chronologically (oldest first)
        const sortedMessages = initialMessages.sort((a, b) => 
          new Date(a.sentAt) - new Date(b.sentAt)
        );
        
        setMessages(sortedMessages);
        setHasMore(initialMessages.length === 8); // Has more if exactly 8
        
        // IMPORTANT: Scroll to bottom after DOM updates - multiple attempts for reliability
        setTimeout(() => {
          scrollToBottom('instant');
        }, 0);
        
        // Backup scroll - ensure it happens after CSS layout
        setTimeout(() => {
          scrollToBottom('instant');
        }, 100);
        
        // Final fallback - for slow loading scenarios
        setTimeout(() => {
          scrollToBottom('instant');
        }, 500);
      } else {
        setMessages([]);
        setHasMore(false);
        isFirstLoad.current = false;
      }
      
    } catch (err) {
      console.error('Failed to load initial messages:', err);
      setError(err.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [loadMessagesFn]);
  

  /**
   * Load older messages (use preloaded if available for instant loading)
   */
  const loadOlderMessages = useCallback(async () => {
    if (!currentRoomCode.current || !loadMessagesFn || !hasMore || loadingOlder) return;
    
    try {
      setLoadingOlder(true);
      isLoadingOlderMessages.current = true;
      
      // 🎯 CRITICAL: Capture scroll position BEFORE loading messages
      const container = containerRef.current;
      if (container) {
        previousScrollHeight.current = container.scrollHeight;
        previousScrollTop.current = container.scrollTop;
        console.log('📸 Captured scroll state:', {
          scrollHeight: previousScrollHeight.current,
          scrollTop: previousScrollTop.current
        });
      }
      
      // Use preloaded messages if available (instant!)
      if (preloadedMessages.current && preloadedMessages.current.length > 0) {
        console.log('⚡ Using preloaded messages - instant!');
        const preloaded = [...preloadedMessages.current]; // Make a copy
        setMessages(prev => [...preloaded, ...prev]);
        setHasMore(preloaded.length === 5);
        currentPage.current += 1;
        preloadedMessages.current = null;
        
        // Preload next batch will be triggered by scroll handler
      } else {
        // Fall back to loading from API
        currentPage.current += 1;
        console.log('📜 Loading page', currentPage.current, 'from API...');
        
        const response = await loadMessagesFn(currentRoomCode.current, currentPage.current, 5);
        const olderMessages = response.data?.content || response.data || [];
        
        if (olderMessages.length > 0) {
          const sortedOlderMessages = olderMessages.sort((a, b) => 
            new Date(a.sentAt) - new Date(b.sentAt)
          );
          setMessages(prev => [...sortedOlderMessages, ...prev]);
          setHasMore(olderMessages.length === 5);
        } else {
          setHasMore(false);
        }
      }
      
    } catch (err) {
      console.error('Failed to load older messages:', err);
    } finally {
      setLoadingOlder(false);
      // Note: isLoadingOlderMessages.current is reset in useLayoutEffect
    }
  }, [hasMore, loadingOlder, loadMessagesFn]);
  
  /**
   * Handle scroll events (Stack Overflow approach)
   */
  // Track scroll direction for smoother loading
  const lastScrollTop = useRef(0);
  
  const handleScroll = useCallback((e) => {
    const container = e.target;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;
    
    // Detect scroll direction
    const isScrollingUp = scrollTop < lastScrollTop.current;
    lastScrollTop.current = scrollTop;
    
    // Only load when scrolling UP (not down) for smoother experience
    if (!isScrollingUp) return;
    
    const scrollPercentage = scrollTop / (scrollHeight - containerHeight);
    
    // Start preloading at 40% (early, in background)
    if (scrollPercentage <= 0.4 && scrollPercentage > 0.2 && hasMore && !preloadedMessages.current && !isPreloading.current) {
      console.log('🔮 At', Math.round(scrollPercentage * 100), '% - preloading next batch...');
      // Call preloadNextBatch without adding it to dependencies to avoid circular reference
      const preload = async () => {
        if (!currentRoomCode.current || !loadMessagesFn || !hasMore || isPreloading.current || preloadedMessages.current) return;
        
        try {
          isPreloading.current = true;
          const nextPage = currentPage.current + 1;
          const response = await loadMessagesFn(currentRoomCode.current, nextPage, 5);
          const messages = response.data?.content || response.data || [];
          
          if (messages.length > 0) {
            preloadedMessages.current = messages.sort((a, b) => 
              new Date(a.sentAt) - new Date(b.sentAt)
            );
            console.log('✨ Preloaded', messages.length, 'messages ready');
          }
        } catch (err) {
          console.error('Preload failed:', err);
        } finally {
          isPreloading.current = false;
        }
      };
      preload();
    }
    
    // Actually load at 20% (messages should be preloaded by now)
    if (scrollPercentage <= 0.2 && hasMore && !loadingOlder) {
      console.log('📜 At', Math.round(scrollPercentage * 100), '% - loading messages...');
      loadOlderMessages();
    }
  }, [hasMore, loadingOlder, loadOlderMessages]);
  
  /**
   * Scroll to bottom with debug logging
   */
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    console.log('🔽 scrollToBottom called with behavior:', behavior);
    
    if (messagesEndRef.current) {
      console.log('📍 Using messagesEndRef.scrollIntoView');
      messagesEndRef.current.scrollIntoView({ behavior });
    } else if (containerRef.current) {
      const container = containerRef.current;
      console.log('📍 Using container scroll - Heights:', {
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight,
        scrollTop: container.scrollTop
      });
      
      // Fallback: scroll container to bottom if messagesEndRef not available
      container.scrollTop = container.scrollHeight;
      
      console.log('📍 After scroll - scrollTop:', container.scrollTop);
    } else {
      console.log('❌ No scroll target available');
    }
  }, []);
  
  /**
   * Check if user is near bottom of chat (within 100px)
   */
  const isNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      console.log('📍 isNearBottom: No container, defaulting to true');
      return true; // Default to true if container not ready
    }
    
    const threshold = 100; // pixels from bottom
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const isNear = distanceFromBottom <= threshold;
    
    console.log('📍 isNearBottom check:', {
      scrollTop,
      clientHeight, 
      scrollHeight,
      distanceFromBottom,
      threshold,
      isNear
    });
    
    return isNear;
  }, []);

  /**
   * Add new real-time message with smart scroll behavior
   */
  const addMessage = useCallback((newMessage) => {
    // Check if user is near bottom BEFORE adding message
    const shouldAutoScroll = isNearBottom();
    
    console.log('💬 addMessage called:', {
      messageId: newMessage.id,
      content: newMessage.content?.substring(0, 30),
      shouldAutoScroll,
      isNearBottomResult: shouldAutoScroll
    });
    
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) {
        console.log('⚠️ Message already exists, skipping:', newMessage.id);
        return prev;
      }
      console.log('✅ Adding new message to list');
      return [...prev, newMessage];
    });
    
    // Auto-scroll to bottom if user was near bottom
    if (shouldAutoScroll) {
      console.log('🔽 Auto-scrolling because user was near bottom');
      // Use multiple timeouts to ensure DOM and layout are ready
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 0);
      
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 100);
    } else {
      console.log('🚫 Not auto-scrolling - user is reading old messages');
    }
    // If user is scrolled up, don't auto-scroll (they might be reading old messages)
    // The scroll-to-bottom button will appear instead for manual scrolling
  }, [isNearBottom, scrollToBottom]);
  
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
   * 🎯 CRITICAL: Restore scroll position after messages are prepended
   * This MUST run synchronously to prevent any other code from scrolling
   */
  useLayoutEffect(() => {
    if (!isLoadingOlderMessages.current) return;
    
    const container = containerRef.current;
    if (container && previousScrollHeight.current > 0) {
      // Calculate how much the content height increased
      const heightDiff = container.scrollHeight - previousScrollHeight.current;
      
      // Restore scroll position: add the height difference to previous scroll position
      const newScrollTop = previousScrollTop.current + heightDiff;
      
      // IMMEDIATELY set scroll position - no delays, no RAF
      container.scrollTop = newScrollTop;
      
      console.log('📍 Scroll restored to:', newScrollTop, 'from:', previousScrollTop.current);
      
      // Reset tracking variables
      isLoadingOlderMessages.current = false;
      previousScrollHeight.current = 0;
      previousScrollTop.current = 0;
    }
  }, [messages]); // Trigger on messages change, not just length
  
  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setMessages([]);
    setLoading(false);
    setLoadingOlder(false);
    setHasMore(true);
    setError(null);
    currentRoomCode.current = null;
    currentPage.current = 0;
    
    // Reset scroll position tracking
    previousScrollHeight.current = 0;
    previousScrollTop.current = 0;
    isLoadingOlderMessages.current = false;
    isFirstLoad.current = true;
    
    // Reset preloading
    preloadedMessages.current = null;
    isPreloading.current = false;
  }, []);
  
  return {
    messages,
    loading,
    loadingOlder,
    hasMore,
    error,
    containerRef,
    messagesEndRef,
    loadInitialMessages,
    handleScroll,
    scrollToBottom,
    addMessage,
    updateMessage,
    reset,
    isNearBottom
  };
}
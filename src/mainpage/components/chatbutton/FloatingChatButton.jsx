import React, { useState, useEffect } from 'react';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { getAllUnreadCounts } from '../../../api/service/chat/chatService';
import ChatModal from '../../../components/shared/chat/ChatModal';
import LoginPromptModal from '../../../components/shared/chat/LoginPromptModal';

import styles from './FloatingChatButton.module.css';

export default function FloatingChatButton({ autoOpen = false }) {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle auto-open from navigation
  useEffect(() => {
    if (autoOpen) {
      setIsChatOpen(true);
    }
  }, [autoOpen]);

  // Check authentication and load data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const token = localStorage.getItem('access_token');
      const authenticated = !!token;
      setIsAuthenticated(authenticated);
      
      if (!authenticated) return;

      try {
        const response = await getAllUnreadCounts();
        const total = response.data.totalUnreadCount || 0;
        setTotalUnreadCount(total);
      } catch (error) {
        console.error('전체 읽지 않은 메시지 개수 조회 실패:', error);
        // If token is invalid, user might need to re-login
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('access_token');
        }
      }
    };

    checkAuthAndLoadData();

    // 주기적으로 업데이트 (30초마다) - authenticated users only
    let interval;
    if (isAuthenticated) {
      interval = setInterval(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
          checkAuthAndLoadData();
        } else {
          setIsAuthenticated(false);
          setTotalUnreadCount(0);
        }
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated]);

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    
    // Refresh authentication state and unread count when closed
    // This handles cases where user logged in from the LoginPromptModal
    const refreshState = async () => {
      const token = localStorage.getItem('access_token');
      const authenticated = !!token;
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        try {
          const response = await getAllUnreadCounts();
          const total = response.data.totalUnreadCount || 0;
          setTotalUnreadCount(total);
        } catch (error) {
          console.error('읽지 않은 메시지 개수 새로고침 실패:', error);
          if (error.response?.status === 401) {
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
          }
        }
      } else {
        setTotalUnreadCount(0);
      }
    };
    
    refreshState();
  };

  return (
    <>
      <button 
        onClick={handleChatClick} 
        className={`${styles.fab} ${styles.loginHint}`}
        title={isAuthenticated ? "상담 채팅 열기" : "로그인 후 상담 서비스를 이용하세요"}
      >
        <span className={styles.icon}>
          <BsFillChatDotsFill size={22} />
        </span>
        {isAuthenticated && totalUnreadCount > 0 && (
          <span className={styles.badge}>{totalUnreadCount}</span>
        )}
      </button>
      
      {/* Show different modals based on authentication */}
      {isAuthenticated ? (
        <ChatModal 
          isOpen={isChatOpen} 
          onClose={handleChatClose}
        />
      ) : (
        <LoginPromptModal 
          isOpen={isChatOpen} 
          onClose={handleChatClose}
        />
      )}
    </>
  );
}
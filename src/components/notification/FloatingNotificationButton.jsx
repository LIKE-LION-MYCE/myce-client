import React, { useState, useEffect } from 'react';
import { IoNotifications } from 'react-icons/io5';
import styles from './FloatingNotificationButton.module.css';
import NotificationModal from '../../mainpage/components/notification/NotificationModal';
import { getNotifications } from '../../api/service/notification/notificationApi';
import { useNotification } from '../../context/NotificationContext';

export default function FloatingNotificationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { unreadCount, updateUnreadCount } = useNotification();

  // 인증 상태 및 읽지 않은 알림 개수 확인
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const token = localStorage.getItem('access_token');
      const authenticated = !!token;
      setIsAuthenticated(authenticated);
      
      if (!authenticated) return;

      try {
        const notifications = await getNotifications();
        const unreadNotifications = notifications.filter(n => !n.isRead);
        updateUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error('읽지 않은 알림 개수 조회 실패:', error);
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('access_token');
        }
      }
    };

    checkAuthAndLoadData();

    // 주기적으로 업데이트 (30초마다)
    let interval;
    if (isAuthenticated) {
      interval = setInterval(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
          checkAuthAndLoadData();
        } else {
          setIsAuthenticated(false);
          updateUnreadCount(0);
        }
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, updateUnreadCount]);

  const handleNotificationClick = () => {
    if (!isAuthenticated) {
      alert('로그인 후 알림을 확인할 수 있습니다.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    
    // 모달 닫힐 때 읽지 않은 개수 새로고침
    const refreshUnreadCount = async () => {
      try {
        const notifications = await getNotifications();
        const unreadNotifications = notifications.filter(n => !n.isRead);
        updateUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error('읽지 않은 알림 개수 새로고침 실패:', error);
      }
    };
    
    if (isAuthenticated) {
      refreshUnreadCount();
    }
  };

  return (
    <>
      <button 
        onClick={handleNotificationClick} 
        className={`${styles.fab} ${!isAuthenticated ? styles.loginHint : ''}`}
        title={isAuthenticated ? "알림 확인" : "로그인 후 알림을 확인하세요"}
      >
        <span className={styles.icon}>
          <IoNotifications size={28} />
        </span>
        {isAuthenticated && unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* 인증된 사용자만 모달 표시 */}
      {isAuthenticated && (
        <NotificationModal 
          isOpen={isModalOpen} 
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
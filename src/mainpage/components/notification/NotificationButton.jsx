import React, { useState, useEffect } from 'react';
import { IoNotifications } from 'react-icons/io5';
import styles from './NotificationButton.module.css';
import NotificationModal from './NotificationModal';
import { getNotifications } from '../../../api/service/notification/notificationApi';
import { useNotification } from '../../../context/NotificationContext';

export default function NotificationButton({notification}) {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, updateUnreadCount } = useNotification();

  useEffect(() => {
    fetchUnreadCount();
  }, [notification]);

  const fetchUnreadCount = async () => {
    try {
      const notifications = await getNotifications();
      const unreadNotifications = notifications.filter(n => !n.isRead);
      updateUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('읽지 않은 알림 개수 조회 실패:', error);
    }
  };

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const handleModalClose = () => {
    setIsOpen(false);
    // 모달이 닫힐 때 읽지 않은 개수 다시 조회
    fetchUnreadCount();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.notificationWrapper} onClick={toggleModal}>
        <svg className={styles.notificationIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <div className={styles.notificationBadge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
      {isOpen && <NotificationModal onClose={handleModalClose} />}
    </div>
  );
}

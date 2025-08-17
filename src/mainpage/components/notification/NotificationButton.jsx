import React, { useState, useEffect } from 'react';
import { IoNotifications } from 'react-icons/io5';
import styles from './NotificationButton.module.css';
import NotificationModal from './NotificationModal';
import { getNotifications } from '../../../api/service/notification/notificationApi';
import { useNotification } from '../../../context/NotificationContext';

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, updateUnreadCount } = useNotification();

  useEffect(() => {
    fetchUnreadCount();
  }, []);

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
        <IoNotifications className={styles.notificationIcon} size={24} />
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

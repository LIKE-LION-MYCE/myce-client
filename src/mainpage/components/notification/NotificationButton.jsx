import React, { useState } from 'react';
import { IoNotifications } from 'react-icons/io5';
import styles from './NotificationButton.module.css';
import NotificationModal from './NotificationModal'; // 알림 모달 컴포넌트 임포트

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.notificationWrapper} onClick={toggleModal}>
        <IoNotifications className={styles.notificationIcon} size={20} />
        <div className={styles.notificationBadge}>2</div>
      </div>
      {isOpen && <NotificationModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}

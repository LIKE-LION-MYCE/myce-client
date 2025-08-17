import React, { useEffect, useState } from 'react';
import './NotificationToast.css';

const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      // 5초 후 자동 닫기
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // 애니메이션 완료 후 제거
  };

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'QR_ISSUED':
        return '🎫';
      case 'QR_REISSUED':
        return '🔄';
      case 'EXPO_REMINDER':
        return '📅';
      case 'GENERAL':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getTypeLabel = () => {
    switch (notification.type) {
      case 'QR_ISSUED':
        return 'QR 발급';
      case 'QR_REISSUED':
        return 'QR 재발급';
      case 'EXPO_REMINDER':
        return '박람회 알림';
      case 'GENERAL':
        return '일반 알림';
      default:
        return '알림';
    }
  };

  return (
    <div className={`notification-toast ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        <div className="notification-header">
          <span className="notification-icon">{getIcon()}</span>
          <span className="notification-type">{getTypeLabel()}</span>
          <button className="notification-close" onClick={handleClose}>
            ✕
          </button>
        </div>
        <div className="notification-message">
          {notification.message}
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
// src/components/modal/NotificationModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NotificationModal.module.css';
import { IoNotificationsOutline } from 'react-icons/io5';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../../api/service/notification/notificationApi';

export default function NotificationModal({ onClose }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' 또는 'status'
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(t('components.notification.modal.errors.fetchFailed'), error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // 읽음 처리
      if (!notification.isRead) {
        await markNotificationAsRead(notification.notificationId);
        // 로컬 상태 업데이트
        setNotifications(prev => 
          prev.map(n => 
            n.notificationId === notification.notificationId 
              ? { ...n, isRead: true } 
              : n
          )
        );
      }

      // 페이지 이동
      navigateToTarget(notification);
      onClose(); // 모달 닫기
    } catch (error) {
      console.error(t('components.notification.modal.errors.markReadFailed'), error);
    }
  };

  const navigateToTarget = (notification) => {
    const { targetType, targetId } = notification;
    
    switch(targetType) {
      case 'EXPO':
        navigate(`/detail/${targetId}`);
        break;
      case 'RESERVATION':
        navigate(`/mypage/reservation/${targetId}`);
        break;
      case 'QR_ISSUED':
        navigate(`/mypage/reservation/${targetId}`);
        break;
      case 'EXPO_STATUS':
        navigate(`/mypage/expo-status/${targetId}`);
        break;
      case 'AD_STATUS':
        navigate(`/mypage/ads-status/${targetId}`);
        break;
      default:
        console.warn(t('components.notification.modal.errors.unknownType'), targetType);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'EXPO_REMINDER':
        return { icon: '📅', color: '#f97316' };
      case 'EVENT_REMINDER':
        return { icon: '🎯', color: '#8b5cf6' };
      case 'QR_ISSUED':
        return { icon: '🎫', color: '#10b981' };
      case 'PAYMENT_COMPLETE':
      case 'RESERVATION_CONFIRM':
        return { icon: '💳', color: '#3b82f6' };
      case 'EXPO_STATUS_CHANGE':
        return { icon: '🏢', color: '#ef4444' };
      case 'AD_STATUS_CHANGE':
        return { icon: '📢', color: '#f59e0b' };
      default:
        return { icon: '📢', color: '#6b7280' };
    }
  };

  const handleMarkAllAsReadClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmMarkAllAsRead = async () => {
    try {
      setMarkingAllAsRead(true);
      setShowConfirmModal(false);
      await markAllNotificationsAsRead();
      
      // 모든 알림을 읽음 상태로 업데이트
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error(t('components.notification.modal.errors.markAllReadFailed'), error);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  // 알림을 일반/상태변경으로 분류
  const getFilteredNotifications = () => {
    const statusChangeTypes = ['EXPO_STATUS_CHANGE', 'AD_STATUS_CHANGE'];
    
    if (activeTab === 'status') {
      return notifications.filter(notification => 
        statusChangeTypes.includes(notification.type)
      );
    } else {
      return notifications.filter(notification => 
        !statusChangeTypes.includes(notification.type)
      );
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const hasUnreadNotifications = filteredNotifications.some(notification => !notification.isRead);

  // 각 탭별 읽지 않은 알림 수
  const getUnreadCount = (tabType) => {
    const statusChangeTypes = ['EXPO_STATUS_CHANGE', 'AD_STATUS_CHANGE'];
    
    if (tabType === 'status') {
      return notifications.filter(n => 
        statusChangeTypes.includes(n.type) && !n.isRead
      ).length;
    } else {
      return notifications.filter(n => 
        !statusChangeTypes.includes(n.type) && !n.isRead
      ).length;
    }
  };

  const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffMinutes < 1) return t('components.notification.modal.time.justNow');
    if (diffMinutes < 60) return `${diffMinutes}${t('components.notification.modal.time.minutesAgo')}`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}${t('components.notification.modal.time.hoursAgo')}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}${t('components.notification.modal.time.daysAgo')}`;
  };

  // 상태 텍스트에 하이라이트 적용
  const highlightStatusText = (content) => {
    const statusKeywords = t('components.notification.modal.statusKeywords', { returnObjects: true });
    
    let highlightedContent = content;
    
    statusKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'g');
      highlightedContent = highlightedContent.replace(
        regex, 
        `<span class="${styles.statusHighlight}">$1</span>`
      );
    });
    
    return highlightedContent;
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <div className={styles.headerTitle}>
          <IoNotificationsOutline size={24} />
          <span>{t('components.notification.modal.title')}</span>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.readAll} 
            onClick={handleMarkAllAsReadClick}
            disabled={markingAllAsRead || !hasUnreadNotifications}
          >
            {markingAllAsRead ? t('components.notification.modal.processing') : t('components.notification.modal.markAllRead')}
          </button>
          <button className={styles.close} onClick={onClose}>
            {t('components.notification.modal.close')}
          </button>
        </div>
      </div>
      
      {/* 탭 네비게이션 */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
          onClick={() => setActiveTab('general')}
        >
          {t('components.notification.modal.tabs.general')}
          {getUnreadCount('general') > 0 && (
            <span className={styles.tabBadge}>{getUnreadCount('general')}</span>
          )}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'status' ? styles.active : ''}`}
          onClick={() => setActiveTab('status')}
        >
          {t('components.notification.modal.tabs.admin')}
          {getUnreadCount('status') > 0 && (
            <span className={styles.tabBadge}>{getUnreadCount('status')}</span>
          )}
        </button>
      </div>
      
      <ul className={styles.notificationList}>
        {loading ? (
          <li className={styles.loadingItem}>{t('components.notification.modal.loading')}</li>
        ) : filteredNotifications.length === 0 ? (
          <li className={styles.emptyItem}>
            {activeTab === 'general' ? t('components.notification.modal.empty.general') : t('components.notification.modal.empty.admin')}
          </li>
        ) : (
          filteredNotifications.map((notification) => {
            const iconInfo = getNotificationIcon(notification.type);
            return (
              <li 
                key={notification.notificationId} 
                className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                onClick={() => handleNotificationClick(notification)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className={styles.notificationIconWrap}
                  style={{ backgroundColor: iconInfo.color }}
                >
                  {iconInfo.icon}
                </div>
                <div className={styles.notificationContent}>
                  <div className={styles.notificationTitle}>{notification.title}</div>
                  <div 
                    className={styles.notificationDesc}
                    dangerouslySetInnerHTML={{ 
                      __html: highlightStatusText(notification.content) 
                    }}
                  />
                  <div className={styles.notificationMeta}>
                    <span className={styles.typeBadge}>
                      {notification.type === 'EXPO_REMINDER' ? t('components.notification.modal.types.expo') : 
                       notification.type === 'EVENT_REMINDER' ? t('components.notification.modal.types.event') : 
                       notification.type === 'QR_ISSUED' ? t('components.notification.modal.types.qrIssued') : 
                       notification.type === 'PAYMENT_COMPLETE' ? t('components.notification.modal.types.paymentComplete') : 
                       notification.type === 'RESERVATION_CONFIRM' ? t('components.notification.modal.types.reservationConfirm') :
                       notification.type === 'EXPO_STATUS_CHANGE' ? t('components.notification.modal.types.expo') :
                       notification.type === 'AD_STATUS_CHANGE' ? t('components.notification.modal.types.ad') : t('components.notification.modal.types.notification')}
                    </span>
                    <span className={styles.timeAgo}>{formatTimeAgo(notification.createdAt)}</span>
                    {!notification.isRead && <span className={styles.unreadDot} />}
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
      
      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className={styles.confirmModalOverlay}>
          <div className={styles.confirmModal}>
            <h3>{t('components.notification.modal.confirmModal.title')}</h3>
            <p>{t('components.notification.modal.confirmModal.message')}</p>
            <div className={styles.confirmModalButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowConfirmModal(false)}
              >
                {t('components.notification.modal.confirmModal.cancel')}
              </button>
              <button 
                className={styles.confirmReadAllButton}
                onClick={handleConfirmMarkAllAsRead}
              >
                {t('components.notification.modal.confirmModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 알림 아이콘 버튼
export function NotificationTrigger({ onClick, unreadCount = 0 }) {
  return (
    <div className={styles.notificationWrapper} onClick={onClick}>
      <IoNotificationsOutline className={styles.notificationIcon} size={20} />
      {unreadCount > 0 && <div className={styles.notificationBadge}>{unreadCount}</div>}
    </div>
  );
}

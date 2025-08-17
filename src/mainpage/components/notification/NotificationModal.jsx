// src/components/modal/NotificationModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationModal.module.css';
import { IoNotificationsOutline } from 'react-icons/io5';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../../api/service/notification/notificationApi';

export default function NotificationModal({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
      console.error('알림 조회 실패:', error);
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
      console.error('알림 처리 실패:', error);
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
      default:
        console.warn('알 수 없는 알림 타입:', targetType);
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
        return { icon: '💳', color: '#3b82f6' };
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
      console.error('모든 알림 읽음 처리 실패:', error);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const hasUnreadNotifications = notifications.some(notification => !notification.isRead);

  const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffMinutes < 1) return '방금';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <div className={styles.headerTitle}>
          <IoNotificationsOutline size={24} />
          <span>알림</span>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.readAll} 
            onClick={handleMarkAllAsReadClick}
            disabled={markingAllAsRead || !hasUnreadNotifications}
          >
            {markingAllAsRead ? '처리중...' : '모두 읽음'}
          </button>
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
      <ul className={styles.notificationList}>
        {loading ? (
          <li className={styles.loadingItem}>알림을 불러오는 중...</li>
        ) : notifications.length === 0 ? (
          <li className={styles.emptyItem}>알림이 없습니다.</li>
        ) : (
          notifications.map((notification) => {
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
                  <div className={styles.notificationDesc}>{notification.content}</div>
                  <div className={styles.notificationMeta}>
                    <span className={styles.typeBadge}>
                      {notification.type === 'EXPO_REMINDER' ? '박람회' : 
                       notification.type === 'EVENT_REMINDER' ? '행사' : 
                       notification.type === 'QR_ISSUED' ? 'QR발급' : 
                       notification.type === 'PAYMENT_COMPLETE' ? '결제완료' : '알림'}
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
            <h3>모든 알림 읽음 처리</h3>
            <p>읽지 않은 모든 알림을 읽음 처리하시겠습니까?</p>
            <div className={styles.confirmModalButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowConfirmModal(false)}
              >
                취소
              </button>
              <button 
                className={styles.confirmReadAllButton}
                onClick={handleConfirmMarkAllAsRead}
              >
                확인
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

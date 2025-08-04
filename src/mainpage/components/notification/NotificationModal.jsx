// src/components/modal/NotificationModal.jsx
import React from 'react';
import styles from './NotificationModal.module.css';
import { IoNotificationsOutline } from 'react-icons/io5';

const notifications = [
  {
    id: 1,
    type: '박람회',
    iconColor: '#f97316',
    icon: '📅',
    title: '2024 서울 국제 박람회',
    description: '박람회 시작까지 1일 남았습니다!',
    time: '2시간 전',
    unread: true,
  },
  {
    id: 2,
    type: '행사',
    iconColor: '#8b5cf6',
    icon: '📅',
    title: '스타트업 피칭 대회',
    description: '오늘 오후 2시에 시작됩니다. 참가 준비를 완료해주세요.',
    time: '30분 전',
    unread: true,
  },
  {
    id: 3,
    type: '박람회',
    iconColor: '#f97316',
    icon: '📅',
    title: '부산 테크 박람회',
    description: '박람회 시작까지 1일 남았습니다!',
    time: '5시간 전',
    unread: false,
  },
  {
    id: 4,
    type: '행사',
    iconColor: '#8b5cf6',
    icon: '📅',
    title: 'AI 세미나',
    description: '내일 오전 10시 B홀에서 진행됩니다.',
    time: '1일 전',
    unread: false,
  },
];

export default function NotificationModal({ onClose }) {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <div className={styles.headerTitle}>
          <IoNotificationsOutline size={20} />
          <span>알림</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.readAll}>모두 읽음</button>
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
      <ul className={styles.notificationList}>
        {notifications.map((noti) => (
          <li key={noti.id} className={styles.notificationItem}>
            <div
              className={styles.notificationIconWrap}
              style={{ backgroundColor: noti.iconColor }}
            >
              {noti.icon}
            </div>
            <div className={styles.notificationContent}>
              <div className={styles.notificationTitle}>{noti.title}</div>
              <div className={styles.notificationDesc}>{noti.description}</div>
              <div className={styles.notificationMeta}>
                <span className={styles.typeBadge}>{noti.type}</span>
                <span className={styles.timeAgo}>{noti.time}</span>
                {noti.unread && <span className={styles.unreadDot} />}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button className={styles.confirmButton}>확인</button>
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

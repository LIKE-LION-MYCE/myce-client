import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { getAllUnreadCounts } from '../../../api/service/chat/chatService';

import styles from './FloatingChatButton.module.css';

export default function FloatingChatButton() {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    const fetchTotalUnreadCount = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await getAllUnreadCounts();
        const total = response.data.totalUnreadCount || 0;
        setTotalUnreadCount(total);
      } catch (error) {
        console.error('전체 읽지 않은 메시지 개수 조회 실패:', error);
      }
    };

    fetchTotalUnreadCount();

    // 주기적으로 업데이트 (30초마다)
    const interval = setInterval(fetchTotalUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/chat" className={styles.fab}>
      <span className={styles.icon}>
        💬
      </span>
      {totalUnreadCount > 0 && (
        <span className={styles.badge}>{totalUnreadCount}</span>
      )}
    </Link>
  );
}

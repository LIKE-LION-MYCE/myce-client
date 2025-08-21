import React, { useEffect, useState } from 'react';
import styles from './ChatModal.module.css';
import ChatContainer from '../../../mainpage/components/chatcontainer/ChatContainer';

/**
 * Modern Chat Modal Component
 * 
 * A sleek, modern popup-style chat interface that overlays the current page
 * instead of opening in a new page. Provides better UX with no scroll conflicts.
 */
export default function ChatModal({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  // Handle smooth open/close animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Small delay to allow closing animation
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : styles.closing}`} onClick={onClose}>
      <div className={`${styles.modalContent} ${isOpen ? styles.open : styles.closing}`} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <header className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2>💬 상담 채팅</h2>
            <p>실시간 상담 서비스</p>
          </div>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            title="채팅 창 닫기"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </header>

        {/* Chat Content */}
        <div className={styles.chatContent}>
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}
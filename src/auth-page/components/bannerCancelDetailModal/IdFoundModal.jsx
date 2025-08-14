// IdFoundModal.jsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './IdFoundModal.module.css';

const IdFoundModal = ({ isOpen, onClose, foundId }) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // 모달이 열렸을 때 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>아이디 찾기 결과</h2>
          <p className={styles.modalSubtitle}>회원님의 아이디를 찾았습니다.</p>
        </div>
        
        <div className={styles.foundIdBox}>
          <div className={styles.foundIdLabel}>아이디</div>
          <div className={styles.foundId}>{foundId}</div>
        </div>
        
        <div className={styles.modalButtons}>
          <a href="/login" className={styles.loginButton}>
            로그인하기
          </a>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );

  // 모달을 document.body에 직접 렌더링
  return createPortal(modalContent, document.body);
};

export default IdFoundModal;
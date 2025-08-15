import React from 'react';
import styles from './AdRejectInfoModal.module.css';

function AdRejectInfoModal({ description, rejectedAt, onClose }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>광고 거절 사유</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <label>거절 일시</label>
            <div className={styles.info}>
              {rejectedAt ? formatDate(rejectedAt) : '-'}
            </div>
          </div>
          
          <div className={styles.section}>
            <label>거절 사유</label>
            <div className={styles.description}>
              {description || '거절 사유가 제공되지 않았습니다.'}
            </div>
          </div>
        </div>
        
        <div className={styles.footer}>
          <button className={styles.confirmBtn} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdRejectInfoModal;
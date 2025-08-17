import React from 'react';
import styles from './SevenDayRuleModal.module.css';

/**
 * 7일 규칙 위반 모달 컴포넌트
 * PUBLISHED 상태 박람회에서 환불 신청 시 개최일 7일 전에는 환불이 불가능함을 안내
 */
function SevenDayRuleModal({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>환불 신청 불가</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.iconContainer}>
            <div className={styles.warningIcon}>⚠️</div>
          </div>
          
          <div className={styles.messageContainer}>
            <h3 className={styles.messageTitle}>개최 7일 전에는 환불이 불가능합니다</h3>
            <p className={styles.messageDescription}>
              게시 중인 박람회는 개최일로부터 7일 전까지만 환불 신청이 가능합니다.<br />
              이는 이미 예약한 관람객들의 피해를 최소화하기 위한 정책입니다.
            </p>
            
            <div className={styles.infoBox}>
              <p className={styles.infoText}>
                <strong>환불 가능 기간:</strong> 개최일 7일 전까지<br />
                <strong>환불 불가 기간:</strong> 개최일 7일 이내
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.confirmButton} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default SevenDayRuleModal;
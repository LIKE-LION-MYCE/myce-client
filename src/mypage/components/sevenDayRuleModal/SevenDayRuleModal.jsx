import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SevenDayRuleModal.module.css';

/**
 * 7일 규칙 위반 모달 컴포넌트
 * PUBLISHED 상태 박람회에서 환불 신청 시 개최일 7일 전에는 환불이 불가능함을 안내
 */
function SevenDayRuleModal({ onClose }) {
  const { t } = useTranslation();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t('sevenDayRuleModal.title')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.iconContainer}>
            <div className={styles.warningIcon}>⚠️</div>
          </div>
          
          <div className={styles.messageContainer}>
            <h3 className={styles.messageTitle}>{t('sevenDayRuleModal.messageTitle')}</h3>
            <p className={styles.messageDescription}>
              {t('sevenDayRuleModal.messageDescription')}<br />
              {t('sevenDayRuleModal.messageSubDescription')}
            </p>
            
            <div className={styles.infoBox}>
              <p className={styles.infoText}>
                <strong>{t('sevenDayRuleModal.refundablePeroid')}</strong> {t('sevenDayRuleModal.refundablePeriodValue')}<br />
                <strong>{t('sevenDayRuleModal.nonRefundablePeriod')}</strong> {t('sevenDayRuleModal.nonRefundablePeriodValue')}
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.confirmButton} onClick={onClose}>
            {t('sevenDayRuleModal.confirmButton')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SevenDayRuleModal;
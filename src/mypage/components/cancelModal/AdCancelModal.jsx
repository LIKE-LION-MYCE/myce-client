import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AdCancelModal.module.css';

function AdCancelModal({ 
  advertisementTitle, 
  applicantName, 
  displayStartDate, 
  displayEndDate, 
  currentStatus,
  onCancel, 
  onClose 
}) {
  const { t } = useTranslation();
  
  // 상태별 취소 유형 결정
  const getCancelType = () => {
    switch(currentStatus) {
      case 'PENDING_APPROVAL':
        return { 
          type: t('adCancelModal.status.PENDING_APPROVAL.type'), 
          color: '#6b7280', 
          description: t('adCancelModal.status.PENDING_APPROVAL.description') 
        };
      case 'PENDING_PAYMENT':
        return { 
          type: t('adCancelModal.status.PENDING_PAYMENT.type'), 
          color: '#f59e0b', 
          description: t('adCancelModal.status.PENDING_PAYMENT.description') 
        };
      case 'PENDING_PUBLISH':
        return { 
          type: t('adCancelModal.status.PENDING_PUBLISH.type'), 
          color: '#3b82f6', 
          description: t('adCancelModal.status.PENDING_PUBLISH.description') 
        };
      case 'PUBLISHED':
        return { 
          type: t('adCancelModal.status.PUBLISHED.type'), 
          color: '#dc2626', 
          description: t('adCancelModal.status.PUBLISHED.description') 
        };
      case 'PENDING_CANCEL':
        return { 
          type: t('adCancelModal.status.PENDING_CANCEL.type'), 
          color: '#6b7280', 
          description: t('adCancelModal.status.PENDING_CANCEL.description') 
        };
      default:
        return { 
          type: t('adCancelModal.status.DEFAULT.type'), 
          color: '#6b7280', 
          description: t('adCancelModal.status.DEFAULT.description') 
        };
    }
  };

  const cancelType = getCancelType();

  const handleCancelConfirm = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h3>{t('adCancelModal.title')}</h3>
            <div className={styles.cancelTypeBadge} style={{ backgroundColor: cancelType.color }}>
              {cancelType.type}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.description}>
            {cancelType.description}
          </div>
          
          <div className={styles.adInfo}>
            <div className={styles.infoRow}>
              <label>{t('adCancelModal.fields.advertisementTitle')}</label>
              <span>{advertisementTitle}</span>
            </div>
            <div className={styles.infoRow}>
              <label>{t('adCancelModal.fields.applicantName')}</label>
              <span>{applicantName}</span>
            </div>
            <div className={styles.infoRow}>
              <label>{t('adCancelModal.fields.displayPeriod')}</label>
              <span>{displayStartDate} ~ {displayEndDate}</span>
            </div>
            <div className={styles.infoRow}>
              <label>{t('adCancelModal.fields.currentStatus')}</label>
              <span className={styles.statusText}>{t(`adCancelModal.statusLabels.${currentStatus}`, currentStatus)}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {t('adCancelModal.buttons.close')}
          </button>
          <button className={styles.confirmBtn} onClick={handleCancelConfirm}>
            {t('adCancelModal.buttons.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}

// getStatusLabel 함수 제거 (국제화로 대체됨)

export default AdCancelModal;
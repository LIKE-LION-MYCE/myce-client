import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AdRejectInfoModal.module.css';

function AdRejectInfoModal({ description, rejectedAt, onClose }) {
  const { t } = useTranslation();
  
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
          <h3>{t('adRejectInfoModal.title')}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <label>{t('adRejectInfoModal.rejectedAt')}</label>
            <div className={styles.info}>
              {rejectedAt ? formatDate(rejectedAt) : t('adRejectInfoModal.noDate')}
            </div>
          </div>
          
          <div className={styles.section}>
            <label>{t('adRejectInfoModal.rejectionReason')}</label>
            <div className={styles.description}>
              {description || t('adRejectInfoModal.noReason')}
            </div>
          </div>
        </div>
        
        <div className={styles.footer}>
          <button className={styles.confirmBtn} onClick={onClose}>
            {t('adRejectInfoModal.confirmButton')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdRejectInfoModal;
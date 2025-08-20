import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AdminInfoModal.module.css';

const AdminInfoModal = ({ 
  adminName,
  codesData,
  onClose,
  onNavigateToAdminPage
}) => {
  const { t } = useTranslation();
  // Use the passed adminName, with a fallback
  const adminId = adminName || t('adminInfoModal.messages.noAdminId');
  
  // Map over the codesData array to extract the code property
  const subordinateCodes = codesData?.map(item => ({
    code: item.code,
    action: t('adminInfoModal.buttons.copy')
  })) || [];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert(t('adminInfoModal.messages.codeCopied'));
    }).catch(() => {
      alert(t('adminInfoModal.messages.copyFailed'));
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('adminInfoModal.title')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.label}>{t('adminInfoModal.fields.adminId')}</div>
            <div className={styles.adminId}>{adminId}</div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <div className={styles.label}>{t('adminInfoModal.fields.subordinateCodes')}</div>
            <div className={styles.codeList}>
              {subordinateCodes.length > 0 ? (
                subordinateCodes.map((item, index) => (
                  <div key={index} className={styles.codeItem}>
                    <span className={styles.code}>{item.code}</span>
                    <button 
                      className={styles.copyButton}
                      onClick={() => handleCopyCode(item.code)}
                    >
                      {item.action}
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.noCodeMessage}>{t('adminInfoModal.messages.noCodes')}</div>
              )}
            </div>
          </div>
        </div>

        <button 
          className={styles.navigateButton}
          onClick={onNavigateToAdminPage}
        >
          {t('adminInfoModal.buttons.navigateToAdmin')}
        </button>
      </div>
    </div>
  );
};

export default AdminInfoModal;
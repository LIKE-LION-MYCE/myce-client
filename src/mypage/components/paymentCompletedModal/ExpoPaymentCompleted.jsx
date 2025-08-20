import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ExpoPaymentCompleted.module.css';

// ExpoPaymentCompleted 컴포넌트가 동적인 expoId를 prop으로 받도록 수정합니다.
const ExpoPaymentCompleted = ({ expoId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToDetailPage = () => {
    // 받은 expoId를 사용하여 동적인 경로로 이동합니다.
    navigate(`/mypage/expo-status/${expoId}`); 
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('expoPaymentCompleted.title')}</h1>
      
      <div className={styles.content}>
        <p className={styles.description}>{t('expoPaymentCompleted.description')}</p>
        <p className={styles.notice}>{t('expoPaymentCompleted.notice')}</p>
        
        <div className={styles.codeSection}>
          <div className={styles.codeLabel}>{t('expoPaymentCompleted.adminCode.label')}</div>
          <div className={styles.codeValue}>{t('expoPaymentCompleted.adminCode.value')}</div>
        </div>
        
        <div className={styles.question}>{t('expoPaymentCompleted.question')}</div>
        
        <div className={styles.contact}>
          <span className={styles.contactIcon}>💬</span>
          <a href="#" className={styles.contactLink}>{t('expoPaymentCompleted.contact')}</a>
        </div>
      </div>
      
      <button className={styles.redirectButton} onClick={handleGoToDetailPage}>
        {t('expoPaymentCompleted.buttons.goToDetail')}
      </button>
    </div>
  );
};

export default ExpoPaymentCompleted;

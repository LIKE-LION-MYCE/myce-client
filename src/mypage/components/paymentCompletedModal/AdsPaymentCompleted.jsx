import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './AdsPaymentCompleted.module.css';

const AdsPaymentCompleted = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRedirectToMain = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('adsPaymentCompleted.title')}</h1>
      
      <div className={styles.content}>
        <div className={styles.question}>{t('adsPaymentCompleted.question')}</div>
        
        <div className={styles.contact}>
          <span className={styles.contactIcon}>💬</span>
          <a href="#" className={styles.contactLink}>{t('adsPaymentCompleted.contact')}</a>
        </div>
      </div>
      
      <button className={styles.redirectButton} onClick={handleRedirectToMain}>
        {t('adsPaymentCompleted.buttons.goToMain')}
      </button>
    </div>
  );
};

export default AdsPaymentCompleted;

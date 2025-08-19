import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.column}>
          <h4 className={styles.title}>MYCE</h4>
          <p className={styles.text}>{t('homepage.footer.companyAddress', '회사 도로명 주소 정보')}</p>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>{t('homepage.footer.service.title', '서비스')}</h4>
          <a href="#" className={styles.link}>{t('homepage.footer.service.reservation', '박람회 예약')}</a>
          <a href="#" className={styles.link}>{t('homepage.footer.service.inquiry', '예약 조회')}</a>
          <a href="#" className={styles.link}>{t('homepage.footer.service.consultation', '일대일 상담')}</a>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>{t('homepage.footer.business.title', '비즈니스')}</h4>
          <a href="#" className={styles.link}>{t('homepage.footer.business.application', '박람회 신청')}</a>
          <a href="#" className={styles.link}>{t('homepage.footer.business.advertising', '광고 신청')}</a>
        </div>
      </div>
      <div className={styles.copyright}>
        {t('homepage.footer.copyright', '© 2024 Myce. All rights reserved.')}
      </div>
    </footer>
  );
}

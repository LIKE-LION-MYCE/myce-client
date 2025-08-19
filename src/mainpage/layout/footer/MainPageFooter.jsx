// src/mainpage/layout/footer/MainPageFooter.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MainPageFooter.module.css';

function MainPageFooter() {
  const { t } = useTranslation();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerLinks}>
          <div className={styles.infoSection}>
            <h3 className={styles.infoTitle}>MYCE</h3>
            <p className={styles.infoText}>{t('homepage.footer.companyAddress', '회사 도로명 주소 정보')}</p>
          </div>
          <div className={styles.linkSection}>
            <h4 className={styles.linkTitle}>{t('homepage.footer.service.title', '서비스')}</h4>
            <ul className={styles.linkList}>
              <li><a href="#">{t('homepage.footer.service.reservation', '박람회 예약')}</a></li>
              <li><a href="#">{t('homepage.footer.service.inquiry', '예약 조회')}</a></li>
              <li><a href="#">{t('homepage.footer.service.consultation', '일대일 상담')}</a></li>
            </ul>
          </div>
          <div className={styles.linkSection}>
            <h4 className={styles.linkTitle}>{t('homepage.footer.business.title', '비즈니스')}</h4>
            <ul className={styles.linkList}>
              <li><a href="#">{t('homepage.footer.business.application', '박람회 신청')}</a></li>
              <li><a href="#">{t('homepage.footer.business.advertising', '광고 신청')}</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>{t('homepage.footer.copyright', '© 2024 Myce. All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  );
}

export default MainPageFooter;
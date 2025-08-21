// src/mainpage/layout/footer/MainPageFooter.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MainPageFooter.module.css';
import TermsModal from '../../../components/shared/modals/TermsModal';
import PrivacyModal from '../../../components/shared/modals/PrivacyModal';

function MainPageFooter() {
  const { t } = useTranslation();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  
  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);
  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const closePrivacyModal = () => setIsPrivacyModalOpen(false);
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.column}>
            <h3 className={styles.companyTitle}>{t('footer.company.name')}</h3>
            <div className={styles.companyInfo}>
              <p>{t('footer.company.address')}</p>
              <p>{t('footer.company.businessNumber')}</p>
              <p>{t('footer.company.ecommerce')}</p>
              <p>{t('footer.company.tourism')}</p>
              <p>{t('footer.company.hosting')}</p>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{t('footer.customerService.title')}</h4>
            <div className={styles.contactInfo}>
              <p>{t('footer.customerService.fax')}</p>
              <p>{t('footer.customerService.email')}</p>
              <p>{t('footer.customerService.chatService')}</p>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{t('footer.privacy.title')}</h4>
            <div className={styles.contactInfo}>
              <p>{t('footer.privacy.department')}</p>
              <p>{t('footer.privacy.contact')}</p>
              <p>{t('footer.privacy.hours')}</p>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomSection}>
          <p className={styles.disclaimer}>
            {t('footer.legal.disclaimer')}
          </p>
          <div className={styles.bottomLine}>
            <div className={styles.legalLinks}>
              <button onClick={openTermsModal} className={styles.legalLink}>{t('footer.legal.terms')}</button>
              <span className={styles.separator}>|</span>
              <button onClick={openPrivacyModal} className={styles.legalLink}>{t('footer.legal.privacy')}</button>
            </div>
            <p className={styles.copyright}>{t('footer.legal.copyright')}</p>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <TermsModal isOpen={isTermsModalOpen} onClose={closeTermsModal} />
      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={closePrivacyModal} />
    </footer>
  );
}

export default MainPageFooter;
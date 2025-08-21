import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/languageSelector/LanguageSelector';
import styles from './SystemSettings.module.css';

const SystemSettings = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>{t('mypageGeneral.systemSettings')}</h2>
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('mypageGeneral.languageSettings')}</h2>
          <div className={styles.sectionContent}>
            <p className={styles.sectionDescription}>
              {t('language.selectLanguage')}
            </p>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
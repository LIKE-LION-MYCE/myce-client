import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/languageSelector/LanguageSelector';
import styles from './SystemSettings.module.css';

const SystemSettings = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('mypageGeneral.systemSettings')}</h1>
        <p className={styles.description}>시스템 환경을 설정할 수 있습니다.</p>
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
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.css';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const languages = [
    { code: 'ko', name: t('language.korean'), flag: '🇰🇷' },
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'ja', name: t('language.japanese'), flag: '🇯🇵' }
  ];
  
  const showSuccessMessage = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showFailMessage = (message) => {
    setToastMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    
    // 성공 메시지 표시 (옵션)
    setTimeout(() => {
      showSuccessMessage(t('language.languageChanged'));
    }, 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.languageGrid}>
        {languages.map((language) => (
          <button
            key={language.code}
            className={`${styles.languageCard} ${
              selectedLanguage === language.code ? styles.selected : ''
            }`}
            onClick={() => handleLanguageChange(language.code)}
          >
            <span className={styles.flag}>{language.flag}</span>
            <span className={styles.languageName}>{language.name}</span>
            {selectedLanguage === language.code && (
              <span className={styles.checkmark}>✓</span>
            )}
          </button>
        ))}
      </div>
      
      <div className={styles.currentLanguage}>
        <span className={styles.currentLabel}>현재 선택된 언어:</span>
        <span className={styles.currentValue}>
          {languages.find(lang => lang.code === selectedLanguage)?.name}
        </span>
      </div>
      {showSuccessToast && <ToastSuccess message={toastMessage} />}
      {showFailToast && <ToastFail message={toastMessage} />}
    </div>
  );
};

export default LanguageSelector;
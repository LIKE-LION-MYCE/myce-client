import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.css';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: 'ko', name: t('language.korean'), flag: '🇰🇷' },
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'ja', name: t('language.japanese'), flag: '🇯🇵' }
  ];

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    
    // 성공 메시지 표시 (옵션)
    setTimeout(() => {
      alert(t('language.languageChanged'));
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
        <span className={styles.currentLabel}>{t('language.currentLanguage', '현재 선택된 언어:')}</span>
        <span className={styles.currentValue}>
          {languages.find(lang => lang.code === selectedLanguage)?.name}
        </span>
      </div>
    </div>
  );
};

export default LanguageSelector;
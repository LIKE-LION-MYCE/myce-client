import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLanguage, IoChevronDown } from 'react-icons/io5';
import styles from './LanguageSelector.module.css';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSelector}>
      <button 
        className={styles.currentLanguage}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('common.selectLanguage', '언어 선택')}
      >
        <span className={styles.globeIcon}>🌐</span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.languageOption} ${
                i18n.language === language.code ? styles.active : ''
              }`}
              onClick={() => changeLanguage(language.code)}
            >
              <span className={styles.flag}>{language.flag}</span>
              <span className={styles.name}>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
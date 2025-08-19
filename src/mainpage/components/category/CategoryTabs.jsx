import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryTabs.module.css';
// 메인 i18n.js에서 모든 리소스를 병합하므로 별도 import 불필요

export default function CategoryTabs({ categories, onCategoryChange }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('전체');

  // 카테고리 번역 매핑 함수
  const translateCategory = (category) => {
    const categoryMap = {
      '전체': t('homepage.categories.all'),
      '기술/IT': t('homepage.categories.technology'),
      '패션/뷰티': t('homepage.categories.fashion'),
      '푸드/음료': t('homepage.categories.food'),
      '문화/예술': t('homepage.categories.culture')
    };
    return categoryMap[category] || category;
  };

  const handleClick = (cat) => {
    setActiveTab(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('homepage.categories.ongoingEvents', '진행중인 행사')}</h2>
      </div>
      <div className={styles.container}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tab} ${activeTab === cat ? styles.active : ''}`}
            onClick={() => handleClick(cat)}
          >
            {translateCategory(cat)}
          </button>
        ))}
      </div>
    </div>
  );
}
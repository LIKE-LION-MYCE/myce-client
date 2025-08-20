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
      'IT/테크/보안': t('homepage.categories.tech'),
      '뷰티/라이프스타일': t('homepage.categories.fashion'),
      '의료/헬스케어': t('homepage.categories.medical'),
      '예술/디자인/기타': t('homepage.categories.culture'),
      '식품/1차산업': t('homepage.categories.food'),
      '제조/생산': t('homepage.categories.create'),
      '건설/인프라': t('homepage.categories.infra'),
      '모빌리티/조선/해양': t('homepage.categories.mobility'),
      '에너지/환경': t('homepage.categories.energy'),
      '리테일/유통/물류': t('homepage.categories.retail'),
      '방위산업/우주': t('homepage.categories.space'),
      '교육/학습': t('homepage.categories.education'),
      '경영/금융/서비스': t('homepage.categories.service')
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
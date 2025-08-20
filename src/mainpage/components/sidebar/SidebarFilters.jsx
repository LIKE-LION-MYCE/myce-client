// SidebarFilters.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SidebarFilters.module.css';

export default function SidebarFilters({ filters, setFilters, categories }) {
  const { t } = useTranslation();
  const handleKeywordChange = (e) => {
    setFilters(prevFilters => ({ ...prevFilters, keyword: e.target.value }));
  };

  const handlePeriodChange = (periodValue) => {
    setFilters(prevFilters => ({ ...prevFilters, period: periodValue, from: undefined, to: undefined }));
  };

  const handleDateChange = (type, e) => {
    setFilters(prevFilters => ({ ...prevFilters, [type]: e.target.value, period: undefined }));
  };

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

  const handleCategoryChange = (categoryValue) => {
    const newCategory = categoryValue === '전체' ? undefined : categoryValue;
    setFilters(prevFilters => ({ ...prevFilters, category: newCategory }));
  };

  const handleResetFilters = () => {
    setFilters({ sort: 'startDate,asc' });
  };

  return (
    <div className={styles.sidebar}>
      <input
        className={styles.search}
        type="text"
        placeholder={t('homepage.sidebarFilters.search.placeholder', '박람회를 검색하세요.')}
        value={filters.keyword || ''}
        onChange={handleKeywordChange}
      />

      <div className={styles.filterSection}>
        <h4>{t('homepage.sidebarFilters.period.title', '기간')}</h4>
        <div className={styles.durationButtons}>
          {[1, 3, 6, 12].map((periodValue) => (
            <button
              key={periodValue}
              className={`${styles.filterButton} ${filters.period === periodValue ? styles.active : ''}`}
              onClick={() => handlePeriodChange(periodValue)}
            >
              {t('homepage.sidebarFilters.period.months', '{{count}}개월', { count: periodValue })}
            </button>
          ))}
        </div>
        <div className={styles.datePickerWrapper}>
          <span>{t('homepage.sidebarFilters.period.start', '시작')}</span>
          <input
            type="date"
            value={filters.from || ''}
            onChange={(e) => handleDateChange('from', e)}
          />
          <span>{t('homepage.sidebarFilters.period.end', '종료')}</span>
          <input
            type="date"
            value={filters.to || ''}
            onChange={(e) => handleDateChange('to', e)}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>{t('homepage.sidebarFilters.category.title', '카테고리')}</h4>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryButton} ${filters.category === cat || (filters.category === undefined && cat === '전체') ? styles.active : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {translateCategory(cat)}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.resetButton} onClick={handleResetFilters}>{t('homepage.sidebarFilters.reset', '필터 초기화')}</button>
    </div>
  );
}
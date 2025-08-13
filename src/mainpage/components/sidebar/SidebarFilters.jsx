// SidebarFilters.jsx
import React from 'react';
import styles from './SidebarFilters.module.css';

export default function SidebarFilters({ filters, setFilters }) {
  const handleKeywordChange = (e) => {
    setFilters(prevFilters => ({ ...prevFilters, keyword: e.target.value }));
  };

  const handlePeriodChange = (periodValue) => {
    setFilters(prevFilters => ({ ...prevFilters, period: periodValue, from: undefined, to: undefined }));
  };

  const handleDateChange = (type, e) => {
    setFilters(prevFilters => ({ ...prevFilters, [type]: e.target.value, period: undefined }));
  };

  const handleCategoryChange = (categoryValue) => {
    setFilters(prevFilters => ({ ...prevFilters, category: categoryValue }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const categories = [
    'Construction / Architecture / Interior',
    'Medical / Health / Sports',
    'Textile / Fashion / Apparel',
    'Machinery / Science / Technology',
    'Arts / Design',
    'Education / Publishing',
    'Tourism / Travel',
    'Finance / Fintech',
    'Environment / Energy',
  ];

  return (
    <div className={styles.sidebar}>
      <input
        className={styles.search}
        type="text"
        placeholder="박람회를 검색하세요."
        value={filters.keyword || ''}
        onChange={handleKeywordChange}
      />

      <div className={styles.filterSection}>
        <h4>기간</h4>
        <div className={styles.durationButtons}>
          {[1, 3, 6, 12].map((periodValue) => (
            <button
              key={periodValue}
              className={`${styles.filterButton} ${filters.period === periodValue ? styles.active : ''}`}
              onClick={() => handlePeriodChange(periodValue)}
            >
              {periodValue}개월
            </button>
          ))}
        </div>
        <div className={styles.datePickerWrapper}>
          <span>시작</span>
          <input
            type="date"
            value={filters.from || ''}
            onChange={(e) => handleDateChange('from', e)}
          />
          <span>종료</span>
          <input
            type="date"
            value={filters.to || ''}
            onChange={(e) => handleDateChange('to', e)}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>카테고리</h4>
        <div className={styles.categoryList}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryButton} ${filters.category === cat ? styles.active : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.resetButton} onClick={handleResetFilters}>필터 초기화</button>
    </div>
  );
}
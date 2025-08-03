// SidebarFilters.jsx
import React from 'react';
import styles from './SidebarFilters.module.css';

export default function SidebarFilters() {
  return (
    <div className={styles.sidebar}>
      <input className={styles.search} type="text" placeholder="박람회를 검색하세요." />

      <div className={styles.filterSection}>
        <h4>기간</h4>
        <div className={styles.durationButtons}>
          {['1개월', '3개월', '6개월', '1년'].map((label) => (
            <button key={label} className={styles.filterButton}>{label}</button>
          ))}
        </div>
        <div className={styles.datePickerWrapper}>
          <span>시작</span>
          <input type="date" />
          <span>종료</span>
          <input type="date" />
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>카테고리</h4>
        <div className={styles.categoryList}>
          {[
            'Construction / Architecture / Interior',
            'Medical / Health / Sports',
            'Textile / Fashion / Apparel',
            'Machinery / Science / Technology',
            'Arts / Design',
            'Education / Publishing',
            'Tourism / Travel',
            'Finance / Fintech',
            'Environment / Energy',
          ].map((cat) => (
            <button key={cat} className={styles.categoryButton}>{cat}</button>
          ))}
        </div>
      </div>

      <button className={styles.resetButton}>필터 초기화</button>
    </div>
  );
}
// LoadMoreButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './LoadMoreButton.module.css';
// 메인 i18n.js에서 모든 리소스를 병합하므로 별도 import 불필요

export default function LoadMoreButton() {
  const { t } = useTranslation();
  
  return (
    <div className={styles.buttonContainer}>
      <Link to="/expo-list" className={styles.link}>
      <button className={styles.viewAllButton}>
        전체보기
        <svg className={styles.arrowIcon} viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      </Link>
    </div>
  );
}

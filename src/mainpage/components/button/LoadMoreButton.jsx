// LoadMoreButton.jsx
import React from 'react';
import {Link} from 'react-router-dom';
import styles from './LoadMoreButton.module.css';

export default function LoadMoreButton() {
  return (
    <div className={styles.buttonContainer}>
      <Link to="/expo-list" className={styles.link}>
      <button className={styles.viewAllButton}>
        전체 보기
        <svg className={styles.arrowIcon} viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      </Link>
    </div>
  );
}

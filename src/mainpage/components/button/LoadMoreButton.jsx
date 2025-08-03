// LoadMoreButton.jsx
import React from 'react';
import {Link} from 'react-router-dom';
import styles from './LoadMoreButton.module.css';

export default function LoadMoreButton() {
  return (
    <div className={styles.container}>
      <Link to="/expo-list" className={styles.link}>
      <button className={styles.button}>
        전체 보기
      </button>
      </Link>
    </div>
  );
}

// TopRightWidgets.jsx
import React from 'react';
import styles from './TopRightWidgets.module.css';

export default function TopRightWidgets() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="전시명, 장소를 검색하세요"
          className={styles.input}
        />
      </div>
    </div>
  );
}

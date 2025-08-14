import React, { useState } from 'react';
import styles from './CategoryTabs.module.css';

export default function CategoryTabs({ categories, onCategoryChange }) {
  const [activeTab, setActiveTab] = useState('전체');

  const handleClick = (cat) => {
    setActiveTab(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>진행중인 행사</h2>
      </div>
      <div className={styles.container}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tab} ${activeTab === cat ? styles.active : ''}`}
            onClick={() => handleClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
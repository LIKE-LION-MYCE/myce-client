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
  );
}

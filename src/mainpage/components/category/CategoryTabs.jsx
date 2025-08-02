import React, { useState } from 'react';
import styles from './CategoryTabs.module.css';

const categories = ['전체', '디지털', '식음료', '패션', '레저', '기타'];

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState('전체');

  return (
    <div className={styles.container}>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`${styles.tab} ${activeTab === cat ? styles.active : ''}`}
          onClick={() => setActiveTab(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

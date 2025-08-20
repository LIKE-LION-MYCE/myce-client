import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryTabs.module.css';
// 메인 i18n.js에서 모든 리소스를 병합하므로 별도 import 불필요

export default function CategoryTabs({ categories, onCategoryChange }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('전체');
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [hiddenCategories, setHiddenCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const calculateVisibleCategories = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.offsetWidth - 50; // 에너지/환경 카테고리가 더 확실히 위쪽으로
      let totalWidth = 0;
      const visible = [];
      const hidden = [];
      
      // 임시로 모든 탭을 렌더링해서 너비 측정
      categories.forEach((cat) => {
        const tempButton = document.createElement('button');
        tempButton.className = styles.tab;
        tempButton.textContent = translateCategory(cat);
        tempButton.style.position = 'absolute';
        tempButton.style.visibility = 'hidden';
        document.body.appendChild(tempButton);
        
        const buttonWidth = tempButton.offsetWidth + 8; // margin 포함
        document.body.removeChild(tempButton);
        
        if (totalWidth + buttonWidth <= containerWidth) {
          visible.push(cat);
          totalWidth += buttonWidth;
        } else {
          hidden.push(cat);
        }
      });
      
      setVisibleCategories(visible);
      setHiddenCategories(hidden);
    };
    
    calculateVisibleCategories();
    window.addEventListener('resize', calculateVisibleCategories);
    
    return () => window.removeEventListener('resize', calculateVisibleCategories);
  }, [categories, t]);

  const handleClick = (cat) => {
    setActiveTab(cat);
    setIsDropdownOpen(false);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('homepage.categories.ongoingExpos', '진행중인 박람회')}</h2>
      </div>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.firstRow}>
          {visibleCategories.map((cat) => (
            <button
              key={cat}
              className={`${styles.tab} ${activeTab === cat ? styles.active : ''}`}
              onClick={() => handleClick(cat)}
            >
              {translateCategory(cat)}
            </button>
          ))}
          {hiddenCategories.length > 0 && (
            <button
              className={`${styles.tab} ${styles.toggleButton}`}
              onClick={toggleDropdown}
            >
              <svg className={`${styles.arrowIcon} ${isDropdownOpen ? styles.arrowUp : styles.arrowDown}`} viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        {hiddenCategories.length > 0 && isDropdownOpen && (
          <div className={styles.secondRow}>
            {hiddenCategories.map((cat) => (
              <button
                key={cat}
                className={`${styles.tab} ${activeTab === cat ? styles.active : ''}`}
                onClick={() => handleClick(cat)}
              >
                {translateCategory(cat)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
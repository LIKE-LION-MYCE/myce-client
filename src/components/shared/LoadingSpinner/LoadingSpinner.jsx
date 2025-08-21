import React, { useState, useEffect } from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium', message = '로딩 중...' }) => {
  const [currentImage, setCurrentImage] = useState('');
  
  const gradeImages = [
    '/images/grades/BRONZE.png',
    '/images/grades/SILVER.png', 
    '/images/grades/GOLD.png',
    '/images/grades/PLATINUM.png',
    '/images/grades/DIAMOND.png'
  ];

  useEffect(() => {
    // 컴포넌트 마운트 시 랜덤 이미지 선택
    const randomIndex = Math.floor(Math.random() * gradeImages.length);
    setCurrentImage(gradeImages[randomIndex]);
  }, []);

  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large
  }[size] || styles.medium;

  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${sizeClass}`}>
        {currentImage && (
          <img 
            src={currentImage} 
            alt="Loading..." 
            className={styles.image}
          />
        )}
      </div>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default LoadingSpinner;
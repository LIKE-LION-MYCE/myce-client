import React from 'react';
import styles from './UpcomingCard.module.css';

const UpcomingCard = ({ 
  event, 
  onClick,
  className = '' 
}) => {
  const getTagClass = (color) => {
    const tagClasses = {
      purple: styles.tagPurple,
      red: styles.tagRed,
      blue: styles.tagBlue
    };
    return tagClasses[color] || styles.tagGray;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'soldout':
        return styles.statusSoldout;
      case 'upcoming':
        return styles.statusUpcoming;
      case 'available':
        return styles.statusAvailable;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'soldout':
        return '매진';
      case 'upcoming':
        return '오픈예정';
      case 'available':
        return '예매가능';
      default:
        return status;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className={`${styles.card} ${event.featured ? styles.cardFeatured : ''} ${className}`}
      onClick={handleClick}
    >
      {/* 이미지 섹션 */}
      <div className={styles.imageSection}>
        <img
          src={event.image || '/api/placeholder/300/200'}
          alt={event.title}
          className={styles.image}
        />
        
        {/* 태그들 */}

        <span className={`${styles.tag} ${getTagClass(event.tagColors?.[1])}`}
        >
        {event.category}
        </span>

        {/* 상태 표시 (매진, 오픈 예정 등) */}
        {event.status && (
          <div className={styles.status}>
            <span className={`${styles.statusBadge} ${getStatusClass(event.status)}`}>
              {getStatusText(event.status)}
            </span>
          </div>
        )}
      </div>
      
      {/* 컨텐츠 섹션 */}
      <div className={styles.content}>
        {/* 날짜 */}
        {event.date && (
          <div className={styles.date}>
            {event.date}
          </div>
        )}
        
        {/* 카테고리 (추후공지만) */}
        {event.category && (
          <div className={styles.category}>
            {event.category}
          </div>
        )}
        
        {/* 제목 */}
        <h3 className={styles.title}>
          {event.title}
        </h3>
        
        {/* 예매처 */}
        {event.venue && (
          <div className={styles.venue}>
            {event.venue}
          </div>
        )}

        {/* 추가 정보들 */}
        {event.location && (
          <div className={styles.location}>
            📍 {event.location}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingCard;
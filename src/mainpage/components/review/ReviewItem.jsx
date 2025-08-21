import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../utils/dateUtils';
import styles from './Review.module.css';

const ReviewItem = ({ review, currentUserId, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const isOwner = currentUserId && currentUserId === review.memberId;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`${styles.star} ${index < rating ? styles.filled : styles.empty}`}
      >
        ★
      </span>
    ));
  };

  const formatReviewDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return t('components.review.item.time.today');
    } else if (diffDays === 2) {
      return t('components.review.item.time.yesterday');
    } else if (diffDays <= 7) {
      return `${diffDays - 1}${t('components.review.item.time.daysAgo')}`;
    } else {
      return formatDate(dateString);
    }
  };

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{review.memberName}</span>
          <div className={styles.rating}>
            {renderStars(review.rating)}
            <span className={styles.ratingScore}>{review.rating}</span>
          </div>
        </div>
        
        <div className={styles.reviewMeta}>
          <span className={styles.reviewDate}>
            {formatReviewDate(review.createdAt)}
            {review.updatedAt !== review.createdAt && ` ${t('components.review.item.time.edited')}`}
          </span>
          
          {isOwner && (
            <div className={styles.reviewActions}>
              <button 
                className={styles.editBtn}
                onClick={() => onEdit(review)}
              >
                {t('components.review.item.buttons.edit')}
              </button>
              <button 
                className={styles.deleteBtn}
                onClick={() => onDelete(review.id)}
              >
                {t('components.review.item.buttons.delete')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.reviewContent}>
        <h4 className={styles.reviewTitle}>{review.title}</h4>
        <p className={styles.reviewText}>{review.content}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
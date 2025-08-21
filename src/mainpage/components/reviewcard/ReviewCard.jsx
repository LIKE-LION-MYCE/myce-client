import styles from './ReviewCard.module.css';

const ReviewCard = ({ 
  review, 
  onClick,
  className = '' 
}) => {
  const renderStars = (rating) => {
    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={styles.star}>★</span>
        ))}
        <span className={styles.rating}>{rating}</span>
      </div>
    );
  };

  const handleClick = () => {
    if (onClick) {
      onClick(review);
    }
  };

  return (
    <div 
      className={`${styles.reviewCard} ${review.hasImage ? styles.withImage : styles.textOnly} ${className}`}
      onClick={handleClick}
    > 
      <div className={styles.contentSection}>
        <div className={styles.genre}>{review.genre}</div>
        <h3 className={styles.reviewTitle}>{review.title}</h3>
        <p className={styles.reviewContent}>{review.content}</p>
        
        <div className={styles.authorSection}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{review.author}</span>
          </div>
          {renderStars(review.rating)}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
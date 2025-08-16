import React from 'react';
import styles from './ExpoReviews.module.css';

const ExpoReviews = ({ reviews }) => {
  return (
    <div className={styles.reviewsSection}>
      <h3>리뷰</h3>
      {reviews?.averageRating > 0 ? (
        <div className={styles.reviewStats}>
          <p>평균 평점: ⭐ {reviews.averageRating.toFixed(1)}</p>
          <p>총 리뷰 수: {reviews.totalReviews}개</p>
          
          {/* 별점별 분포 */}
          {reviews.ratingSummary && (
            <div className={styles.ratingSummary}>
              <div className={styles.ratingBar}>
                <span>5점</span>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.bar} 
                    style={{width: `${(reviews.ratingSummary.fiveStars / reviews.totalReviews) * 100}%`}}
                  ></div>
                </div>
                <span>{reviews.ratingSummary.fiveStars}</span>
              </div>
              <div className={styles.ratingBar}>
                <span>4점</span>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.bar} 
                    style={{width: `${(reviews.ratingSummary.fourStars / reviews.totalReviews) * 100}%`}}
                  ></div>
                </div>
                <span>{reviews.ratingSummary.fourStars}</span>
              </div>
              <div className={styles.ratingBar}>
                <span>3점</span>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.bar} 
                    style={{width: `${(reviews.ratingSummary.threeStars / reviews.totalReviews) * 100}%`}}
                  ></div>
                </div>
                <span>{reviews.ratingSummary.threeStars}</span>
              </div>
              <div className={styles.ratingBar}>
                <span>2점</span>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.bar} 
                    style={{width: `${(reviews.ratingSummary.twoStars / reviews.totalReviews) * 100}%`}}
                  ></div>
                </div>
                <span>{reviews.ratingSummary.twoStars}</span>
              </div>
              <div className={styles.ratingBar}>
                <span>1점</span>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.bar} 
                    style={{width: `${(reviews.ratingSummary.oneStars / reviews.totalReviews) * 100}%`}}
                  ></div>
                </div>
                <span>{reviews.ratingSummary.oneStars}</span>
              </div>
            </div>
          )}
          
          {/* 리뷰 목록 */}
          {reviews.reviews && reviews.reviews.length > 0 && (
            <div className={styles.reviewsList}>
              {reviews.reviews.map((review) => (
                <div key={review.reviewId} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>{review.memberName}</span>
                      {review.isMyReview && (
                        <span className={styles.myReviewBadge}>내 리뷰</span>
                      )}
                    </div>
                    <div className={styles.reviewRating}>
                      {'⭐'.repeat(review.rating)}
                    </div>
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className={styles.reviewContent}>
                    <h4 className={styles.reviewTitle}>{review.title}</h4>
                    <p className={styles.reviewComment}>{review.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>아직 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default ExpoReviews;
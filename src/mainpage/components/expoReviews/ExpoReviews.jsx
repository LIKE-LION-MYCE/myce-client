import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { reviewAPI } from '../../../api/service/review/ReviewService';
import ReviewForm from '../review/ReviewForm';
import Pagination from '../../../common/components/pagination/Pagination';
import styles from './ExpoReviews.module.css';

const ExpoReviews = ({ expoId, userInfo }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [canWriteReview, setCanWriteReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  // 백엔드에서 제공하는 전체 통계
  const [averageRating, setAverageRating] = useState(0);
  const [ratingSummary, setRatingSummary] = useState({
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
  });

  useEffect(() => {
    fetchReviews();
    if (userInfo) {
      checkReviewPermission();
    }
  }, [expoId, currentPage, sortBy, userInfo]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewAPI.getReviewsByExpo(expoId, sortBy, currentPage, 5);
      console.log('리뷰 API 응답:', response);
      if (response.success) {
        console.log('리뷰 데이터:', response.data);
        console.log('총 리뷰 개수:', response.data.totalElements);
        setReviews(response.data.reviews);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        
        // 전체 통계 설정
        setAverageRating(response.data.averageRating || 0);
        setRatingSummary(response.data.ratingSummary || {
          fiveStars: 0,
          fourStars: 0,
          threeStars: 0,
          twoStars: 0,
          oneStars: 0,
        });
      }
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewPermission = async () => {
    try {
      const [attendanceResponse, reviewedResponse] = await Promise.all([
        reviewAPI.checkAttendance(expoId),
        reviewAPI.checkReviewed(expoId)
      ]);
      
      if (attendanceResponse.success && reviewedResponse.success) {
        setCanWriteReview(attendanceResponse.data && !reviewedResponse.data);
        setHasReviewed(reviewedResponse.data);
      }
    } catch (error) {
      console.error('리뷰 권한 확인 실패:', error);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      if (editingReview) {
        const response = await reviewAPI.updateReview(editingReview.id, reviewData);
        if (response.success) {
          alert(t('expoDetail.expoReviews.messages.reviewUpdated', '리뷰가 수정되었습니다.'));
          setEditingReview(null);
        }
      } else {
        const response = await reviewAPI.createReview({ ...reviewData, expoId });
        if (response.success) {
          alert(t('expoDetail.expoReviews.messages.reviewCreated', '리뷰가 작성되었습니다.'));
          setCanWriteReview(false);
          setHasReviewed(true);
        }
      }
      setShowForm(false);
      await fetchReviews();
    } catch (error) {
      console.error('리뷰 처리 실패:', error);
      alert(error.response?.data?.message || t('expoDetail.expoReviews.messages.reviewError', '리뷰 처리 중 오류가 발생했습니다.'));
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(t('expoDetail.expoReviews.confirmDelete', '정말로 이 리뷰를 삭제하시겠습니까?'))) {
      return;
    }

    try {
      const response = await reviewAPI.deleteReview(reviewId);
      if (response.success) {
        alert(t('expoDetail.expoReviews.messages.reviewDeleted', '리뷰가 삭제되었습니다.'));
        setCanWriteReview(true);
        setHasReviewed(false);
        await fetchReviews();
      }
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert(error.response?.data?.message || t('expoDetail.expoReviews.messages.deleteError', '리뷰 삭제 중 오류가 발생했습니다.'));
    }
  };
  return (
    <div className={styles.reviewsSection}>
      <div className={styles.reviewHeader}>
        <h3>{t('expoDetail.expoReviews.titleWithCount', '리뷰 ({{count}})', { count: totalElements })}</h3>
        
        <div className={styles.headerActions}>
          <div className={styles.sortButtons}>
            <button 
              className={`${styles.sortBtn} ${sortBy === 'latest' ? styles.active : ''}`}
              onClick={() => handleSortChange('latest')}
            >
              {t('expoDetail.expoReviews.sortOptions.latest', '최신순')}
            </button>
            <button 
              className={`${styles.sortBtn} ${sortBy === 'rating' ? styles.active : ''}`}
              onClick={() => handleSortChange('rating')}
            >
              {t('expoDetail.expoReviews.sortOptions.rating', '평점순')}
            </button>
          </div>

          {userInfo && canWriteReview && (
            <button 
              className={styles.writeBtn}
              onClick={() => {
                setEditingReview(null);
                setShowForm(true);
              }}
            >
              {t('expoDetail.expoReviews.writeReview', '리뷰 작성')}
            </button>
          )}
        </div>
      </div>

      {userInfo && !canWriteReview && !hasReviewed && (
        <div className={styles.noPermissionMessage}>
          {t('expoDetail.expoReviews.noPermissionMessage', '박람회에 참석한 후 리뷰를 작성할 수 있습니다.')}
        </div>
      )}

      {showForm && (
        <ReviewForm
          initialData={editingReview}
          onSubmit={handleReviewSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingReview(null);
          }}
        />
      )}

      {loading ? (
        <div className={styles.loading}>{t('expoDetail.expoReviews.loading', '리뷰를 불러오는 중...')}</div>
      ) : (
        <>
          {reviews.length > 0 ? (
            <>
              <div className={styles.reviewStats}>
                <p>{t('expoDetail.expoReviews.averageRating', '평균 평점')}: ⭐ {averageRating.toFixed(1)}</p>
                <p>{t('expoDetail.expoReviews.totalReviews', '총 리뷰 수')}: {t('expoDetail.expoReviews.reviewsCount', '{{count}}개', { count: totalElements })}</p>
                
                {/* 별점별 분포 */}
                <div className={styles.ratingSummary}>
                  <div className={styles.ratingBar}>
                    <span>{t('expoDetail.expoReviews.ratingLabels.fiveStars', '5점')}</span>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.bar} 
                        style={{width: `${totalElements > 0 ? (ratingSummary.fiveStars / totalElements) * 100 : 0}%`}}
                      ></div>
                    </div>
                    <span>{ratingSummary.fiveStars}</span>
                  </div>
                  <div className={styles.ratingBar}>
                    <span>{t('expoDetail.expoReviews.ratingLabels.fourStars', '4점')}</span>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.bar} 
                        style={{width: `${totalElements > 0 ? (ratingSummary.fourStars / totalElements) * 100 : 0}%`}}
                      ></div>
                    </div>
                    <span>{ratingSummary.fourStars}</span>
                  </div>
                  <div className={styles.ratingBar}>
                    <span>{t('expoDetail.expoReviews.ratingLabels.threeStars', '3점')}</span>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.bar} 
                        style={{width: `${totalElements > 0 ? (ratingSummary.threeStars / totalElements) * 100 : 0}%`}}
                      ></div>
                    </div>
                    <span>{ratingSummary.threeStars}</span>
                  </div>
                  <div className={styles.ratingBar}>
                    <span>{t('expoDetail.expoReviews.ratingLabels.twoStars', '2점')}</span>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.bar} 
                        style={{width: `${totalElements > 0 ? (ratingSummary.twoStars / totalElements) * 100 : 0}%`}}
                      ></div>
                    </div>
                    <span>{ratingSummary.twoStars}</span>
                  </div>
                  <div className={styles.ratingBar}>
                    <span>{t('expoDetail.expoReviews.ratingLabels.oneStars', '1점')}</span>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.bar} 
                        style={{width: `${totalElements > 0 ? (ratingSummary.oneStars / totalElements) * 100 : 0}%`}}
                      ></div>
                    </div>
                    <span>{ratingSummary.oneStars}</span>
                  </div>
                </div>
                
                {/* 리뷰 목록 */}
                <div className={styles.reviewsList}>
                  {reviews.map((review) => (
                    <div key={review.id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerInfo}>
                          <span className={styles.reviewerName}>{review.memberName}</span>
                          {userInfo && userInfo.id === review.memberId && (
                            <span className={styles.myReviewBadge}>{t('expoDetail.expoReviews.myReviewBadge', '내 리뷰')}</span>
                          )}
                        </div>
                        <div className={styles.reviewRating}>
                          {'⭐'.repeat(review.rating)}
                        </div>
                        <div className={styles.reviewMeta}>
                          <span className={styles.reviewDate}>
                            {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                            {review.updatedAt !== review.createdAt && ` ${t('expoDetail.expoReviews.modified', '(수정됨)')}`}
                          </span>
                          {userInfo && userInfo.id === review.memberId && (
                            <div className={styles.reviewActions}>
                              <button 
                                className={styles.editBtn}
                                onClick={() => handleEditReview(review)}
                              >
                                {t('expoDetail.expoReviews.editReview', '수정')}
                              </button>
                              <button 
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                {t('expoDetail.expoReviews.deleteReview', '삭제')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.reviewContent}>
                        <h4 className={styles.reviewTitle}>{review.title}</h4>
                        <p className={styles.reviewComment}>{review.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <Pagination
                  pageInfo={{
                    totalPages: totalPages,
                    number: currentPage
                  }}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <p>{t('expoDetail.expoReviews.noReviews', '아직 리뷰가 없습니다.')}</p>
          )}
        </>
      )}
    </div>
  );
};

export default ExpoReviews;
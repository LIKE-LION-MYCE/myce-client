import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../../../api/service/review/ReviewService';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import Pagination from '../../../common/components/pagination/Pagination';
import styles from './Review.module.css';

const ReviewList = ({ expoId, userInfo }) => {
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

  useEffect(() => {
    fetchReviews();
    if (userInfo) {
      checkReviewPermission();
    }
  }, [expoId, currentPage, sortBy, userInfo]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewAPI.getReviewsByExpo(expoId, sortBy, currentPage, 10);
      if (response.success) {
        setReviews(response.data.reviews);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
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
          alert('리뷰가 수정되었습니다.');
          setEditingReview(null);
        }
      } else {
        const response = await reviewAPI.createReview({ ...reviewData, expoId });
        if (response.success) {
          alert('리뷰가 작성되었습니다.');
          setCanWriteReview(false);
          setHasReviewed(true);
        }
      }
      setShowForm(false);
      await fetchReviews();
    } catch (error) {
      console.error('리뷰 처리 실패:', error);
      alert(error.response?.data?.message || '리뷰 처리 중 오류가 발생했습니다.');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await reviewAPI.deleteReview(reviewId);
      if (response.success) {
        alert('리뷰가 삭제되었습니다.');
        setCanWriteReview(true);
        setHasReviewed(false);
        await fetchReviews();
      }
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert(error.response?.data?.message || '리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewHeader}>
        <h3>리뷰 ({totalElements})</h3>
        
        <div className={styles.headerActions}>
          <div className={styles.sortButtons}>
            <button 
              className={`${styles.sortBtn} ${sortBy === 'latest' ? styles.active : ''}`}
              onClick={() => handleSortChange('latest')}
            >
              최신순
            </button>
            <button 
              className={`${styles.sortBtn} ${sortBy === 'rating' ? styles.active : ''}`}
              onClick={() => handleSortChange('rating')}
            >
              평점순
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
              리뷰 작성
            </button>
          )}
        </div>
      </div>

      {userInfo && !canWriteReview && !hasReviewed && (
        <div className={styles.noPermissionMessage}>
          박람회에 참석한 후 리뷰를 작성할 수 있습니다.
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
        <div className={styles.loading}>리뷰를 불러오는 중...</div>
      ) : (
        <>
          <div className={styles.reviewList}>
            {reviews.length > 0 ? (
              reviews.map(review => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  currentUserId={userInfo?.id}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))
            ) : (
              <div className={styles.noReviews}>
                아직 작성된 리뷰가 없습니다.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
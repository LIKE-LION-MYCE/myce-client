import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { reviewAPI } from '../../../api/service/review/ReviewService';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import Pagination from '../../../common/components/pagination/Pagination';
import styles from './Review.module.css';

const ReviewList = ({ expoId, userInfo }) => {
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
      console.error(t('components.review.list.errors.fetchFailed'), error);
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
      console.error(t('components.review.list.errors.permissionCheckFailed'), error);
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
          alert(t('components.review.list.alerts.updated'));
          setEditingReview(null);
        }
      } else {
        const response = await reviewAPI.createReview({ ...reviewData, expoId });
        if (response.success) {
          alert(t('components.review.list.alerts.created'));
          setCanWriteReview(false);
          setHasReviewed(true);
        }
      }
      setShowForm(false);
      await fetchReviews();
    } catch (error) {
      console.error(t('components.review.list.errors.processFailed'), error);
      alert(error.response?.data?.message || t('components.review.list.alerts.error'));
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(t('components.review.list.alerts.deleteConfirm'))) {
      return;
    }

    try {
      const response = await reviewAPI.deleteReview(reviewId);
      if (response.success) {
        alert(t('components.review.list.alerts.deleted'));
        setCanWriteReview(true);
        setHasReviewed(false);
        await fetchReviews();
      }
    } catch (error) {
      console.error(t('components.review.list.errors.deleteFailed'), error);
      alert(error.response?.data?.message || t('components.review.list.alerts.error'));
    }
  };

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewHeader}>
        <h3>{t('components.review.list.title')} ({totalElements})</h3>
        
        <div className={styles.headerActions}>
          <div className={styles.sortButtons}>
            <button 
              className={`${styles.sortBtn} ${sortBy === 'latest' ? styles.active : ''}`}
              onClick={() => handleSortChange('latest')}
            >
              {t('components.review.list.sort.latest')}
            </button>
            <button 
              className={`${styles.sortBtn} ${sortBy === 'rating' ? styles.active : ''}`}
              onClick={() => handleSortChange('rating')}
            >
              {t('components.review.list.sort.rating')}
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
              {t('components.review.list.buttons.write')}
            </button>
          )}
        </div>
      </div>

      {userInfo && !canWriteReview && !hasReviewed && (
        <div className={styles.noPermissionMessage}>
          {t('components.review.list.messages.noPermission')}
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
        <div className={styles.loading}>{t('components.review.list.messages.loading')}</div>
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
                {t('components.review.list.messages.noReviews')}
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
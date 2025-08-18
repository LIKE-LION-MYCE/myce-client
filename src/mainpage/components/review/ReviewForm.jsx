import React, { useState, useEffect } from 'react';
import styles from './Review.module.css';

const ReviewForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        rating: initialData.rating
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    onSubmit(formData);
  };

  const renderStarRating = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          className={`${styles.starButton} ${starValue <= formData.rating ? styles.selected : ''}`}
          onClick={() => handleRatingChange(starValue)}
        >
          ★
        </button>
      );
    });
  };

  return (
    <div className={styles.reviewFormContainer}>
      <div className={styles.reviewFormHeader}>
        <h4>{initialData ? '리뷰 수정' : '리뷰 작성'}</h4>
      </div>

      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <div className={styles.formGroup}>
          <label htmlFor="rating" className={styles.label}>
            평점 <span className={styles.required}>*</span>
          </label>
          <div className={styles.ratingContainer}>
            {renderStarRating()}
            <span className={styles.ratingText}>{formData.rating}점</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            제목 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="리뷰 제목을 입력해주세요"
            maxLength={100}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            리뷰 내용 <span className={styles.required}>*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="박람회에 대한 솔직한 리뷰를 작성해주세요"
            rows={6}
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelBtn}
          >
            취소
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
          >
            {initialData ? '수정' : '작성'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
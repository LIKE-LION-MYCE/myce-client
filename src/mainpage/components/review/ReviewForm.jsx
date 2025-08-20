import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Review.module.css';

const ReviewForm = ({ initialData, onSubmit, onCancel }) => {
  const { t } = useTranslation();
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
      alert(t('components.review.form.alerts.titleRequired'));
      return;
    }
    
    if (!formData.content.trim()) {
      alert(t('components.review.form.alerts.contentRequired'));
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
        <h4>{initialData ? t('components.review.form.title.edit') : t('components.review.form.title.create')}</h4>
      </div>

      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <div className={styles.formGroup}>
          <label htmlFor="rating" className={styles.label}>
            {t('components.review.form.rating.label')} <span className={styles.required}>{t('components.review.form.required')}</span>
          </label>
          <div className={styles.ratingContainer}>
            {renderStarRating()}
            <span className={styles.ratingText}>{formData.rating}{t('components.review.form.rating.points')}</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            {t('components.review.form.title.label')} <span className={styles.required}>{t('components.review.form.required')}</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={styles.input}
            placeholder={t('components.review.form.title.placeholder')}
            maxLength={100}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            {t('components.review.form.content.label')} <span className={styles.required}>{t('components.review.form.required')}</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder={t('components.review.form.content.placeholder')}
            rows={6}
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelBtn}
          >
            {t('components.review.form.buttons.cancel')}
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
          >
            {initialData ? t('components.review.form.buttons.edit') : t('components.review.form.buttons.create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
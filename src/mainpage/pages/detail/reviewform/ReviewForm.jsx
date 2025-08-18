import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewAPI } from '../../../../api/service/review/ReviewService';
import styles from './ReviewForm.module.css';

export default function ReviewForm() {
  const { expoId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [canWriteReview, setCanWriteReview] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, [expoId]);

  const checkPermissions = async () => {
    try {
      const [attendanceResponse, reviewedResponse] = await Promise.all([
        reviewAPI.checkAttendance(expoId),
        reviewAPI.checkReviewed(expoId)
      ]);
      
      if (attendanceResponse.success && reviewedResponse.success) {
        const canWrite = attendanceResponse.data && !reviewedResponse.data;
        if (!canWrite) {
          alert('박람회에 참석하지 않았거나 이미 리뷰를 작성하셨습니다.');
          navigate(-1);
          return;
        }
        setCanWriteReview(true);
      }
    } catch (error) {
      console.error('권한 확인 실패:', error);
      alert('권한 확인 중 오류가 발생했습니다.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.trim() !== '') {
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setErrorMsg('제목을 입력해주세요.');
      return;
    }
    
    if (!content.trim()) {
      setErrorMsg('내용을 입력해주세요.');
      return;
    }

    if (rating === 0) {
      setErrorMsg('평점을 선택해주세요.');
      return;
    }

    try {
      const response = await reviewAPI.createReview({
        expoId: parseInt(expoId),
        title: title.trim(),
        content: content.trim(),
        rating
      });
      
      if (response.success) {
        alert('리뷰가 성공적으로 등록되었습니다!');
        navigate(`/detail/${expoId}`);
      }
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert(error.response?.data?.message || '리뷰 작성 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>권한 확인 중...</div>
      </main>
    );
  }

  if (!canWriteReview) {
    return null;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>행사 리뷰 작성</h1>
      <p className={styles.subtitle}>참여하신 행사에 대한 소중한 리뷰를 남겨주세요.</p>

      <form className={styles.form} onSubmit={handleSubmit}>

        {/* 평점 */}
        <div className={styles.formGroup}>
          <label>
            평점 <span className={styles.required}>*</span>
          </label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${rating >= star ? styles.active : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div className={styles.formGroup}>
          <label htmlFor="title">
            제목 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            maxLength={100}
            placeholder="리뷰 제목을 입력해주세요"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 리뷰 내용 */}
        <div className={styles.formGroup}>
          <label htmlFor="content">
            리뷰 내용 <span className={styles.required}>*</span>
          </label>
          <textarea
            id="content"
            maxLength={500}
            placeholder="리뷰 내용을 입력해주세요"
            className={styles.textarea}
            value={content}
            onChange={handleContentChange}
          />
          <div className={styles.charCount}>{content.length}/500</div>
          {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
        </div>

        {/* 가이드라인 */}
        <div className={styles.guide}>
          <h3>후기 작성 가이드라인</h3>
          <ul>
            <li>행사 내용, 진행, 시설 등에 대한 구체적인 경험을 공유해주세요</li>
            <li>다른 참가자들에게 도움이 될 수 있는 팁이나 정보를 포함해주세요</li>
            <li>개인정보나 부적절한 내용은 포함하지 말아주세요</li>
            <li>건설적이고 정중한 표현으로 작성해주세요</li>
          </ul>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitBtn}>
            리뷰 등록
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </form>
    </main>
  );
}

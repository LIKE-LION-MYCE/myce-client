import React, { useState } from 'react';
import styles from './ReviewForm.module.css';

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.trim() !== '') {
      setErrorMsg('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (content.trim() === '') {
      setErrorMsg('내용은 빈칸이 되어선 안됩니다.');
      return;
    }

    // TODO: API POST 로직 추가
    alert('후기가 정상적으로 등록되었습니다!');
    setContent('');
    setRating(0);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>행사 후기 작성</h1>
      <p className={styles.subtitle}>참여하신 행사에 대한 소중한 후기를 남겨주세요.</p>

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

        {/* 후기 내용 */}
        <div className={styles.formGroup}>
          <label htmlFor="content">
            후기 내용 <span className={styles.required}>*</span>
          </label>
          <textarea
            id="content"
            maxLength={500}
            placeholder="후기 내용을 입력해주세요"
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
            후기 등록
          </button>
          <button type="button" className={styles.cancelBtn}>
            취소
          </button>
        </div>
      </form>
    </main>
  );
}

// ExpoForm.jsx
import React, { useState, useRef } from 'react';
import styles from './ExpoForm.module.css';

// onNextPage prop을 받도록 수정
const ExpoForm = ({ onNextPage, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    expoName: '',
    description: '',
    fairStartDate: '',
    fairEndDate: '',
    postStartDate: '',
    postEndDate: '',
    location: '',
    openingHours: '',
    // 기타 필요한 필드 추가
  });
  // 포스터 파일 입력 참조
  const posterInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    // 포스터 파일 변경 핸들러
  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        posterFile: file,
      }));
    }
  };

  // 이미지 업로드 버튼 클릭 시 숨겨진 input을 클릭하도록 하는 함수
  const handleFileUploadClick = () => {
    posterInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('폼 제출 데이터:', formData);
    // prop으로 받은 onNextPage 함수를 호출
    if (onNextPage) {
      onNextPage(formData);
    }
  };

  return (
    <div className={styles['form-container']}>
      {/* <form> 태그를 추가하고, onSubmit 이벤트를 연결합니다. */}
      <form onSubmit={handleSubmit}>
        <h1 className={styles['title']}>박람회 신청</h1>
        <p className={styles['subtitle']}>박람회 기본정보를 입력해주세요.</p>

        <h2 className={styles['section-title']}>박람회 포스터</h2>
        <div className={styles['poster-upload-group']}>
          <button
            type="button"
            className={styles['upload-button']}
            onClick={handleFileUploadClick}
          >
            {formData.posterFile ? formData.posterFile.name : '이미지 업로드'}
          </button>
          <p className={styles['upload-info']}>JPG, PNG 파일들을 업로드해주세요 (최대 10MB)</p>
          <input
            type="file"
            id="posterFile"
            name="posterFile"
            ref={posterInputRef}
            onChange={handlePosterFileChange}
            style={{ display: 'none' }}
            accept=".jpg, .jpeg, .png"
          />
        </div>

        {/* 박람회 이름 */}
        <div className={styles['form-group']}>
          <label htmlFor="expoName">박람회 이름</label>
          <input
            type="text"
            id="expoName"
            name="expoName"
            value={formData.expoName}
            onChange={handleChange}
            className={styles['input-field']}
            placeholder="박람회 이름을 입력해주세요."
          />
        </div>

        {/* 박람회 개최기간 */}
        <div className={styles['form-group']}>
          <label>박람회 개최기간</label>
          <div className={styles['date-range-group']}>
            <input
              type="date"
              name="fairStartDate"
              value={formData.fairStartDate}
              onChange={handleChange}
              className={styles['input-field']}
            />
            <span>-</span>
            <input
              type="date"
              name="fairEndDate"
              value={formData.fairEndDate}
              onChange={handleChange}
              className={styles['input-field']}
            />
          </div>
        </div>

        {/* 박람회 게시기간 */}
        <div className={styles['form-group']}>
          <label>박람회 게시기간</label>
          <div className={styles['date-range-group']}>
            <input
              type="date"
              name="postStartDate"
              value={formData.postStartDate}
              onChange={handleChange}
              className={styles['input-field']}
            />
            <span>-</span>
            <input
              type="date"
              name="postEndDate"
              value={formData.postEndDate}
              onChange={handleChange}
              className={styles['input-field']}
            />
          </div>
        </div>

        {/* 박람회 장소 */}
        <div className={styles['form-group']}>
          <label htmlFor="location">박람회 장소</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles['input-field']}
            placeholder="박람회 장소를 입력해주세요."
          />
        </div>
        
        {/* 박람회 운영시간 */}
        <div className={styles['form-group']}>
          <label htmlFor="openingHours">박람회 운영시간</label>
          <input
            type="text"
            id="openingHours"
            name="openingHours"
            value={formData.openingHours}
            onChange={handleChange}
            className={styles['input-field']}
            placeholder="예) 10:00 ~ 18:00"
          />
        </div>

        {/* '다음 페이지' 버튼은 form 태그 안에 있어야 합니다. */}
        <div className={styles['submit-button-group']}>
          <button type="submit" className={styles['submit-button']}>다음 페이지</button>
        </div>
      </form>
    </div>
  );
};

export default ExpoForm;
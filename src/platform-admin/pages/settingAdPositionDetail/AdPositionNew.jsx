import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AdPositionNew.module.css';
import { submitNew } from '../../../api/service/platform-admin/setting/AdPositionSettingService';

function AdPositionNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bannerName: '',
    imageWidth: '',
    imageHeight: '',
    maxBannerCount: '',
    active: false, // Correct initial state key
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await submitNew({
        formData: formData
      });
      window.alert("새 배너 타입을 생성했습니다.");
      navigate(-1);
      console.log('생성 성공:', response);
    } catch (error) {
      window.alert("입력값을 확인해 주세요.")
      console.error('생성 실패:', error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Corrected handleToggle function
  const handleToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      active: !prevData.active, // Toggles the correct key
    }));
  };

  const handleCancel = () => {
    navigate(-1);
  }

  return (
    <div className={styles.bannerSettings}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.heading}>배너 타입 설정</h2>
        <button className={styles.backArrow} onClick={handleBack}>←</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>광고 위치 이름</label>
          <input
            className={`${styles.input} ${styles.inputText}`}
            id="bannerName"
            type="text"
            name="bannerName"
            value={formData.bannerName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>이미지 너비</label>
          <input
            className={`${styles.input} ${styles.inputNumber}`}
            id="bannerWidth"
            type="text"
            name="bannerWidth"
            value={formData.bannerWidth}
            onChange={handleChange}
            placeholder="px"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>이미지 높이</label>
          <input
            className={`${styles.input} ${styles.inputNumber}`}
            id="bannerHeight"
            type="text"
            name="bannerHeight"
            value={formData.bannerHeight}
            onChange={handleChange}
            placeholder="px"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>최대 광고 개수</label>
          <input
            className={`${styles.input} ${styles.inputNumber}`}
            id="maxBannerCount"
            type="text"
            name="maxBannerCount"
            value={formData.maxBannerCount}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>활성화 여부</label>
          <label className={styles.toggleWrapper}>
            <input
              type="checkbox"
              id="isActive"
              checked={formData.active} // Corrected to reference 'isActive'
              className={styles.toggleInput}
              onChange={handleToggle}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>생성</button>
          <button type="button" onClick={handleCancel} className={styles.btnCancel}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default AdPositionNew;
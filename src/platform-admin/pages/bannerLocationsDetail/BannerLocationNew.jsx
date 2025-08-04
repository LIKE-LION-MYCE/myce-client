import React, { useState } from 'react';
import styles from './BannerLocationNew.module.css';

function BannerLocationDetail() {
  const [formData, setFormData] = useState({
    bannerName: '',
    imageWidth: '',
    imageHeight: '',
    maxBannerCount: '',
    isActive: false,
    creationDate: '',
    modificationDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      isActive: !prevData.isActive,
    }));
  };

  return (
    <div className={styles.bannerSettings}>
      <h2 className={styles.heading}>배너 타입 설정</h2>
      <form>
        <div className={styles.formGroup}>
          <label className={styles.label}>광고 위치 이름</label>
          <input
            className={styles.input}
            type="text"
            name="bannerName"
            value={formData.bannerName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>이미지 너비</label>
          <input
            className={styles.input}
            type="text"
            name="imageWidth"
            value={formData.imageWidth}
            onChange={handleChange}
            placeholder="px"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>이미지 높이</label>
          <input
            className={styles.input}
            type="text"
            name="imageHeight"
            value={formData.imageHeight}
            onChange={handleChange}
            placeholder="px"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>최대 광고 개수</label>
          <input
            className={styles.input}
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
                checked={formData.isActive}
                className={styles.toggleInput}
                onChange={() => handleToggle()}
            />
          <span className={styles.toggleSlider}></span>
        </label>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>적용</button>
          <button type="button" className={styles.btnDanger}>삭제</button>
        </div>
      </form>
    </div>
  );
}

export default BannerLocationDetail;

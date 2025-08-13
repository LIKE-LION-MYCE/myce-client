import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AdPositionDetail.module.css';
import { fetchDetail, submitUpdate } from '../../../api/service/platform-admin/setting/AdPositionSettingService';

function AdPositionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    bannerName: '-',
    imageWidth: '-',
    imageHeight: '-',
    maxBannerCount: '-',
    active: false, // Correct initial state key
    createdAt: '-',
    updatedAt: '-',
  });

  const getData = async () => {
    const res = await fetchDetail(id);
    console.log(res.data);
    setFormData(res.data);
  };

  useEffect(() => {
    getData();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Corrected handleToggle function
  const handleToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      active: !prevData.active, // Toggles the correct key
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await submitUpdate({
        bannerId: id,
        formData: formData
      });
      window.alert("배너 타입 수정을 성공했습니다.");
      console.log('업데이트 성공:', response);
    } catch (error) {
      console.error('업데이트 실패:', error);
    }
  };

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

        <div className={styles.formGroup}>
          <label className={styles.label}>생성일시</label>
          <div className={styles.staticText}>{formData.createdAt.substring(0,10)}</div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>수정일시</label>
          <div className={styles.staticText}>{formData.updatedAt.substring(0,10)}</div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>적용</button>
          <button type="button" className={styles.btnDanger}>삭제</button>
        </div>
      </form>
    </div>
  );
}

export default AdPositionDetail;
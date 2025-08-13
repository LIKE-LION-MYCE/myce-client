import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './AdPositionDetail.module.css';
import { fetchDetail } from '../../../api/service/platform-admin/setting/AdPositionSettingService';

function AdPositionDetail() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    bannerName: '배너 제목A',
    imageWidth: '800',
    imageHeight: '200',
    maxBannerCount: '5',
    isActive: false,
    createdAt: '2023-10-01 12:00',
    updatedAt: '2023-10-02 14:30',
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
            className={`${styles.input} ${styles.inputText}`}
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
            className={`${styles.input} ${styles.inputNumber}`}
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
            className={`${styles.input} ${styles.inputNumber}`}
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
              onChange={handleToggle}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>생성일시</label>
          <div className={styles.staticText}>{formData.createdAt}</div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>수정일시</label>
          <div className={styles.staticText}>{formData.updatedAt}</div>
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
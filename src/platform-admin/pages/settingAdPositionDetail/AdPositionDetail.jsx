import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AdPositionDetail.module.css';
import {
  fetchDetail,
  submitDelete,
  submitUpdate,
} from '../../../api/service/platform-admin/setting/AdPositionSettingService';

import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';

function AdPositionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    bannerName: '',
    bannerWidth: '',
    bannerHeight: '',
    maxBannerCount: '',
    active: false,
    createdAt: '',
    updatedAt: '',
  });

  const [errors, setErrors] = useState({});
  const refs = {
    bannerName: useRef(null),
    bannerWidth: useRef(null),
    bannerHeight: useRef(null),
    maxBannerCount: useRef(null),
  };

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);

  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };
  const triggerToastFail = () => {
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 2000);
  };

  const getData = async () => {
    try {
      const res = await fetchDetail(id);
      const data = res?.data || {};
      setFormData({
        bannerName: data.bannerName ?? '',
        bannerWidth: data.bannerWidth ?? '',
        bannerHeight: data.bannerHeight ?? '',
        maxBannerCount: data.maxBannerCount ?? '',
        active: !!data.active,
        createdAt: data.createdAt ?? '',
        updatedAt: data.updatedAt ?? '',
      });
      setErrors({});
    } catch (e) {
      console.error('상세 조회 실패:', e);
      triggerToastFail();
    }
  };

  useEffect(() => {
    if (id) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBack = () => navigate(-1);

  const numKeys = useMemo(
    () => new Set(['bannerWidth', 'bannerHeight', 'maxBannerCount']),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextVal = value;
    if (numKeys.has(name)) nextVal = value.replace(/[^\d]/g, '');
    setFormData((prev) => ({ ...prev, [name]: nextVal }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, active: !prev.active }));
  };

  const isBlank = (s) => s === null || s === undefined || String(s).trim() === '';

  const runValidation = () => {
    const e = {};
    const f = formData;

    if (isBlank(f.bannerName)) e.bannerName = '광고 위치 이름은 필수입니다.';

    if (isBlank(f.bannerWidth)) e.bannerWidth = '이미지 너비(px)는 필수입니다.';
    else if (isNaN(Number(f.bannerWidth))) e.bannerWidth = '이미지 너비는 숫자여야 합니다.';
    else if (Number(f.bannerWidth) <= 0) e.bannerWidth = '이미지 너비는 1 이상이어야 합니다.';

    if (isBlank(f.bannerHeight)) e.bannerHeight = '이미지 높이(px)는 필수입니다.';
    else if (isNaN(Number(f.bannerHeight))) e.bannerHeight = '이미지 높이는 숫자여야 합니다.';
    else if (Number(f.bannerHeight) <= 0) e.bannerHeight = '이미지 높이는 1 이상이어야 합니다.';

    if (isBlank(f.maxBannerCount)) e.maxBannerCount = '최대 광고 개수는 필수입니다.';
    else if (isNaN(Number(f.maxBannerCount))) e.maxBannerCount = '최대 광고 개수는 숫자여야 합니다.';
    else if (Number(f.maxBannerCount) < 1) e.maxBannerCount = '최대 광고 개수는 1 이상이어야 합니다.';

    return e;
  };

  const focusFirstError = (e) => {
    const order = ['bannerName', 'bannerWidth', 'bannerHeight', 'maxBannerCount'];
    for (const key of order) {
      if (e[key]) {
        refs[key]?.current?.focus?.();
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eMap = runValidation();
    setErrors(eMap);
    if (Object.values(eMap).some(Boolean)) {
      focusFirstError(eMap);
      return;
    }

    try {
      const payload = {
        bannerId: id,
        formData: {
          ...formData,
          bannerWidth: formData.bannerWidth === '' ? null : Number(formData.bannerWidth),
          bannerHeight: formData.bannerHeight === '' ? null : Number(formData.bannerHeight),
          maxBannerCount: formData.maxBannerCount === '' ? null : Number(formData.maxBannerCount),
        },
      };
      await submitUpdate(payload);
      triggerSuccessToast();
      await getData();
    } catch (error) {
      console.error('업데이트 실패:', error);
      triggerToastFail();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠어요?')) return;
    try {
      await submitDelete({ bannerId: id });
      triggerSuccessToast();
      setTimeout(() => navigate(-1), 600);
    } catch (error) {
      console.error('삭제 실패:', error);
      triggerToastFail();
    }
  };

  const createdDate = (formData.createdAt || '').toString().slice(0, 10);
  const updatedDate = (formData.updatedAt || '').toString().slice(0, 10);

  return (
    <div className={styles.operatorContainer}>
      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail />}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <button className={styles.backArrow} onClick={handleBack}>←</button>
          <h4 className={styles.sectionTitle}>배너 타입 설정</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formFlat}>
            <div className={styles.formGroup}>
              <label className={styles.label}>광고 위치 이름</label>
              <input
                ref={refs.bannerName}
                className={`${styles.input} ${styles.inputText}`}
                id="bannerName"
                type="text"
                name="bannerName"
                value={formData.bannerName ?? ''}
                onChange={handleChange}
                placeholder="예) 메인 상단 배너"
                aria-invalid={!!errors.bannerName}
              />
              {errors.bannerName && <p className={styles.errorText}>{errors.bannerName}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>이미지 너비</label>
              <input
                ref={refs.bannerWidth}
                className={`${styles.input} ${styles.inputNumber}`}
                id="bannerWidth"
                type="number"
                name="bannerWidth"
                value={formData.bannerWidth ?? ''}
                onChange={handleChange}
                min={0}
                placeholder="예) 1400"
                aria-invalid={!!errors.bannerWidth}
              />
              {errors.bannerWidth && <p className={styles.errorText}>{errors.bannerWidth}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>이미지 높이(px)</label>
              <input
                ref={refs.bannerHeight}
                className={`${styles.input} ${styles.inputNumber}`}
                id="bannerHeight"
                type="number"
                name="bannerHeight"
                value={formData.bannerHeight ?? ''}
                onChange={handleChange}
                min={0}
                placeholder="예) 400"
                aria-invalid={!!errors.bannerHeight}
              />
              {errors.bannerHeight && <p className={styles.errorText}>{errors.bannerHeight}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>최대 광고 개수</label>
              <input
                ref={refs.maxBannerCount}
                className={`${styles.input} ${styles.inputNumber}`}
                id="maxBannerCount"
                type="number"
                name="maxBannerCount"
                value={formData.maxBannerCount ?? ''}
                onChange={handleChange}
                min={1}
                placeholder="예) 4"
                aria-invalid={!!errors.maxBannerCount}
              />
              {errors.maxBannerCount && (
                <p className={styles.errorText}>{errors.maxBannerCount}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>활성화 여부</label>
              <label className={styles.toggleWrapper}>
                <input
                  type="checkbox"
                  id="active"
                  checked={!!formData.active}
                  className={styles.toggleInput}
                  onChange={handleToggle}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>생성일시</label>
              <div>{createdDate || '-'}</div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>수정일시</label>
              <div>{updatedDate || '-'}</div>
            </div>
          </div>

          <div className={styles.buttonGroupBottom}>
            <button type="submit" className={styles.editBtn}>수정</button>
            <button type="button" className={styles.deleteBtn} onClick={handleDelete}>삭제</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdPositionDetail;
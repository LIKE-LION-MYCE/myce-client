import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './AdPositionNew.module.css';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { submitNew } from '../../../api/service/platform-admin/setting/AdPositionSettingService';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';

function AdPositionNew({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    bannerName: '',
    bannerWidth: '',
    bannerHeight: '',
    maxBannerCount: '',
    active: false,
  });

  const [errors, setErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);

  const refs = {
    bannerName: useRef(null),
    bannerWidth: useRef(null),
    bannerHeight: useRef(null),
    maxBannerCount: useRef(null),
  };

  const numKeys = useMemo(
    () => new Set(['bannerWidth', 'bannerHeight', 'maxBannerCount']),
    []
  );

  useEffect(() => {
    if (!open) return;
    setForm({
      bannerName: '',
      bannerWidth: '',
      bannerHeight: '',
      maxBannerCount: '',
      active: false,
    });
    setErrors({});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 1600);
  };

  const triggerFailToast = () => {
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 1800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextVal = value;
    if (numKeys.has(name)) nextVal = value.replace(/[^\d]/g, '');
    setForm((prev) => ({ ...prev, [name]: nextVal }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleToggle = () => {
    setForm((prev) => ({ ...prev, active: !prev.active }));
  };

  const isBlank = (s) => s === null || s === undefined || String(s).trim() === '';

  const runValidation = () => {
    const e = {};
    if (isBlank(form.bannerName)) e.bannerName = '광고 위치 이름은 필수입니다.';
    if (isBlank(form.bannerWidth)) e.bannerWidth = '이미지 너비(px)는 필수입니다.';
    else if (Number(form.bannerWidth) <= 0) e.bannerWidth = '이미지 너비는 1 이상이어야 합니다.';
    if (isBlank(form.bannerHeight)) e.bannerHeight = '이미지 높이(px)는 필수입니다.';
    else if (Number(form.bannerHeight) <= 0) e.bannerHeight = '이미지 높이는 1 이상이어야 합니다.';
    if (isBlank(form.maxBannerCount)) e.maxBannerCount = '최대 광고 개수는 필수입니다.';
    else if (Number(form.maxBannerCount) < 1) e.maxBannerCount = '최대 광고 개수는 1 이상이어야 합니다.';
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
        formData: {
          bannerName: form.bannerName,
          bannerWidth: form.bannerWidth === '' ? null : Number(form.bannerWidth),
          bannerHeight: form.bannerHeight === '' ? null : Number(form.bannerHeight),
          maxBannerCount: form.maxBannerCount === '' ? null : Number(form.maxBannerCount),
          active: !!form.active,
        },
      };
      await submitNew(payload);
      triggerSuccessToast();
      onCreated?.();
      setTimeout(() => onClose?.(), 1000);
    } catch (error) {
      console.error('생성 실패:', error);
      triggerFailToast();
    }
  };

  const handleCancel = () => {
    setForm({
      bannerName: '',
      bannerWidth: '',
      bannerHeight: '',
      maxBannerCount: '',
      active: false,
    });
    setErrors({});
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail />}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>배너 등록</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <FaTimes className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formFlat}>
              <div className={styles.formGroup}>
                <label className={styles.label}>광고 위치 이름</label>
                <input
                  ref={refs.bannerName}
                  name="bannerName"
                  className={styles.inputField}
                  placeholder="예) 메인 상단 배너"
                  value={form.bannerName}
                  onChange={handleChange}
                />
                {errors.bannerName && <p className={styles.errorText}>{errors.bannerName}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>이미지 너비(px)</label>
                <input
                  ref={refs.bannerWidth}
                  type="number"
                  name="bannerWidth"
                  className={styles.inputField}
                  placeholder="예) 1400"
                  value={form.bannerWidth}
                  onChange={handleChange}
                />
                {errors.bannerWidth && <p className={styles.errorText}>{errors.bannerWidth}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>이미지 높이(px)</label>
                <input
                  ref={refs.bannerHeight}
                  type="number"
                  name="bannerHeight"
                  className={styles.inputField}
                  placeholder="예) 400"
                  value={form.bannerHeight}
                  onChange={handleChange}
                />
                {errors.bannerHeight && <p className={styles.errorText}>{errors.bannerHeight}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>최대 광고 개수</label>
                <input
                  ref={refs.maxBannerCount}
                  type="number"
                  name="maxBannerCount"
                  className={styles.inputField}
                  placeholder="예) 4"
                  value={form.maxBannerCount}
                  onChange={handleChange}
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
                    checked={!!form.active}
                    className={styles.toggleInput}
                    onChange={handleToggle}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>

            <div className={styles.buttonDivider} />
            <div className={styles.buttonGroup}>
              <button type="submit" className={`${styles.actionBtn} ${styles.submitBtn}`}>
                <FaCheckCircle className={styles.iconBtn} /> 생성
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={`${styles.actionBtn} ${styles.cancelBtn}`}
              >
                <FaTimesCircle className={styles.iconBtn} /> 취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdPositionNew;
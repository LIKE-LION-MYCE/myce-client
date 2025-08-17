import { useState, useEffect } from 'react';
import styles from './BoothSettingForm.module.css';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ImageUpload from '../../../common/components/imageUpload/ImageUpload';

function BoothSettingForm({ onSubmit, onCancel, editingBooth, expoIsPremium }) {
  const [form, setForm] = useState(initForm());

  function initForm() {
    return {
      boothNumber: '',
      name: '',
      description: '',
      mainImageUrl: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      isPremium: expoIsPremium || false,
      displayRank: '',
    };
  }

  useEffect(() => {
    if (editingBooth) {
      setForm({
        ...editingBooth,
        isPremium: expoIsPremium ? editingBooth.isPremium : false
      });
    } else {
      setForm(initForm());
    }
  }, [editingBooth, expoIsPremium]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleImageUploadSuccess = (imageUrl) => {
    setForm((prev) => ({ ...prev, mainImageUrl: imageUrl }));
  };

  const handleImageUploadError = (error) => {
    console.error('이미지 업로드 실패:', error);
  };

  const validateForm = () => {
    const requiredFields = ['name', 'boothNumber', 'contactName', 'contactPhone', 'contactEmail'];
    
    for (const field of requiredFields) {
      if (!form[field] || form[field].trim() === '') {
        return false;
      }
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.contactEmail)) {
      return false;
    }

    // 전화번호 형식 검증 (숫자와 하이픈만 허용)
    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(form.contactPhone)) {
      return false;
    }

    // 프리미엄 박람회인 경우 노출 순위 검증
    if (expoIsPremium && form.isPremium && (!form.displayRank || form.displayRank <= 0 || form.displayRank > 3)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...form,
      isPremium: expoIsPremium || false,
      displayRank: (expoIsPremium && form.displayRank)
        ? parseInt(form.displayRank || '0', 10)
        : null,
    };

    const success = await onSubmit(payload);
    if (success) {
      setForm(initForm());
    }
  };

  const handleCancel = () => {
    setForm(initForm());
    onCancel?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.posterWrapper}>
        <ImageUpload
          initialImageUrl={form.mainImageUrl}
          onUploadSuccess={handleImageUploadSuccess}
          onUploadError={handleImageUploadError}
        />
      </div>

      <div className={styles.formGrid}>
        {/* 왼쪽 컬럼 */}
        <div className={styles.leftColumn}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              부스명 <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="부스명을 입력하세요"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              부스 위치 <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="text"
              name="boothNumber"
              value={form.boothNumber}
              onChange={handleChange}
              placeholder="예: A-01"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>부스 설명</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="부스에 대한 간단한 설명을 입력하세요"
              className={styles.inputField}
            />
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className={styles.rightColumn}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              담당자명 <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              placeholder="담당자명을 입력하세요"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              담당자 연락처 <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="text"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              담당자 이메일 <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="example@company.com"
              className={styles.inputField}
            />
          </div>

          {expoIsPremium && (
            <div className={styles.formGroup}>
              <label className={styles.label}>노출 순위</label>
              <input
                type="number"
                name="displayRank"
                value={form.displayRank}
                onChange={handleChange}
                placeholder="노출 순위 (1~3)"
                className={styles.inputField}
                min="1"
                max="3"
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!validateForm()}
          className={`${styles.actionBtn} ${styles.submitBtn}`}
        >
          <FaCheckCircle />
          <span>등록</span>
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className={`${styles.actionBtn} ${styles.cancelBtn}`}
          >
            <FaTimesCircle />
            <span>취소</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default BoothSettingForm;
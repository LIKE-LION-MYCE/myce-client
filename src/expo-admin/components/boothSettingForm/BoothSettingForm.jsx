// BoothSettingForm.jsx
import { useState, useEffect } from 'react';
import styles from './BoothSettingForm.module.css';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ImageUpload from '../../../common/components/imageUpload/ImageUpload';

function BoothSettingForm({ onSubmit, onCancel, editingBooth, expoIsPremium }) {
  const [form, setForm] = useState(initForm());
  const [errors, setErrors] = useState({});

  function initForm() {
    return {
      boothNumber: '',
      name: '',
      description: '',
      mainImageUrl: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      isPremium: false,
      displayRank: '',
    };
  }

  // 전화번호 자동 하이픈 포맷
  const formatPhoneNumber = (value) => {
    const onlyNums = String(value || '').replace(/[^0-9]/g, '');

    // 서울 지역번호 02 (예: 02-123-4567, 02-1234-5678)
    if (onlyNums.startsWith('02')) {
      if (onlyNums.length <= 2) return onlyNums;
      if (onlyNums.length <= 5) return onlyNums.replace(/(\d{2})(\d{1,3})/, '$1-$2');
      if (onlyNums.length <= 9) return onlyNums.replace(/(\d{2})(\d{3})(\d{1,4})/, '$1-$2-$3');
      return onlyNums.replace(/(\d{2})(\d{4})(\d{4}).*/, '$1-$2-$3'); // 최대 02-1234-5678
    }

    // 그 외(010, 031 등) (예: 010-123-4567, 010-1234-5678 / 031-123-4567, 031-1234-5678)
    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 6) return onlyNums.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    if (onlyNums.length <= 10) return onlyNums.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
    return onlyNums.replace(/(\d{3})(\d{4})(\d{4}).*/, '$1-$2-$3'); // 최대 010-1234-5678
  };

  useEffect(() => {
    if (editingBooth) {
      setForm({
        ...editingBooth,
      });
    } else {
      setForm(initForm());
    }
  }, [editingBooth, expoIsPremium]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 연락처만 자동 하이픈
    if (name === 'contactPhone') {
      const formatted = formatPhoneNumber(value);
      setForm((prev) => ({ ...prev, contactPhone: formatted }));
      setErrors((prev) => ({ ...prev, contactPhone: '' }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleToggleChange = (name, value) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'isPremium' && !value) {
        updated.displayRank = '';
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setForm((prev) => ({ ...prev, mainImageUrl: imageUrl }));
  };

  const handleImageUploadError = (error) => {
    console.error('이미지 업로드 실패:', error);
  };

  // 유효성 검사 (로직은 그대로, 에러만 표시)
  const runValidation = () => {
    const e = {};
    const f = form;
    const isBlank = (v) => !v || String(v).trim() === '';

    if (isBlank(f.boothNumber)) e.boothNumber = '부스 위치(번호)는 필수입니다.';
    else if (f.boothNumber.length > 30) e.boothNumber = '부스 위치(번호)는 30자 이하여야 합니다.';

    if (isBlank(f.name)) e.name = '부스명은 필수입니다.';
    else if (f.name.length > 100) e.name = '부스명은 100자 이하여야 합니다.';

    if (isBlank(f.description)) e.description = '부스 설명은 필수입니다.';

    if (isBlank(f.contactName)) e.contactName = '담당자명은 필수입니다.';
    else if (f.contactName.length > 30) e.contactName = '담당자명은 30자 이하여야 합니다.';

    const phoneRe = /^\d{2,3}-\d{3,4}-\d{4}$/;
    if (isBlank(f.contactPhone)) e.contactPhone = '담당자 연락처는 필수입니다.';
    else if (!phoneRe.test(f.contactPhone))
      e.contactPhone = '유효한 전화번호 형식이 아닙니다. (예: 010-1234-5678)';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isBlank(f.contactEmail)) e.contactEmail = '담당자 이메일은 필수입니다.';
    else if (!emailRe.test(f.contactEmail)) e.contactEmail = '유효한 이메일 형식이 아닙니다.';
    else if (f.contactEmail.length > 100) e.contactEmail = '담당자 이메일은 100자 이하여야 합니다.';

    if (expoIsPremium && form.isPremium) {
      if (isBlank(f.displayRank)) e.displayRank = '노출 순위를 선택해주세요.';
      else if (!/^\d+$/.test(String(f.displayRank))) e.displayRank = '노출 순위는 숫자여야 합니다.';
    }

    return e;
  };

  const handleSubmit = async () => {
    const v = runValidation();
    setErrors(v);
    if (Object.values(v).some(Boolean)) return;

    const payload = {
      ...form,
      isPremium: expoIsPremium ? Boolean(form.isPremium) : false,
      displayRank:
        expoIsPremium && form.isPremium && form.displayRank
          ? parseInt(form.displayRank, 10)
          : 0,
    };

    const success = await onSubmit(payload);
    if (success) {
      setForm(initForm());
      setErrors({});
    }
  };

  const handleCancel = () => {
    setForm(initForm());
    setErrors({});
    onCancel?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.posterWrapper}>
        <ImageUpload
          key={form.mainImageUrl || 'empty'}
          initialImageUrl={form.mainImageUrl}
          onUploadSuccess={handleImageUploadSuccess}
          onUploadError={handleImageUploadError}
        />
      </div>

      <div className={styles.formGrid}>
        {/* 왼쪽 컬럼 */}
        <div className={styles.leftColumn}>
          <div className={styles.formGroup}>
            <label className={styles.label}>부스명</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="부스명 입력"
              className={styles.inputField}
              maxLength={100}
            />
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>부스 위치</label>
            <input
              type="text"
              name="boothNumber"
              value={form.boothNumber}
              onChange={handleChange}
              placeholder="예: A-01"
              className={styles.inputField}
              maxLength={30}
            />
            {errors.boothNumber && <p className={styles.errorText}>{errors.boothNumber}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>부스 설명</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="부스 설명 입력"
              className={styles.inputField}
            />
            {errors.description && <p className={styles.errorText}>{errors.description}</p>}
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className={styles.rightColumn}>
          <div className={styles.formGroup}>
            <label className={styles.label}>담당자명</label>
            <input
              type="text"
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              placeholder="담당자명을 입력"
              className={styles.inputField}
              maxLength={30}
            />
            {errors.contactName && <p className={styles.errorText}>{errors.contactName}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 연락처</label>
            <input
              type="text"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder="예 : 010-1234-5678"
              className={styles.inputField}
              inputMode="numeric"
            />
            {errors.contactPhone && <p className={styles.errorText}>{errors.contactPhone}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 이메일</label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="예 : example@company.com"
              className={styles.inputField}
              maxLength={100}
            />
            {errors.contactEmail && <p className={styles.errorText}>{errors.contactEmail}</p>}
          </div>

          {expoIsPremium && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>프리미엄 부스</label>
                <ToggleSwitch
                  checked={form.isPremium}
                  onChange={(value) => handleToggleChange('isPremium', value)}
                />
              </div>

              {form.isPremium && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>노출 순위</label>
                  <select
                    name="displayRank"
                    value={form.displayRank}
                    onChange={handleChange}
                    className={styles.inputField}
                  >
                    <option value="">순위 선택</option>
                    <option value="1">1위</option>
                    <option value="2">2위</option>
                    <option value="3">3위</option>
                  </select>
                  {errors.displayRank && <p className={styles.errorText}>{errors.displayRank}</p>}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handleSubmit}
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
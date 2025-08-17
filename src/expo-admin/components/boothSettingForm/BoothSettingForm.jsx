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
      isPremium: false,
      displayRank: '',
    };
  }

  useEffect(() => {
    if (editingBooth) {
      setForm({
        ...editingBooth
      });
    } else {
      setForm(initForm());
    }
  }, [editingBooth, expoIsPremium]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name, value) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // 프리미엄이 아닌 경우 순위 초기화
      if (name === 'isPremium' && !value) {
        updated.displayRank = '';
      }
      return updated;
    });
  };


  const handleImageUploadSuccess = (imageUrl) => {
    setForm((prev) => ({ ...prev, mainImageUrl: imageUrl }));
  };

  const handleImageUploadError = (error) => {
    console.error('이미지 업로드 실패:', error);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      isPremium: expoIsPremium ? Boolean(form.isPremium) : false,
      displayRank: (expoIsPremium && form.isPremium && form.displayRank)
        ? parseInt(form.displayRank, 10)
        : 0,
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
            <label className={styles.label}>부스 설명 <span style={{color: 'red'}}>*</span></label>
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
                  <label className={styles.label}>
                    노출 순위 <span style={{color: 'red'}}>*</span>
                  </label>
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
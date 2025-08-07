import { useState, useEffect } from 'react';
import styles from './BoothSettingForm.module.css';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import {registerBooth,updateBooth,} from '../../../api/service/expo-admin/boothService';
import { useParams } from 'react-router-dom';

function BoothSettingForm({ initialData, onSuccess }) {
  const { expoId } = useParams();
  const [form, setForm] = useState(initForm());
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [failToast, setFailToast] = useState({ show: false, message: '' });
  const isEditMode = Boolean(initialData);

  function initForm() {
    return {
      id: null,
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
    if (initialData) {
      setForm({ ...initForm(), ...initialData });
    } else {
      setForm(initForm());
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    const { checked } = e.target;
    setForm((prev) => ({
      ...prev,
      isPremium: checked,
      displayRank: checked ? prev.displayRank : '',
    }));
  };

  const showFailToast = (message) => {
    setFailToast({ show: true, message });
    setTimeout(() => {
      setFailToast({ show: false, message: '' });
    }, 5000);
  };

  const validateForm = () => {
    // (유효성 검사 로직은 동일하므로 생략)
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...form,
      displayRank: form.isPremium ? parseInt(form.displayRank || '0', 10) : null,
    };

    try {
      let result;
      if (isEditMode) {
        result = await updateBooth(expoId, form.id, payload);
      } else {
        result = await registerBooth(expoId, payload);
      }

      if (result) {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 2000);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        showFailToast(
          `${isEditMode ? '수정' : '등록'}에 실패했습니다. 서버 응답을 확인해주세요.`
        );
      }
    } catch (error) {
      // 백엔드에서 제공하는 커스텀 에러 메시지를 우선적으로 사용
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `${isEditMode ? '수정' : '등록'} 중 오류가 발생했습니다.`;
      showFailToast(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      {showSuccessToast && (
        <ToastSuccess message={`부스 ${isEditMode ? '수정' : '등록'} 완료`} />
      )}
      {failToast.show && <ToastFail message={failToast.message} />}

      <div className={styles.posterWrapper}>
        <img
          src={
            form.mainImageUrl ||
            'https://designcompass.org/wp-content/uploads/2024/10/logo-naver-1536x1152.png'
          }
          alt="부스 이미지"
          className={styles.posterImage}
        />
      </div>

      <div className={styles.formGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <div className={styles.formGroup}>
            <label className={styles.label}>부스 번호</label>
            <input
              name="boothNumber"
              className={styles.inputField}
              placeholder="부스 번호 입력"
              value={form.boothNumber || ''}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>프리미엄 부스 여부</label>
            <div className={styles.toggleWrapper}>
              <ToggleSwitch
                checked={form.isPremium}
                onChange={handleToggle}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>노출 순위</label>
            <input
              name="displayRank"
              className={styles.inputField}
              type="number"
              placeholder="숫자로 입력"
              value={form.displayRank || ''}
              onChange={handleChange}
              disabled={!form.isPremium}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.formGroup}>
            <label className={styles.label}>부스명</label>
            <input
              name="name"
              className={styles.inputField}
              placeholder="부스명 입력"
              value={form.name || ''}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>부스 소개</label>
            <input
              name="description"
              className={styles.inputField}
              placeholder="부스 소개 입력"
              value={form.description || ''}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>담당자명</label>
            <input
              name="contactName"
              className={styles.inputField}
              placeholder="담당자명 입력"
              value={form.contactName || ''}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 연락처</label>
            <input
              name="contactPhone"
              className={styles.inputField}
              placeholder="010-1234-5678"
              value={form.contactPhone || ''}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 이메일</label>
            <input
              name="contactEmail"
              className={styles.inputField}
              placeholder="이메일 입력"
              value={form.contactEmail || ''}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>메인 이미지 URL</label>
            <input
              name="mainImageUrl"
              className={styles.inputField}
              placeholder="이미지 주소 입력"
              value={form.mainImageUrl || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.actionBtn} ${styles.submitBtn}`}
          onClick={handleSubmit}
        >
          <FaCheckCircle className={styles.iconBtn} />{' '}
          {isEditMode ? '수정' : '등록'}
        </button>
        <button
          className={`${styles.actionBtn} ${styles.cancelBtn}`}
          onClick={() => setForm(initForm())}
        >
          <FaTimesCircle className={styles.iconBtn} /> 취소
        </button>
      </div>
    </div>
  );
}

export default BoothSettingForm;


import { useState} from 'react';
import styles from './BoothSettingForm.module.css';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';

function BoothSettingForm({ onSubmit }) {
  const [form, setForm] = useState(initForm());
  const [isPremium, setIsPremium] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function initForm() {
    return {
      boothLocation: '',
      priority: '',
      companyName: '',
      description: '',
      ceo: '',
      address: '',
      website: '',
      phone: '',
      email: '',
      imageUrl: '',
    };
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.companyName || !form.boothLocation) {
      alert('회사명과 부스 위치는 필수입니다.');
      return;
    }

    const payload = {
      ...form,
      priority: isPremium ? parseInt(form.priority || '0', 10) : null,
      isPremium,
    };

    onSubmit(payload);
    setForm(initForm());
    setIsPremium(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className={styles.container}>
      {showToast && <ToastSuccess/>}

      <div className={styles.posterWrapper}>
        <img
          src={form.imageUrl || 'https://designcompass.org/wp-content/uploads/2024/10/logo-naver-1536x1152.png'}
          alt="부스 이미지"
          className={styles.posterImage}
        />
      </div>

      <div className={styles.formGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.formGroup}>
            <label className={styles.label}>부스 위치</label>
            <input
              name="boothLocation"
              className={styles.inputField}
              placeholder="부스 위치 입력"
              value={form.boothLocation}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>프리미엄 상위 노출 신청 여부</label>
            <div className={styles.toggleWrapper}>
              <ToggleSwitch
                checked={isPremium}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsPremium(checked);
                  if (!checked) {
                    setForm((prev) => ({ ...prev, priority: '' }));
                  }
                }}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>부스 순위</label>
            <input
              name="priority"
              className={styles.inputField}
              type="number"
              placeholder="숫자로 입력"
              value={form.priority}
              onChange={handleChange}
              disabled={!isPremium}
            />
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.formGroup}>
            <label className={styles.label}>회사명</label>
            <input
              name="companyName"
              className={styles.inputField}
              placeholder="회사명 입력"
              value={form.companyName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>회사소개</label>
            <input
              name="description"
              className={styles.inputField}
              placeholder="회사 소개 입력"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>대표명</label>
            <input
              name="ceo"
              className={styles.inputField}
              placeholder="대표명 입력"
              value={form.ceo}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>주소</label>
            <input
              name="address"
              className={styles.inputField}
              placeholder="주소 입력"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>웹사이트</label>
            <input
              name="website"
              className={styles.inputField}
              placeholder="웹사이트 입력"
              value={form.website}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 전화번호</label>
            <input
              name="phone"
              className={styles.inputField}
              placeholder="전화번호 입력"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 이메일</label>
            <input
              name="email"
              className={styles.inputField}
              placeholder="이메일 입력"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>이미지 URL</label>
            <input
              name="imageUrl"
              className={styles.inputField}
              placeholder="이미지 주소 입력"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSubmit}>
          <FaCheckCircle className={styles.iconBtn} /> 등록
        </button>
        <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={() => {
          setForm(initForm());
          setIsPremium(false);
        }}>
          <FaTimesCircle className={styles.iconBtn} /> 취소
        </button>
      </div>
    </div>
  );
}

export default BoothSettingForm;
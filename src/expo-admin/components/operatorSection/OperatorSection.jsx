import { useState, useEffect } from 'react';
import {
  FaUserTie,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import styles from './OperatorSection.module.css';
import ToastSuccess from '../../../common/commponents/toastSuccess/ToastSuccess';

const mockOperatorData = {
  companyName: '토스트 컴퍼니',
  ceoName: '김지현',
  email: 'toast@example.com',
  phone: '010-1234-5678',
  address: '서울특별시 강남구 강남대로 123',
  businessNumber: '123-45-67890',
};

function OperatorSection() {
  const [form, setForm] = useState(initForm());
  const [showToast, setShowToast] = useState(false);

  function initForm() {
    return {
      companyName: '',
      ceoName: '',
      email: '',
      phone: '',
      address: '',
      businessNumber: '',
    };
  }

  useEffect(() => {
    // 더미 데이터 로딩
    setForm({ ...mockOperatorData });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSubmit = () => {
    const payload = { ...form };
    console.log('[제출할 운영자 정보]', payload);
    triggerToast();
  };

  const handleCancel = () => {
    triggerToast();
  };

  return (
    <div className={styles.container}>
      {showToast && <ToastSuccess />}

      {/* 프로필 이미지 영역 */}
      <div className={styles.profileWrapper}>
        <img
          src="https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp"
          alt="프로필 이미지"
          className={styles.profileImage}
        />
      </div>

      <div className={styles.formGrid}>
        {/* 1행 */}
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>회사명</label>
          <input
            className={styles.inputField}
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="회사명 입력"
          />
          <FaUserTie className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>대표명</label>
          <input
            className={styles.inputField}
            name="ceoName"
            value={form.ceoName}
            onChange={handleChange}
            placeholder="대표자명 입력"
          />
          <FaUserFriends className={styles.icon} />
        </div>

        {/* 2행 */}
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>이메일</label>
          <input
            className={styles.inputField}
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일 입력"
          />
          <FaEnvelope className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>연락처</label>
          <input
            className={styles.inputField}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="연락처 입력"
          />
          <FaPhone className={styles.icon} />
        </div>

        {/* 3행 */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label className={styles.label}>주소</label>
          <input
            className={styles.inputField}
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="주소 입력"
          />
          <FaMapMarkerAlt className={styles.icon} />
        </div>

        {/* 4행 */}
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>사업자번호</label>
          <input
            className={styles.inputField}
            name="businessNumber"
            value={form.businessNumber}
            onChange={handleChange}
            placeholder="사업자번호 입력"
          />
          <FaBuilding className={styles.icon} />
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className={styles.buttonGroup}>
        <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSubmit}>
          <FaCheckCircle className={styles.iconBtn} />
          수정 요청
        </button>
        <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleCancel}>
          <FaTimesCircle className={styles.iconBtn} />
          취소
        </button>
      </div>
    </div>
  );
}

export default OperatorSection;
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaUserTie, FaUserFriends, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaBuilding, FaEdit
} from 'react-icons/fa';
import styles from './OperatorSection.module.css';
import {
  getMyBusinessProfile,
  updateMyBusinessProfile,
} from '../../../api/service/expo-admin/operation/operationService';
import OperatorImageUpload from '../operatorImageUpload/OperatorImageUpload';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';

function OperatorSection() {
  const { expoId } = useParams(); 
  const [form, setForm] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  //초기 렌더링, 조회 api
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getMyBusinessProfile(expoId);
        setForm(profileData);
      } catch (error) {
        triggerToastFail(error.message);
      }
    };
    fetchProfile();
  }, [expoId]);

  //유효성 체크
  const validateForm = (data) => {
    if (!data.companyName?.trim()) return '회사명은 필수입니다.';
    if (data.companyName.length > 100) return '회사명은 100자 이하여야 합니다.';

    if (!data.ceoName?.trim()) return '대표명은 필수입니다.';
    if (data.ceoName.length > 20) return '대표명은 20자 이하여야 합니다.';

    if (!data.contactEmail?.trim()) return '대표 이메일은 필수입니다.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) return '유효한 이메일 형식이어야 합니다.';
    if (data.contactEmail > 100) return '이메일 길이는 100자 이하여야 합니다.';

    if (!data.contactPhone?.trim()) return '대표 연락처는 필수입니다.';
    if (!/^[0-9-]+$/.test(data.contactPhone)) return '연락처는 숫자와 하이픈(-)만 포함해야 합니다.';
    if (data.contactPhone.length > 13) return '연락처 길이는 13자 이하여야합니다.';

    if (!data.address?.trim()) return '회사 주소는 필수입니다.';
    if (data.address.length > 300) return '주소는 300자 이하여야 합니다.';

    if (!data.businessRegistrationNumber?.trim()) return '사업자 번호는 필수입니다.';
    if (data.businessRegistrationNumber.length > 50) return '사업자 번호는 50자 이하여야 합니다.';
    if (!/^\d{3}-\d{2}-\d{5}$/.test(data.businessRegistrationNumber)) return '사업자 번호 형식이 올바르지 않습니다. (xxx-xx-xxxxx)';

    if (data.logoUrl && data.logoUrl.length > 500) return '이미지 URL은 500자 이하여야 합니다.';

    return null;
  };

  //수정 api
  const handleSubmit = async () => {
    const error = validateForm(form);
    if (error) {
      triggerToastFail(error);
      return;
    }
    try {
      await updateMyBusinessProfile(expoId, form);
      triggerSuccessToast();
    } catch (error) {
      triggerToastFail(error.message);
    }
  };

  //수정 감지 및 전화번호와 사업자 번호 자동 포맷팅
  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, '');

    if (onlyNums.startsWith('02')) {
      if (onlyNums.length <= 2) return onlyNums;
      if (onlyNums.length <= 5) return onlyNums.replace(/(\d{2})(\d{1,3})/, '$1-$2');
      if (onlyNums.length <= 9) return onlyNums.replace(/(\d{2})(\d{3})(\d{1,4})/, '$1-$2-$3');
      return onlyNums.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }

    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 6) return onlyNums.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    if (onlyNums.length <= 10) return onlyNums.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
    return onlyNums.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3').slice(0,13);
  };

  const formatBusinessNumber = (value) => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 3) {
      return nums;
    }
    
    if (nums.length <= 5) {
      return nums.replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    
    return nums.replace(/(\d{3})(\d{2})(\d{1,5})/, '$1-$2-$3').slice(0, 12);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'contactPhone') {
      newValue = formatPhoneNumber(value);
    } else if (name === 'businessRegistrationNumber') {
      newValue = formatBusinessNumber(value);
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  //이미지 업로드 핸들링
  const handleImageUpload = (cdnUrl) => {
    setForm((prev) => ({ ...prev, logoUrl: cdnUrl }));
  };

  //성공 토스트 팝업
  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  //성공 실패 팝업
  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 5000);
  };

  return (
    <div className={styles.container}>
      <OperatorImageUpload
        onUploadSuccess={handleImageUpload}
        onUploadError={triggerToastFail}
        initialImageUrl={form.logoUrl}
      />

      <div className={styles.formGrid}>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>회사명</label>
          <input className={styles.inputField} name="companyName" value={form.companyName || ''} onChange={handleChange} placeholder="회사명 입력" />
          <FaUserTie className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>대표명</label>
          <input className={styles.inputField} name="ceoName" value={form.ceoName || ''} onChange={handleChange} placeholder="대표자명 입력" />
          <FaUserFriends className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>이메일</label>
          <input className={styles.inputField} name="contactEmail" value={form.contactEmail || ''} onChange={handleChange} placeholder="이메일 입력" />
          <FaEnvelope className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>연락처</label>
          <input className={styles.inputField} name="contactPhone" value={form.contactPhone || ''} onChange={handleChange} placeholder="연락처 입력" />
          <FaPhone className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label className={styles.label}>주소</label>
          <input className={styles.inputField} name="address" value={form.address || ''} onChange={handleChange} placeholder="주소 입력" />
          <FaMapMarkerAlt className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>사업자번호</label>
          <input className={styles.inputField} name="businessRegistrationNumber" value={form.businessRegistrationNumber || ''} onChange={handleChange} placeholder="사업자번호 입력" />
          <FaBuilding className={styles.icon} />
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSubmit}>
          <FaEdit className={styles.iconBtn} /> 수정
        </button>
      </div>

      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default OperatorSection;
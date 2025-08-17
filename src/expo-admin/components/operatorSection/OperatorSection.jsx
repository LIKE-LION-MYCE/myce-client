import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaUserTie, FaUserFriends, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaBuilding, FaEdit, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import styles from './OperatorSection.module.css';
import {
  getMyBusinessProfile,
  updateMyBusinessProfile,
} from '../../../api/service/expo-admin/operation/operationService';
import OperatorImageUpload from '../operatorImageUpload/OperatorImageUpload';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';

const FIXED_LOGO_URL = 'https://cdn.example.com/placeholder-logo.png'; // 원하는 고정 URL로 변경

function OperatorSection() {
  const { expoId } = useParams();
  const [form, setForm] = useState({});
  const [originalForm, setOriginalForm] = useState({});
  const [errors, setErrors] = useState({});

  const [isEditing, setIsEditing] = useState(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 5000);
  };

  const HIDE_LOGO_PREVIEW = true;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getMyBusinessProfile(expoId);
        setForm(profileData || {});
        setOriginalForm(profileData || {});
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          '프로필 조회 중 오류가 발생했습니다.';
        triggerToastFail(msg);
      }
    };
    fetchProfile();
  }, [expoId]);

  const runValidation = (data) => {
    const e = {};
    if (!data.companyName?.trim()) e.companyName = '회사명은 필수입니다.';
    else if (data.companyName.length > 100) e.companyName = '회사명은 100자 이하여야 합니다.';

    if (!data.ceoName?.trim()) e.ceoName = '대표명은 필수입니다.';
    else if (data.ceoName.length > 20) e.ceoName = '대표명은 20자 이하여야 합니다.';

    if (!data.contactEmail?.trim()) e.contactEmail = '대표 이메일은 필수입니다.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail))
      e.contactEmail = '유효한 이메일 형식이어야 합니다.';
    else if (data.contactEmail.length > 100)
      e.contactEmail = '이메일 길이는 100자 이하여야 합니다.';

    if (!data.contactPhone?.trim()) e.contactPhone = '대표 연락처는 필수입니다.';
    else if (!/^[0-9-]+$/.test(data.contactPhone))
      e.contactPhone = '연락처는 숫자와 하이픈(-)만 포함해야 합니다.';
    else if (data.contactPhone.length > 13)
      e.contactPhone = '연락처 길이는 13자 이하여야 합니다.';

    if (!data.address?.trim()) e.address = '회사 주소는 필수입니다.';
    else if (data.address.length > 300) e.address = '주소는 300자 이하여야 합니다.';

    if (!data.businessRegistrationNumber?.trim())
      e.businessRegistrationNumber = '사업자 번호는 필수입니다.';
    else if (data.businessRegistrationNumber.length > 50)
      e.businessRegistrationNumber = '사업자 번호는 50자 이하여야 합니다.';
    else if (!/^\d{3}-\d{2}-\d{5}$/.test(data.businessRegistrationNumber))
      e.businessRegistrationNumber = '사업자 번호 형식이 올바르지 않습니다. (xxx-xx-xxxxx)';

    return e;
  };

  const handleSubmit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    const e = runValidation(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      const payload = { ...form, logoUrl: FIXED_LOGO_URL };
      await updateMyBusinessProfile(expoId, payload);
      triggerSuccessToast();
      setOriginalForm(payload);
      setIsEditing(false);
      // window.location.reload();
    } catch (error) {
      const msg =
        error?.response?.status === 403
          ? '수정 권한이 없습니다.'
          : error?.response?.data?.message ||
            error?.message ||
            '수정 중 오류가 발생했습니다.';
      triggerToastFail(msg);
    }
  };

  const handleCancel = () => {
    setForm(originalForm || {});
    setErrors({});
    setIsEditing(false);
  };

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
    return onlyNums.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3').slice(0, 13);
  };

  const formatBusinessNumber = (value) => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 3) return nums;
    if (nums.length <= 5) return nums.replace(/(\d{3})(\d{1,2})/, '$1-$2');
    return nums.replace(/(\d{3})(\d{2})(\d{1,5})/, '$1-$2-$3').slice(0, 12);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!isEditing) return;
    let newValue = value;
    if (name === 'contactPhone') newValue = formatPhoneNumber(value);
    else if (name === 'businessRegistrationNumber') newValue = formatBusinessNumber(value);
    setForm((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = () => {};

  const renderField = (name, label, IconComp) => {
    const val = form[name] ?? '';
    return (
      <>
        <label className={styles.label}>{label}</label>

        {isEditing ? (
          <div className={styles.inputWrap}>
            <input
              className={styles.inputField}
              name={name}
              value={val}
              onChange={handleChange}
              placeholder={`${label} 입력`}
            />
            <IconComp className={styles.icon} />
          </div>
        ) : (
          <div className={styles.readOnlyWrap}>
            <div className={styles.readOnlyBox}>
              <span className={styles.readOnlyText}>{val || '-'}</span>
            </div>
            <IconComp className={styles.icon} />
          </div>
        )}

        {isEditing && errors[name] && <p className={styles.errorText}>{errors[name]}</p>}
      </>
    );
  };

  return (
    <div className={styles.container}>
      {!HIDE_LOGO_PREVIEW && (
        <OperatorImageUpload
          onUploadSuccess={handleImageUpload}
          onUploadError={(msg) => triggerToastFail(msg)}
          initialImageUrl={form.logoUrl}
        />
      )}

      <div className={styles.formGrid}>
        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField('companyName', '회사명', FaUserTie)}
        </div>

        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField('ceoName', '대표명', FaUserFriends)}
        </div>

        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField('contactEmail', '이메일', FaEnvelope)}
        </div>

        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField('contactPhone', '연락처', FaPhone)}
        </div>

        <div className={`${styles.formGroup} ${styles.full}`}>
          {renderField('address', '주소', FaMapMarkerAlt)}
        </div>

        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField('businessRegistrationNumber', '사업자번호', FaBuilding)}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        {!isEditing ? (
          <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSubmit}>
            <FaEdit className={styles.iconBtn} /> 수정
          </button>
        ) : (
          <>
            <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSubmit}>
              <FaCheckCircle className={styles.iconBtn} /> 저장
            </button>
            <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleCancel}>
              <FaTimesCircle className={styles.iconBtn} /> 취소
            </button>
          </>
        )}
      </div>

      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default OperatorSection;
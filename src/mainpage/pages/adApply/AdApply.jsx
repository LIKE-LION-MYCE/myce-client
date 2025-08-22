// src/mainpage/pages/adApply/AdApply.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdForm from '../../components/adForm/AdForm';
import styles from './AdApply.module.css';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';

const AdApply = () => {
  const navigate = useNavigate();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 폼 제출 시 실행될 핸들러
  const handleAdSubmission = (formData) => {
    // 실제 서버로 데이터를 전송하는 로직을 여기에 구현
    console.log('광고 등록 데이터:', formData);
    
    // 등록 완료 후 특정 페이지로 이동 (예: 등록 완료 페이지)
    // navigate('/ad-apply/complete');
    triggerToastSuccess('광고 등록이 완료되었습니다.');
  };

  const handleCancel = () => {
    // 취소 버튼 클릭 시 이전 페이지로 돌아가는 로직
    navigate(-1); 
  };

  const triggerToastSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className={styles['ad-apply-container']}>
      {/* onFormSubmit prop으로 폼 제출 함수 전달 */}
      <AdForm onFormSubmit={handleAdSubmission} onCancel={handleCancel} />
      {showSuccessToast && <ToastSuccess message={successMessage} />}
    </div>
  );
};

export default AdApply;
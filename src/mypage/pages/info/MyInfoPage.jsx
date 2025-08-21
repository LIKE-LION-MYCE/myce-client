import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./MyInfoPage.module.css";
import ChangePasswordModal from "../../components/changePasswordModal/changePasswordModal";
import PhoneInput from "../../../common/components/phoneInput/PhoneInput";
import { getMemberInfo, updateMemberInfo, withdrawMember } from "../../../api/service/user/memberApi";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import ToastFail from "../../../common/components/toastFail/ToastFail";

const MyInfoPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [memberInfo, setMemberInfo] = useState({
    name: '',
    birth: '',
    loginId: '',
    phone: '',
    email: '',
    gender: ''
  });
  const [originalInfo, setOriginalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const showSuccessMessage = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showFailMessage = (message) => {
    setToastMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // 취소하는 경우 원본 데이터 복원
      setMemberInfo(originalInfo);
    } else {
      // 편집 시작 시 원본 데이터 백업
      setOriginalInfo({...memberInfo});
    }
    setIsEditMode(!isEditMode);
  };

  const handleUpdateInfo = async () => {
    try {
      await updateMemberInfo(memberInfo);
      showSuccessMessage(t('mypageGeneral.infoUpdated'));
      setOriginalInfo({...memberInfo});
      setIsEditMode(false);
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      showFailMessage(t('mypageGeneral.infoUpdateFailed'));
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm(t('mypageGeneral.withdrawConfirm'))) {
      try {
        await withdrawMember();
        showSuccessMessage(t('mypageGeneral.withdrawSuccess'));
        localStorage.removeItem('access_token');
        window.location.href = '/';
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        showFailMessage(t('mypageGeneral.withdrawFailed'));
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatPhone = (phoneString) => {
    if (!phoneString) return '';
    return phoneString.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const getGenderText = (gender) => {
    if (gender === 'FEMALE') return t('mypageGeneral.female');
    if (gender === 'MALE') return t('mypageGeneral.male');
    return '';
  };

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await getMemberInfo();
        setMemberInfo(response.data);
        setOriginalInfo(response.data);
      } catch (error) {
        console.error('회원 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, []);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.cardContainer}>
          {t('common.loading')}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.cardContainer}>
        {/* 전체 타이틀 */}
        <h2 className={styles.pageTitle}>{t('mypageGeneral.userInfo')}</h2>

        {/* 기본 정보 섹션 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{t('mypageGeneral.basicInfo')}</h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>{t('mypageGeneral.name')}</label>
              <div className={styles.displayValue}>
                {memberInfo.name}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>{t('mypageGeneral.birthDate')}</label>
              <div className={styles.displayValue}>
                {formatDate(memberInfo.birth)}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>{t('mypageGeneral.userId')}</label>
              <div className={styles.displayValue}>
                {memberInfo.loginId}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>{t('mypageGeneral.phoneNumber')}</label>
              {isEditMode ? (
                <PhoneInput
                  name="phone"
                  value={memberInfo.phone}
                  onChange={(e) => setMemberInfo({...memberInfo, phone: e.target.value})}
                  disabled={false}
                  showError={false}
                  className={styles.inputText}
                />
              ) : (
                <div className={styles.displayValue}>
                  {formatPhone(memberInfo.phone)}
                </div>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label>{t('mypageGeneral.email')}</label>
              {isEditMode ? (
                <input 
                  type="email" 
                  value={memberInfo.email}
                  onChange={(e) => setMemberInfo({...memberInfo, email: e.target.value})}
                  className={styles.inputEmail}
                />
              ) : (
                <div className={styles.displayValue}>
                  {memberInfo.email}
                </div>
              )}
            </div>
            
            <div className={styles.genderGroup}>
              <label>{t('mypageGeneral.gender')}</label>
              {isEditMode ? (
                <div>
                  <label>
                    <input 
                      type="radio" 
                      name="gender" 
                      value="FEMALE" 
                      checked={memberInfo.gender === 'FEMALE'}
                      onChange={(e) => setMemberInfo({...memberInfo, gender: e.target.value})}
                    /> {t('mypageGeneral.female')}
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="gender" 
                      value="MALE" 
                      checked={memberInfo.gender === 'MALE'}
                      onChange={(e) => setMemberInfo({...memberInfo, gender: e.target.value})}
                    /> {t('mypageGeneral.male')}
                  </label>
                </div>
              ) : (
                <div className={styles.displayValue}>
                  {getGenderText(memberInfo.gender)}
                </div>
              )}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            {!isEditMode ? (
              <>
                <button className={styles.modifyBtn} onClick={handleEditToggle}>{t('mypageGeneral.modifyInfo')}</button>
                <button className={styles.passwordBtn} onClick={openModal}>
                  {t('mypageGeneral.changePassword')}
                </button>
              </>
            ) : (
              <>
                <button className={styles.saveBtn} onClick={handleUpdateInfo}>{t('mypageGeneral.save')}</button>
                <button className={styles.cancelBtn} onClick={handleEditToggle}>{t('mypageGeneral.cancel')}</button>
              </>
            )}
          </div>
        </section>

        {/* 계정 관리 영역 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{t('mypageGeneral.accountManagement')}</h2>
          <div className={styles.dangerBox}>
            <strong>{t('mypageGeneral.withdraw')}</strong>
            <p>{t('mypageGeneral.withdrawWarning')}</p>
            <button className={styles.withdrawBtn} onClick={handleWithdraw}>{t('mypageGeneral.withdraw')}</button>
          </div>
        </section>

        {/* 모달 */}
        {isModalOpen && <ChangePasswordModal onClose={closeModal} />}
        
        {showSuccessToast && <ToastSuccess message={toastMessage} />}
        {showFailToast && <ToastFail message={toastMessage} />}
      </div>
    </div>
  );
};

export default MyInfoPage;
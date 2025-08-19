import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./MyInfoPage.module.css";
import ChangePasswordModal from "../../components/changePasswordModal/changePasswordModal";
import PhoneInput from "../../../common/components/phoneInput/PhoneInput";
import DateInput from "../../../common/components/dateInput/DateInput";
import { getMemberInfo, updateMemberInfo, withdrawMember } from "../../../api/service/user/memberApi";

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      alert(t('mypage.infoUpdated'));
      setOriginalInfo({...memberInfo});
      setIsEditMode(false);
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      alert(t('mypage.infoUpdateFailed'));
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm(t('mypage.withdrawConfirm'))) {
      try {
        await withdrawMember();
        alert(t('mypage.withdrawSuccess'));
        localStorage.removeItem('access_token');
        window.location.href = '/';
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert(t('mypage.withdrawFailed'));
      }
    }
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
    return <div className={styles.wrapper}>{t('common.loading')}</div>;
  }

  return (
    <div className={styles.wrapper}>
      {/* 전체 타이틀 */}
      <h2 className={styles.pageTitle}>{t('mypage.userInfo')}</h2>

      {/* 흰색 박스 영역 전체 */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{t('mypage.basicInfo')}</h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>{t('mypage.name')}</label>
            <input 
              type="text" 
              value={memberInfo.name} 
              disabled={true} 
              className={`${styles.inputText} ${styles.disabled}`} 
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t('mypage.birthDate')}</label>
            <DateInput
              name="birth"
              value={memberInfo.birth}
              onChange={() => {}} // 읽기 전용이므로 빈 함수
              disabled={true} // 항상 비활성화
              format="YYYY-MM-DD"
              showError={false}
              className={styles.inputText} // 다른 input과 크기 통일
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t('mypage.userId')}</label>
            <input type="text" disabled value={memberInfo.loginId} className={`${styles.inputText} ${styles.disabled}`} />
          </div>
          <div className={styles.formGroup}>
            <label>{t('mypage.phoneNumber')}</label>
            <PhoneInput
              name="phone"
              value={memberInfo.phone}
              onChange={(e) => {
                if (isEditMode) {
                  setMemberInfo({...memberInfo, phone: e.target.value});
                }
              }}
              disabled={!isEditMode}
              showError={false}
              className={styles.inputText} // 다른 input과 크기 통일
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t('mypage.email')}</label>
            <input 
              type="email" 
              value={memberInfo.email}
              disabled={!isEditMode}
              onChange={(e) => isEditMode && setMemberInfo({...memberInfo, email: e.target.value})}
              className={`${styles.inputEmail} ${!isEditMode ? styles.disabled : ''}`} 
            />
          </div>
          <div className={styles.genderGroup}>
            <label>{t('mypage.gender')}</label>
            <div>
              <label>
                <input 
                  type="radio" 
                  name="gender" 
                  value="FEMALE" 
                  checked={memberInfo.gender === 'FEMALE'}
                  disabled={!isEditMode}
                  onChange={(e) => isEditMode && setMemberInfo({...memberInfo, gender: e.target.value})}
                /> {t('mypage.female')}
              </label>
              <label>
                <input 
                  type="radio" 
                  name="gender" 
                  value="MALE" 
                  checked={memberInfo.gender === 'MALE'}
                  disabled={!isEditMode}
                  onChange={(e) => isEditMode && setMemberInfo({...memberInfo, gender: e.target.value})}
                /> {t('mypage.male')}
              </label>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          {!isEditMode ? (
            <>
              <button className={styles.modifyBtn} onClick={handleEditToggle}>{t('mypage.modifyInfo')}</button>
              <button className={styles.passwordBtn} onClick={openModal}>
                {t('mypage.changePassword')}
              </button>
            </>
          ) : (
            <>
              <button className={styles.saveBtn} onClick={handleUpdateInfo}>{t('mypage.save')}</button>
              <button className={styles.cancelBtn} onClick={handleEditToggle}>{t('mypage.cancel')}</button>
            </>
          )}
        </div>
      </section>

      {/* 계정 관리 영역 */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{t('mypage.accountManagement')}</h2>
        <div className={styles.dangerBox}>
          <strong>{t('mypage.withdraw')}</strong>
          <p>{t('mypage.withdrawWarning')}</p>
          <button className={styles.withdrawBtn} onClick={handleWithdraw}>{t('mypage.withdraw')}</button>
        </div>
      </section>

      {/* 모달 */}
      {isModalOpen && <ChangePasswordModal onClose={closeModal} />}
    </div>
  );
};

export default MyInfoPage;
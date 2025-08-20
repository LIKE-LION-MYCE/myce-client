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
      alert(t('mypageGeneral.infoUpdated'));
      setOriginalInfo({...memberInfo});
      setIsEditMode(false);
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      alert(t('mypageGeneral.infoUpdateFailed'));
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm(t('mypageGeneral.withdrawConfirm'))) {
      try {
        await withdrawMember();
        alert(t('mypageGeneral.withdrawSuccess'));
        localStorage.removeItem('access_token');
        window.location.href = '/';
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert(t('mypageGeneral.withdrawFailed'));
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
      <h2 className={styles.pageTitle}>{t('mypageGeneral.userInfo')}</h2>

      {/* 흰색 박스 영역 전체 */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{t('mypageGeneral.basicInfo')}</h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>{t('mypageGeneral.name')}</label>
            <input 
              type="text" 
              value={memberInfo.name} 
              disabled={true} 
              className={`${styles.inputText} ${styles.disabled}`} 
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t('mypageGeneral.birthDate')}</label>
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
            <label>{t('mypageGeneral.userId')}</label>
            <input type="text" disabled value={memberInfo.loginId} className={`${styles.inputText} ${styles.disabled}`} />
          </div>
          <div className={styles.formGroup}>
            <label>{t('mypageGeneral.phoneNumber')}</label>
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
            <label>{t('mypageGeneral.email')}</label>
            <input 
              type="email" 
              value={memberInfo.email}
              disabled={!isEditMode}
              onChange={(e) => isEditMode && setMemberInfo({...memberInfo, email: e.target.value})}
              className={`${styles.inputEmail} ${!isEditMode ? styles.disabled : ''}`} 
            />
          </div>
          <div className={styles.genderGroup}>
            <label>{t('mypageGeneral.gender')}</label>
            <div>
              <label>
                <input 
                  type="radio" 
                  name="gender" 
                  value="FEMALE" 
                  checked={memberInfo.gender === 'FEMALE'}
                  disabled={!isEditMode}
                  onChange={(e) => isEditMode && setMemberInfo({...memberInfo, gender: e.target.value})}
                /> {t('mypageGeneral.female')}
              </label>
              <label>
                <input 
                  type="radio" 
                  name="gender" 
                  value="MALE" 
                  checked={memberInfo.gender === 'MALE'}
                  disabled={!isEditMode}
                  onChange={(e) => isEditMode && setMemberInfo({...memberInfo, gender: e.target.value})}
                /> {t('mypageGeneral.male')}
              </label>
            </div>
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
    </div>
  );
};

export default MyInfoPage;
import React, { useState, useEffect } from "react";
import styles from "./MyInfoPage.module.css";
import ChangePasswordModal from "../../components/changePasswordModal/changePasswordModal";
import { getMemberInfo, updateMemberInfo, withdrawMember } from "../../../api/service/user/memberApi";

const MyInfoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberInfo, setMemberInfo] = useState({
    name: '',
    birth: '',
    loginId: '',
    phone: '',
    email: '',
    gender: ''
  });
  const [loading, setLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpdateInfo = async () => {
    try {
      await updateMemberInfo(memberInfo);
      alert('회원 정보가 수정되었습니다.');
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      alert('회원 정보 수정에 실패했습니다.');
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm('정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      try {
        await withdrawMember();
        alert('회원 탈퇴가 완료되었습니다.');
        localStorage.removeItem('access_token');
        window.location.href = '/';
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await getMemberInfo();
        setMemberInfo(response.data);
      } catch (error) {
        console.error('회원 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, []);

  if (loading) {
    return <div className={styles.wrapper}>로딩 중...</div>;
  }

  return (
    <div className={styles.wrapper}>
      {/* 전체 타이틀 */}
      <h2 className={styles.pageTitle}>회원 정보</h2>

      {/* 흰색 박스 영역 전체 */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>기본 정보</h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>이름</label>
            <input type="text" value={memberInfo.name} disabled className={styles.inputText} />
          </div>
          <div className={styles.formGroup}>
            <label>생년월일</label>
            <input type="date" value={memberInfo.birth} disabled className={styles.inputDate} />
          </div>
          <div className={styles.formGroup}>
            <label>아이디</label>
            <input type="text" disabled value={memberInfo.loginId} className={styles.inputText} />
          </div>
          <div className={styles.formGroup}>
            <label>전화번호</label>
            <input 
              type="tel" 
              value={memberInfo.phone} 
              onChange={(e) => setMemberInfo({...memberInfo, phone: e.target.value})}
              className={styles.inputTel} 
            />
          </div>
          <div className={styles.formGroupFull}>
            <label>이메일</label>
            <input 
              type="email" 
              value={memberInfo.email}
              onChange={(e) => setMemberInfo({...memberInfo, email: e.target.value})}
              className={styles.inputEmail} 
            />
          </div>
          <div className={styles.genderGroup}>
            <label>성별</label>
            <div>
              <label>
                <input 
                  type="radio" 
                  name="gender" 
                  value="FEMALE" 
                  checked={memberInfo.gender === 'FEMALE'}
                  onChange={(e) => setMemberInfo({...memberInfo, gender: e.target.value})}
                /> 여자
              </label>
              <label>
                <input 
                  type="radio" 
                  name="gender" 
                  value="MALE" 
                  checked={memberInfo.gender === 'MALE'}
                  onChange={(e) => setMemberInfo({...memberInfo, gender: e.target.value})}
                /> 남자
              </label>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.modifyBtn} onClick={handleUpdateInfo}>정보 수정</button>
          <button className={styles.passwordBtn} onClick={openModal}>
            비밀번호 변경
          </button>
        </div>
      </section>

      {/* 계정 관리 영역 */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>계정 관리</h2>
        <div className={styles.dangerBox}>
          <strong>회원 탈퇴</strong>
          <p>계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
          <button className={styles.withdrawBtn} onClick={handleWithdraw}>회원 탈퇴</button>
        </div>
      </section>

      {/* 모달 */}
      {isModalOpen && <ChangePasswordModal onClose={closeModal} />}
    </div>
  );
};

export default MyInfoPage;
import React, { useState } from "react";
import styles from "./MyInfoPage.module.css";
import ChangePasswordModal from "../../components/changePasswordModal/changePasswordModal";

const MyInfoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
            <input type="text" value="홍길동" disabled />
          </div>
          <div className={styles.formGroup}>
            <label>생년월일</label>
            <input type="date" value="2001-09-16" disabled />
          </div>
          <div className={styles.formGroup}>
            <label>아이디</label>
            <input type="text" disabled value="honggildong" />
          </div>
          <div className={styles.formGroup}>
            <label>전화번호</label>
            <input type="tel" value="010-1234-5678" />
          </div>
          <div className={styles.formGroupFull}>
            <label>이메일</label>
            <input type="email" placeholder="example@email.com" />
          </div>
          <div className={styles.genderGroup}>
            <label>성별</label>
            <div>
              <label>
                <input type="radio" name="gender" value="female" /> 여자
              </label>
              <label>
                <input type="radio" name="gender" value="male" /> 남자
              </label>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.modifyBtn}>정보 수정</button>
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
          <button className={styles.withdrawBtn}>회원 탈퇴</button>
        </div>
      </section>

      {/* 모달 */}
      {isModalOpen && <ChangePasswordModal onClose={closeModal} />}
    </div>
  );
}
export default MyInfoPage;
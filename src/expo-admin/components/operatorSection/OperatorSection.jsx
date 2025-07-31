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

function OperatorSection() {
  return (
    <div className={styles.container}>
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
          <input className={styles.inputField} placeholder="회사명 입력" />
          <FaUserTie className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>대표명</label>
          <input className={styles.inputField} placeholder="대표자명 입력" />
          <FaUserFriends className={styles.icon} />
        </div>

        {/* 2행 */}
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>이메일</label>
          <input className={styles.inputField} placeholder="이메일 입력" />
          <FaEnvelope className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>연락처</label>
          <input className={styles.inputField} placeholder="연락처 입력" />
          <FaPhone className={styles.icon} />
        </div>

        {/* 3행 */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label className={styles.label}>주소</label>
          <input className={styles.inputField} placeholder="주소 입력" />
          <FaMapMarkerAlt className={styles.icon} />
        </div>

        {/* 4행 */}
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>사업자번호</label>
          <input className={styles.inputField} placeholder="사업자번호 입력" />
          <FaBuilding className={styles.icon} />
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className={styles.buttonGroup}>
        <button className={`${styles.actionBtn} ${styles.submitBtn}`}>
          <FaCheckCircle className={styles.iconBtn} />
          수정 요청
        </button>
        <button className={`${styles.actionBtn} ${styles.cancelBtn}`}>
          <FaTimesCircle className={styles.iconBtn} />
          취소
        </button>
      </div>
    </div>
  );
}

export default OperatorSection;
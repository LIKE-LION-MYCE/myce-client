import {
  FaUserTie,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from 'react-icons/fa';
import styles from './OperatorApplicationForm.module.css';

function OperatorApplicationForm({ operatorData }) {

  const form = operatorData || {
    title: '',
    bannerLocationName: '',
    bannerImageUrl: '',
    startAt: '',
    endAt: '',
    description: '',
  };

  return (
    <div className={styles.container}>

      <div className={styles.formGrid}>
        {/* 1행 */}
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>회사명</label>
          <input
            className={styles.inputField}
            name="companyName"
            value={form.companyName}
            readOnly
          />
          <FaUserTie className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>대표명</label>
          <input
            className={styles.inputField}
            name="ceoName"
            value={form.ceoName}
            readOnly
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
            readOnly
          />
          <FaEnvelope className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>연락처</label>
          <input
            className={styles.inputField}
            name="phone"
            value={form.phone}
            readOnly
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
            readOnly
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
            readOnly
          />
          <FaBuilding className={styles.icon} />
        </div>
      </div>
    </div>
  );
}

export default OperatorApplicationForm;

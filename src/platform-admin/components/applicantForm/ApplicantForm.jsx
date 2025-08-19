import {
  FaIdCard,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaTransgender
} from 'react-icons/fa';
import styles from './ApplicantForm.module.css';

function OperatorApplicationForm({ applicantData }) {

  const form = {
    loginId: applicantData?.loginId || '-',
    name: applicantData?.name || '-',
    gender: applicantData?.gender || '-',
    email: applicantData?.email || '-',
    phone: applicantData?.phone || '-',
    birth: applicantData?.birth || '-',
  };

  return (
    <div className={styles.container}>

      <div className={styles.formGrid}>
        {/* 1행 */}
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>신청자 아이디</label>
          <input
            className={styles.inputField}
            name="loginId"
            value={form.loginId}
            readOnly
          />
          <FaIdCard className={styles.icon} />
        </div>
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>신청자 이름</label>
          <input
            className={styles.inputField}
            name="name"
            value={form.name}
            readOnly
          />
          <FaUserFriends className={styles.icon} />
        </div>

        {/* 2행 */}
        <div className={`${styles.formGroup} ${styles.half}`}>
          <label className={styles.label}>성별</label>
          <input
            className={styles.inputField}
            name="gender"
            value={form.gender === 'MALE' ? '남자' : '여자'}
            readOnly
          />
          <FaTransgender className={styles.icon} />
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
      </div>
    </div>
  );
}

export default OperatorApplicationForm;

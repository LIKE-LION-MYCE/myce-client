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
        {/* 신청자 아이디 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>신청자 아이디</label>
          <div className={styles.displayField}>
            {form.loginId}
          </div>
        </div>

        {/* 신청자 이름 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>신청자 이름</label>
          <div className={styles.displayField}>
            {form.name}
          </div>
        </div>

        {/* 이메일 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>이메일</label>
          <div className={styles.displayField}>
            {form.email}
          </div>
        </div>

        {/* 연락처 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>연락처</label>
          <div className={styles.displayField}>
            {form.phone}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperatorApplicationForm;
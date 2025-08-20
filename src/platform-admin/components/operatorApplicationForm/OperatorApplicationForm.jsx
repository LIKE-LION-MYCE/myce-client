import {
  FaUserTie,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from 'react-icons/fa';
import styles from './OperatorApplicationForm.module.css';

function OperatorApplicationForm({businessData}) {

  const form = {
    companyName: businessData?.companyName || '',
    ceoName: businessData?.ceoName || '',
    email: businessData?.contactEmail || '',
    phone: businessData?.contactPhone || '',
    address: businessData?.address || '',
    businessNumber: businessData?.businessRegistrationNumber || '',
  };

  return (
    <div className={styles.container}>
      <div className={styles.formGrid}>
        {/* 회사명 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>회사명</label>
          <div className={styles.displayField}>
            {form.companyName}
          </div>
        </div>

        {/* 대표명 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>대표명</label>
          <div className={styles.displayField}>
            {form.ceoName}
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

        {/* 주소 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>주소</label>
          <div className={styles.displayField}>
            {form.address}
          </div>
        </div>

        {/* 사업자번호 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>사업자번호</label>
          <div className={styles.displayField}>
            {form.businessNumber}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperatorApplicationForm;
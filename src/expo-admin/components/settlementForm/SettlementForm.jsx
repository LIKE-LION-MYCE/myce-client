import { useState } from 'react';
import styles from './SettlementForm.module.css';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import ToastSuccess from '../../../common/commponents/toastSuccess/ToastSuccess';

const bankOptions = ['토스뱅크', '카카오뱅크', '신한은행', '국민은행', '우리은행'];

function SettlementForm() {
  const [form, setForm] = useState({
    bank: '',
    accountNumber: '',
    accountHolder: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [isPending, setIsPending] = useState(false); // 정산 대기 상태

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSubmit = () => {
    console.log('[정산 요청 정보]', form);
    setIsPending(true);
    triggerToast();
  };

  const handleCancel = () => {
    triggerToast();
  };

  return (
    <div className={styles.container}>
      {showToast && <ToastSuccess />}

      <div className={styles.formGrid}>
        {/* 은행 */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label className={styles.label}>은행</label>
          <select
            name="bank"
            className={styles.inputField}
            value={form.bank}
            onChange={handleChange}
            disabled={isPending}
          >
            <option value="">은행 선택</option>
            {bankOptions.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* 계좌번호 */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label className={styles.label}>계좌번호</label>
          <input
            className={styles.inputField}
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            placeholder="계좌번호 입력"
            disabled={isPending}
          />
        </div>

        {/* 예금주 */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label className={styles.label}>예금주</label>
          <input
            className={styles.inputField}
            name="accountHolder"
            value={form.accountHolder}
            onChange={handleChange}
            placeholder="예금주 입력"
            disabled={isPending}
          />
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.actionBtn} ${isPending ? styles.pendingBtn : styles.submitBtn}`}
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <FaClock className={styles.iconBtn} />
              정산 대기중
            </>
          ) : (
            <>
              <FaCheckCircle className={styles.iconBtn} />
              정산 요청
            </>
          )}
        </button>

        {/* <button
          className={`${styles.actionBtn} ${styles.cancelBtn}`}
          onClick={handleCancel}
          disabled={isPending}
        >
          <FaTimesCircle className={styles.iconBtn} />
          취소
        </button> */}
      </div>
    </div>
  );
}

export default SettlementForm;

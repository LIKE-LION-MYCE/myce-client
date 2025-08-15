import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SettlementForm.module.css';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { requestExpoSettlement } from '../../../api/service/user/memberApi';

const bankOptions = ['토스뱅크', '카카오뱅크', '신한은행', '국민은행', '우리은행'];

function SettlementForm() {
  const { expoId } = useParams();
  const [form, setForm] = useState({
    bank: '',
    accountNumber: '',
    accountHolder: '',
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [isPending, setIsPending] = useState(false); // 정산 대기 상태

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };

  const triggerFailToast = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 5000);
  };

  const handleSubmit = async () => {
    if (!form.bank || !form.accountNumber || !form.accountHolder) {
      triggerFailToast('모든 필드를 입력해주세요.');
      return;
    }

    try {
      // 폼 필드명을 백엔드 DTO에 맞게 매핑
      const settlementData = {
        bankName: form.bank,
        bankAccount: form.accountNumber,
        receiverName: form.accountHolder,
      };

      console.log('[정산 요청 정보]', settlementData);
      
      await requestExpoSettlement(expoId, settlementData);
      
      setIsPending(true);
      triggerSuccessToast();
      
      console.log('정산 요청이 성공적으로 처리되었습니다.');
      
    } catch (error) {
      console.error('정산 요청 실패:', error);
      const message = error.response?.data?.message || '정산 요청 중 오류가 발생했습니다.';
      triggerFailToast(message);
    }
  };

  const handleCancel = () => {
    triggerSuccessToast();
  };

  return (
    <div className={styles.container}>
      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail message={failMessage} />}

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

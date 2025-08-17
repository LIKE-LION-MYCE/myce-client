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
  const [inputWarning, setInputWarning] = useState({ accountNumber: '', accountHolder: '' });
  const [isPending, setIsPending] = useState(false); // 정산 대기 상태

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 유효성 검사 및 경고 메시지 처리
    let filteredValue = value;
    let warningMessage = '';
    
    if (name === 'accountNumber') {
      // 숫자와 하이픈이 아닌 문자가 포함된 경우 경고
      if (/[^0-9-]/.test(value)) {
        warningMessage = '계좌번호는 숫자와 하이픈(-)만 입력 가능합니다.';
      }
      // 계좌번호: 숫자만 허용 (하이픈 포함)
      filteredValue = value.replace(/[^0-9-]/g, '');
    } else if (name === 'accountHolder') {
      // 한글, 영어, 공백이 아닌 문자가 포함된 경우 경고
      if (/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z\s]/.test(value)) {
        warningMessage = '예금주는 한글, 영어, 공백만 입력 가능합니다.';
      }
      // 예금주: 한글, 영어, 공백만 허용 (자모 포함)
      filteredValue = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z\s]/g, '');
    }
    
    // 경고 메시지 업데이트
    setInputWarning(prev => ({ ...prev, [name]: warningMessage }));
    
    // 경고 메시지가 있으면 3초 후 자동 제거
    if (warningMessage) {
      setTimeout(() => {
        setInputWarning(prev => ({ ...prev, [name]: '' }));
      }, 3000);
    }
    
    setForm((prev) => ({ ...prev, [name]: filteredValue }));
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

    // 추가 유효성 검사
    if (!/^[0-9-]+$/.test(form.accountNumber)) {
      triggerFailToast('계좌번호는 숫자와 하이픈(-)만 입력 가능합니다.');
      return;
    }

    if (!/^[가-힣a-zA-Z\s]+$/.test(form.accountHolder)) {
      triggerFailToast('예금주는 한글, 영어, 공백만 입력 가능합니다.');
      return;
    }

    if (form.accountNumber.length < 10) {
      triggerFailToast('계좌번호는 최소 10자리 이상 입력해주세요.');
      return;
    }

    if (form.accountHolder.trim().length < 2) {
      triggerFailToast('예금주는 최소 2글자 이상 입력해주세요.');
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
            placeholder="계좌번호 입력 (숫자와 하이픈만)"
            disabled={isPending}
          />
          {inputWarning.accountNumber && (
            <div style={{ color: '#ff4757', fontSize: '12px', marginTop: '4px' }}>
              {inputWarning.accountNumber}
            </div>
          )}
        </div>

        {/* 예금주 */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label className={styles.label}>예금주</label>
          <input
            className={styles.inputField}
            name="accountHolder"
            value={form.accountHolder}
            onChange={handleChange}
            placeholder="예금주 입력 (한글, 영어만)"
            disabled={isPending}
          />
          {inputWarning.accountHolder && (
            <div style={{ color: '#ff4757', fontSize: '12px', marginTop: '4px' }}>
              {inputWarning.accountHolder}
            </div>
          )}
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

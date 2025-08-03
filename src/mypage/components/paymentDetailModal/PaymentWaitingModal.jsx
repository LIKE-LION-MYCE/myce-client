import PaymentDetailModal from "./PaymentDetailModal";
import styles from "./PaymentDetailModal.module.css";

function PaymentWaitingModal(props) {
  const {
    expoName,
    applicant,
    period,
    amount,
    totalAmount,
    onPay,
    onCancel,
    onClose,
  } = props;
  return (
    <PaymentDetailModal
      expoName={expoName}
      applicant={applicant}
      period={period}
      amount={amount}
      totalAmount={totalAmount}
      onClose={onClose}
    >
      <button className={styles.whiteBtn} onClick={onCancel}>
        취소
      </button>
      <button className={styles.blackBtn} onClick={onPay}>
        결제하기
      </button>
    </PaymentDetailModal>
  );
}
export default PaymentWaitingModal;

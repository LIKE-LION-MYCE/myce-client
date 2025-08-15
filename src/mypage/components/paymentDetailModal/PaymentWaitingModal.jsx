import PaymentDetailModal from "./PaymentDetailModal";
import styles from "./PaymentDetailModal.module.css";

function PaymentWaitingModal(props) {
  const {
    expoName,
    applicant,
    period,
    totalDays,
    dailyUsageFee,
    usageFeeAmount,
    depositAmount,
    premiumDepositAmount,
    totalAmount,
    isPremium,
    commissionRate,
    onPay,
    onCancel,
    onClose,
  } = props;
  
  console.log('PaymentWaitingModal - isPremium:', isPremium);
  console.log('PaymentWaitingModal - premiumDepositAmount:', premiumDepositAmount);
  
  return (
    <PaymentDetailModal
      expoName={expoName}
      applicant={applicant}
      period={period}
      totalDays={totalDays}
      dailyUsageFee={dailyUsageFee}
      usageFeeAmount={usageFeeAmount}
      depositAmount={depositAmount}
      premiumDepositAmount={premiumDepositAmount}
      totalAmount={totalAmount}
      isPremium={isPremium}
      commissionRate={commissionRate}
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

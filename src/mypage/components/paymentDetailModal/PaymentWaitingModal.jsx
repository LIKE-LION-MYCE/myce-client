import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    expoId, // expoId를 props에서 받아야 합니다
    // onPay,
    onCancel,
    onClose,
  } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();

  // '결제하기' 버튼을 클릭했을 때 실행될 함수를 정의
  const handlePaymentSelection = () => {
    // expoId를 URL 파라미터로 전달
    navigate("./payment-selection");
  };

  console.log("PaymentWaitingModal - isPremium:", isPremium);
  console.log(
    "PaymentWaitingModal - premiumDepositAmount:",
    premiumDepositAmount
  );

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
        {t('paymentWaitingModal.buttons.cancel')}
      </button>
      <button className={styles.blackBtn} onClick={handlePaymentSelection}>
        {t('paymentWaitingModal.buttons.pay')}
      </button>
    </PaymentDetailModal>
  );
}
export default PaymentWaitingModal;

import { useTranslation } from "react-i18next";
import PaymentDetailModal from "./PaymentDetailModal";
import styles from "./PaymentDetailModal.module.css";

function PaymentFinishedModal(props) {
  const { t } = useTranslation();
  const { expoName, applicant, period, amount, totalAmount, onClose } = props;
  return (
    <PaymentDetailModal
      expoName={expoName}
      applicant={applicant}
      period={period}
      amount={amount}
      totalAmount={totalAmount}
      onClose={onClose}
    >
      {/* 버튼 없이 내역만 보여주거나, 닫기 버튼만 */}
      <button className={styles.whiteBtn} onClick={onClose}>
        {t('paymentFinishedModal.buttons.close')}
      </button>
    </PaymentDetailModal>
  );
}
export default PaymentFinishedModal;

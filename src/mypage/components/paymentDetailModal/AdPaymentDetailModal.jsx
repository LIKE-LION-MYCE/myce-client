import { useNavigate } from "react-router-dom";
import React from "react";
import { useTranslation } from 'react-i18next';
import styles from "./PaymentDetailModal.module.css";

function AdPaymentDetailModal({
  advertisementTitle,
  applicantName,
  period,
  totalDays,
  feePerDay,
  totalAmount,
  status,
  mode = "payment", // "payment" | "view"
  onCancel,
  onClose,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // '결제하기' 버튼을 클릭했을 때 실행될 함수를 정의
  const handlePaymentSelection = () => {
    // expoId를 URL 파라미터로 전달
    navigate("./payment-selection");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.title}>{t('adPaymentDetailModal.title')}</h2>
        <div className={styles.infoSection}>
          <div>
            <div className={styles.row}>
              <span>{t('adPaymentDetailModal.fields.adTitle')}</span>
              <span>{advertisementTitle}</span>
            </div>
            <div className={styles.row}>
              <span>{t('adPaymentDetailModal.fields.applicant')}</span>
              <span>{applicantName}</span>
            </div>
            <div className={styles.row}>
              <span>{t('adPaymentDetailModal.fields.period')}</span>
              <span>{period}</span>
            </div>
          </div>
          <div className={styles.feeBox}>
            <div className={styles.row}>
              <span>{t('adPaymentDetailModal.fields.totalDays')}</span>
              <span>{totalDays}{t('adPaymentDetailModal.units.days')}</span>
            </div>
            <div className={styles.row}>
              <span>{t('adPaymentDetailModal.fields.dailyFee')}</span>
              <span>{feePerDay?.toLocaleString()}{t('adPaymentDetailModal.units.currency')}</span>
            </div>
            <div className={`${styles.totalRow}`}>
              <span>{t('adPaymentDetailModal.fields.totalAmount')}</span>
              <span className={styles.totalAmount}>
                {totalAmount?.toLocaleString()}{t('adPaymentDetailModal.units.currency')}
              </span>
            </div>
          </div>
        </div>
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>
          {mode === "payment" ? (
            <>
              <button className={styles.whiteBtn} onClick={onCancel}>
                {t('adPaymentDetailModal.buttons.cancel')}
              </button>
              <button
                className={styles.blackBtn}
                onClick={handlePaymentSelection}
              >
                {t('adPaymentDetailModal.buttons.pay')}
              </button>
            </>
          ) : (
            <button className={styles.blackBtn} onClick={onClose}>
              {t('adPaymentDetailModal.buttons.confirm')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdPaymentDetailModal;

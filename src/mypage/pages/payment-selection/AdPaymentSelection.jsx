import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./PaymentSelection.module.css";
import { getAdvertisementPayment } from "../../../api/service/user/memberApi";
import Spinner from "../../../common/components/spinner/Spinner";
import PaymentCardButton from "../../components/paymentButton/PaymentCardButton";
import PaymentTransferButton from "../../components/paymentButton/PaymentTransferButton";

const AdPaymentSelection = () => {
  const { t } = useTranslation();
  const { id: adId } = useParams();
  const navigate = useNavigate();

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!adId) {
        setError(t('paymentSelection.errors.noAdId', '결제 정보를 불러올 수 없습니다: 유효한 광고 ID가 없습니다.'));
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getAdvertisementPayment(adId);
        setPaymentDetails(response.data);
        setError(null);
      } catch (err) {
        console.error("결제 상세 정보 조회 실패:", err);
        setError(t('paymentSelection.errors.loadFailed', '결제 정보를 불러오는데 실패했습니다.'));
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [adId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  const name = paymentDetails.advertisementTitle;
  const buyer = paymentDetails.applicantName;
  const amount = paymentDetails.totalAmount;
  const targetType = "AD";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('paymentSelection.title', '광고 결제하기')}</h1>

      {paymentDetails && (
        <div className={styles.paymentSummary}>
          <h2 className={styles.sectionTitle}>{t('paymentSelection.sections.paymentInfo', '결제 정보')}</h2>
          <div className={styles.summaryItem}>
            <span>광고명</span>
            <span> {name}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>신청자</span>
            <span> {buyer}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.totalAmountLabel}>{t('paymentSelection.summary.totalAmount', '총 결제 금액')}</span>
            <span className={styles.totalAmount}> {amount}{t('paymentSelection.summary.currency', '원')}</span>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('paymentSelection.sections.paymentMethod', '결제 수단')}</h2>

        <PaymentCardButton {...{ name, amount, buyer, targetType }} />
        <PaymentTransferButton {...{ name, amount, buyer, targetType }} />
      </div>
    </div>
  );
};

export default AdPaymentSelection;

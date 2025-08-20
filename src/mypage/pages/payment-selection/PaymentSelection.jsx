import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./PaymentSelection.module.css";
import { getExpoPaymentDetail } from "../../../api/service/user/memberApi";
import Spinner from "../../../common/components/spinner/Spinner";
import PaymentSpinner from "../../../common/components/spinner/PaymentSpinner";

// 3가지 결제 버튼 컴포넌트를 모두 import 합니다.
import PaymentCardButton from "../../components/paymentButton/PaymentCardButton";
import PaymentTransferButton from "../../components/paymentButton/PaymentTransferButton";

const PaymentSelection = () => {
  const { t } = useTranslation();
  const { id: expoId } = useParams();
  const navigate = useNavigate();

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!expoId) {
        setError(
          t('paymentSelection.errors.noExpoId', '결제 정보를 불러올 수 없습니다: 유효한 박람회 ID가 없습니다.')
        );
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getExpoPaymentDetail(expoId);
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
  }, [expoId]);

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

  // 모든 버튼에 공통으로 전달될 임시 props 데이터
  const paymentButtonProps = {
    expoId: expoId,
    ticketId: null, // 참가비 결제에는 ticketId가 없음
    quantity: 1, // 참가비는 1건으로 처리
    name: paymentDetails?.expoTitle
      ? `${paymentDetails.expoTitle} 참가비`
      : "박람회 참가비",
    amount: paymentDetails?.totalAmount || 0,
    usedMileage: 0, // 마일리지 정책이 없으므로 0으로 설정
    savedMileage: 0,
    reserverInfos: [
      {
        // 신청자 정보를 예매자 정보 형식으로 변환
        name: paymentDetails?.applicantName || "신청자",
        email: "test@example.com", // 이메일 정보가 없으므로 임시값 사용
        phone: "010-0000-0000", // 연락처 정보가 없으므로 임시값 사용
      },
    ],
  };
  let calculatedTotal =
    paymentDetails.usageFeeAmount + paymentDetails.depositAmount;

  // 총 결제 금액
  if (paymentDetails.isPremium) {
    calculatedTotal += paymentDetails.premiumDepositAmount;
  }

  const name = paymentDetails.expoTitle;
  const amount = calculatedTotal;
  const buyer = paymentDetails.applicantName;
  const targetType = "EXPO";

  return (
    <div className={styles.container}>
      {paymentProcessing && <PaymentSpinner />}
      <h1 className={styles.title}>{t('paymentSelection.title', '결제하기')}</h1>

      {paymentDetails && (
        <div className={styles.paymentSummary}>
          <h2 className={styles.sectionTitle}>{t('paymentSelection.sections.paymentInfo', '결제 정보')}</h2>
          <div className={styles.summaryItem}>
            <span>박람회명</span>
            <span>{paymentDetails.expoTitle}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>신청자</span>
            <span>{paymentDetails.applicantName}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.totalAmountLabel}>{t('paymentSelection.summary.totalAmount', '총 결제 금액')}</span>
            <span className={styles.totalAmount}>
              {calculatedTotal?.toLocaleString()}{t('paymentSelection.summary.currency', '원')}
            </span>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('paymentSelection.sections.paymentMethod', '결제 수단')}</h2>

        {/* 기존 버튼들을 실제 컴포넌트로 교체 */}
        <PaymentCardButton 
          {...{ name, amount, buyer, targetType }}
          onPaymentStart={() => setPaymentProcessing(true)}
          onPaymentEnd={() => setPaymentProcessing(false)}
        />
        <PaymentTransferButton 
          {...{ name, amount, buyer, targetType }}
          onPaymentStart={() => setPaymentProcessing(true)}
          onPaymentEnd={() => setPaymentProcessing(false)}
        />
      </div>
    </div>
  );
};

export default PaymentSelection;

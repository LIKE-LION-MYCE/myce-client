import React, { useState } from "react";
// SPA 방식의 페이지 이동을 위해 useNavigate를 import 하는 것을 권장합니다.
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "../../../api/lib/axios";
import styles from "./PaymentButton.module.css";
import {
  deleteReservationPending,
} from "../../../api/service/reservation/reservationApi";
import { isTokenExpired } from "../../../api/utils/jwtUtils";
import { requestRefund } from "../../../api/service/payment/RefundService";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import ToastFail from "../../../common/components/toastFail/ToastFail";


function PaymentTransferButton({
  targetType,
  expoId,
  ticketId,
  quantity,
  name,
  amount,
  usedMileage,
  savedMileage,
  reserverInfos,
  sessionId,
  onPaymentStart,
  onPaymentEnd,
}) {
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const buyerName = reserverInfos[0]?.name;
  const buyerEmail = reserverInfos[0]?.email;
  const buyerTel = reserverInfos[0]?.phone;
  const reservationId = searchParams.get("preReservationId");

  const showSuccessMessage = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showFailMessage = (message) => {
    setToastMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  const handlePay = async () => {
    // 모든 개인정보 검증
    const hasIncompleteInfo = reserverInfos.some(info => 
      !info.name || !info.email || !info.birth || !info.phone || !info.gender
    );
    
    if (hasIncompleteInfo) {
      showFailMessage("모든 개인정보를 입력해주세요.");
      return;
    }
    
    // amount가 0 이하이거나, buyerName, buyerEmail 등 필수 정보가 없는 경우를 체크하여 결제를 막는 방어 코드를 추가
    if (amount <= 0 && usedMileage === 0) {
      // 마일리지 전액 사용으로 0원 결제는 예외
      showFailMessage("결제할 금액이 없습니다.");
      return;
    }
    if (!buyerName || !buyerEmail || !buyerTel) {
      showFailMessage("구매자 정보가 올바르지 않습니다.");
      return;
    }
    if (!reservationId) {
      showFailMessage("예약 정보를 찾을 수 없습니다. 다시 시도해 주세요.");
      return;
    }
    if (!window.IMP) {
      showFailMessage("결제 모듈이 준비되지 않았습니다.");
      return;
    }
    if (loading) return;
    setLoading(true);

    let userType = "";

    try {
      // 토큰으로 사용자 타입 판별
      const token = localStorage.getItem("access_token");
      const isGuest = !token || isTokenExpired(token); // 토큰이 없거나 만료되면 비회원

      if (isGuest) {
        console.log("비회원 예매를 시작합니다.");
        userType = "GUEST";
      } else {
        console.log("회원 예매를 시작합니다.");
        userType = "MEMBER";
      }

      window.IMP.init("imp13502610");
      window.IMP.request_pay(
        {
          pg: "uplus",
          pay_method: "trans",
          merchant_uid: "order_" + new Date().getTime(),
          name,
          amount,
          buyer_email: buyerEmail,
          buyer_name: buyerName,
          buyer_tel: buyerTel,
        },
        // 아임포트 결제창 호출 후, 결과는 이 콜백 함수 안에서 비동기적으로 처리
        async function (rsp) {
          if (rsp.success) {
            onPaymentStart?.();
            try {
              // 새로운 통합 API 사용
              const res = await instance.post("/payment/reservation/verify", {
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                amount: amount,
                targetType: targetType,
                targetId: reservationId,
                usedMileage: usedMileage || 0,
                savedMileage: savedMileage || 0,
                reserverInfos: reserverInfos,
                ticketId: ticketId,
                quantity: quantity,
                sessionId: sessionId
              });

              console.log("imp_uid:", rsp.imp_uid);
              console.log("merchant_uid:", rsp.merchant_uid);
              console.log("백엔드 응답 데이터:", res.data);

              if (res.status === 200 && res.data.status === "SUCCESS") {
                onPaymentEnd?.();
                showSuccessMessage("결제 검증 성공! 예매가 완료되었습니다.");
                // 백엔드 응답의 실제 reservationId 사용
                const actualReservationId = res.data.reservationId || reservationId;
                console.log("리다이렉트할 reservationId:", actualReservationId);
                setTimeout(() => {
                  navigate(`/reservation-success/${actualReservationId}`);
                }, 1000);
              } else {
                onPaymentEnd?.();
                showFailMessage(
                  "결제 검증에 실패했습니다. 문제가 지속되면 고객센터로 문의해주세요."
                );
              }
            } catch (err) {
              // '결제는 성공'했지만 '서버 검증' 또는 'DB 처리' 중 실패한 매우 치명적인 상황
              // 이 경우, 서버에서 아임포트 '결제 취소(환불)' API를 호출하여 방금 결제된 금액을 즉시 환불 처리하는 로직을 반드시 구현해야 함.
              // 그렇지 않으면 고객은 돈을 냈는데 예약은 실패한 상태가 됨.
              console.error("서버 처리 실패, 전액 환불을 시도합니다.", err);

              try {
                await requestRefund({
                  impUid: rsp.imp_uid,
                  merchantUid: rsp.merchant_uid,
                  reason: "서버 처리 오류로 인한 자동 환불",
                });
                onPaymentEnd?.();
                showFailMessage(
                  "결제 처리 중 오류가 발생하여 결제가 자동으로 취소되었습니다."
                );
                // reservation 데이터 삭제
                await deleteReservationPending(reservationId);
              } catch (refundError) {
                onPaymentEnd?.();
                showFailMessage("환불 처리에 실패했습니다. 고객센터에 문의해주세요.");
              }
            }
          } else {
            try {
              await deleteReservationPending(reservationId);
              console.log(
                "결제 실패로 인해 사전 예약이 성공적으로 취소되었습니다."
              );
            } catch (cancelError) {
              console.error(
                "사전 예약 취소 처리 중 오류가 발생했습니다.",
                cancelError
              );
            }

            onPaymentEnd?.();
            showFailMessage("결제가 취소되었습니다. 다시 시도해주세요.");

            navigate(`/detail/${expoId}`);
          }
        }
      );
    } catch (e) {
      onPaymentEnd?.();
      showFailMessage(
        "예약 정보 처리 중 오류가 발생했습니다: " +
          (e.response?.data?.message || e.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePay}
        className={`${styles.paymentButton} ${loading ? styles.loading : ''}`}
        disabled={loading}
      >
        {loading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner}></span>
            결제 진행 중...
          </span>
        ) : (
          "계좌 이체"
        )}
      </button>
      {showSuccessToast && <ToastSuccess message={toastMessage} />}
      {showFailToast && <ToastFail message={toastMessage} />}
    </>
  );
}

export default PaymentTransferButton;

import React, { useState, useEffect, useMemo } from "react";
// SPA 방식의 페이지 이동을 위해 useNavigate를 import 하는 것을 권장합니다.
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "../../../api/lib/axios";
import styles from "./PaymentButton.module.css";
import { deleteReservationPending } from "../../../api/service/reservation/reservationApi";
import { isTokenExpired } from "../../../api/utils/jwtUtils";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import ToastFail from "../../../common/components/toastFail/ToastFail";

function PaymentVirtualBankButton({
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
  const [toastMessage, setToastMessage] = useState("");
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
    const hasIncompleteInfo = reserverInfos.some(
      (info) =>
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
      showFailMessage("구매자 정보가 올바른지 않습니다.");
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
          pg: "uplus", // 토스페이먼츠 v1 모듈 pg사
          pay_method: "vbank",
          merchant_uid: "order_" + new Date().getTime(),
          name, // props에서 받아온 상품명
          amount, // props에서 받아온 결제금액
          buyer_email: buyerEmail,
          buyer_name: buyerName,
          buyer_tel: buyerTel,
        },
        async function (rsp) {
          if (rsp.success) {
            onPaymentStart?.();
            // 결제 성공 시 백엔드에 imp_uid, merchant_uid 전달해서 검증 요청
            try {
              // 새로운 통합 API 사용
              const res = await instance.post(
                "/payment/reservation/verify-vbank",
                {
                  impUid: rsp.imp_uid,
                  merchantUid: rsp.merchant_uid,
                  amount: amount,
                  targetType: targetType,
                  usedMileage: usedMileage || 0,
                  savedMileage: savedMileage || 0,
                  reserverInfos: reserverInfos,
                  ticketId: ticketId,
                  quantity: quantity,
                  sessionId: sessionId,
                }
              );

              console.log("imp_uid:", rsp.imp_uid);
              console.log("merchant_uid:", rsp.merchant_uid);

              console.log("백엔드 응답 데이터:", res.data);

              if (res.status === 200 && res.data.status === "PENDING") {
                onPaymentEnd?.();
                showSuccessMessage(
                  "결제 검증 성공! 예매가 완료되었습니다. 내일 자정까지 가상 계좌에 입금해주세요."
                );
                // 백엔드 응답의 실제 reservationId 사용
                const actualReservationId =
                  res.data.reservationId || reservationId;
                console.log("리다이렉트할 reservationId:", actualReservationId);
                setTimeout(() => {
                  navigate(`/reservation-pending/${actualReservationId}`);
                }, 1000);
              } else {
                onPaymentEnd?.();
                showFailMessage(
                  "결제 검증에 실패했습니다. 문제가 지속되면 고객센터로 문의해주세요."
                );
              }
            } catch (err) {
              console.error("서버 처리 실패:", err);
              console.error("에러 응답:", err.response?.data);
              console.error("에러 상태:", err.response?.status);

              onPaymentEnd?.();
              const errorMessage =
                err.response?.data?.message || err.message || "알 수 없는 오류";
              showFailMessage(
                `결제 처리 중 오류가 발생했습니다: ${errorMessage}`
              );
              // 사전 예약 데이터 정리는 백엔드에서 처리
            }
          } else {
            onPaymentEnd?.();
            console.log("결제가 취소되었습니다.");
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
        className={`${styles.paymentButton} ${loading ? styles.loading : ""}`}
        disabled={loading}
      >
        {loading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner}></span>
            처리 중...
          </span>
        ) : (
          "가상 계좌"
        )}
      </button>
      {showSuccessToast && <ToastSuccess message={toastMessage} />}
      {showFailToast && <ToastFail message={toastMessage} />}
    </>
  );
}

export default PaymentVirtualBankButton;

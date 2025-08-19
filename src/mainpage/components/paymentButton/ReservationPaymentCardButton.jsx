import React, { useState } from "react";
// SPA 방식의 페이지 이동을 위해 useNavigate를 import 하는 것을 권장합니다.
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "../../../api/lib/axios";
import styles from "./PaymentButton.module.css";
import {
  updateGuestId,
  deleteReservationPending,
} from "../../../api/service/reservation/reservationApi";
import { isTokenExpired } from "../../../api/utils/jwtUtils";
import { requestRefund } from "../../../api/service/payment/RefundService";

function ReservationPaymentCardButton({
  targetType,
  expoId,
  ticketId,
  quantity,
  name,
  amount,
  usedMileage,
  savedMileage,
  reserverInfos,
}) {
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const buyerName = reserverInfos[0]?.name;
  const buyerEmail = reserverInfos[0]?.email;
  const buyerTel = reserverInfos[0]?.phone;
  const reservationId = searchParams.get("preReservationId");

  const handlePay = async () => {
    // amount가 0 이하이거나, buyerName, buyerEmail 등 필수 정보가 없는 경우를 체크하여 결제를 막는 방어 코드를 추가
    if (amount <= 0 && usedMileage === 0) {
      // 마일리지 전액 사용으로 0원 결제는 예외
      alert("결제할 금액이 없습니다.");
      return;
    }
    if (!buyerName || !buyerEmail || !buyerTel) {
      alert("구매자 정보가 올바르지 않습니다.");
      return;
    }
    if (!reservationId) {
      alert("예약 정보를 찾을 수 없습니다. 다시 시도해 주세요.");
      return;
    }
    if (!window.IMP) {
      alert("결제 모듈이 준비되지 않았습니다.");
      return;
    }
    if (loading) return;
    setLoading(true);

    let userType = "";

    try {
      // 토큰으로 사용자 타입 판별
      const token = localStorage.getItem("access_token");
      const isGuest = isTokenExpired(token); // true이면 비회원, false이면 회원

      if (isGuest) {
        console.log("guestId 생성 및 업데이트");
        await updateGuestId(reservationId, reserverInfos);
        userType = "GUEST";
      } else {
        console.log("회원 예매를 시작합니다.");
        userType = "MEMBER";
      }

      window.IMP.init("imp13502610");
      window.IMP.request_pay(
        {
          pg: "uplus",
          pay_method: "card",
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
            setIsVerifying(true); // 결제 검증 시작
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
                quantity: quantity
              });

              console.log("imp_uid:", rsp.imp_uid);
              console.log("merchant_uid:", rsp.merchant_uid);
              console.log("백엔드 응답 데이터:", res.data);

              setIsVerifying(false); // 검증 완료
              if (res.status === 200 && res.data.status === "SUCCESS") {
                alert("결제 검증 성공! 예매가 완료되었습니다.");
                // 백엔드 응답의 실제 reservationId 사용
                const actualReservationId = res.data.reservationId || reservationId;
                console.log("리다이렉트할 reservationId:", actualReservationId);
                navigate(`/reservation-success/${actualReservationId}`);
              } else {
                alert(
                  "결제 검증에 실패했습니다. 문제가 지속되면 고객센터로 문의해주세요."
                );
              }
            } catch (err) {
              setIsVerifying(false); // 검증 실패시도 오버레이 숨김
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
                alert(
                  "결제 처리 중 오류가 발생하여 결제가 자동으로 취소되었습니다."
                );
                // reservation 데이터 삭제
                await deleteReservationPending(reservationId);
              } catch (refundError) {
                alert("환불 처리에 실패했습니다. 고객센터에 문의해주세요.");
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

            alert("결제가 취소되었습니다. 다시 시도해주세요.");

            navigate(`/detail/${expoId}`);
          }
        }
      );
    } catch (e) {
      alert(
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
          "카드 결제"
        )}
      </button>
      
      {isVerifying && (
        <div className={styles.verificationOverlay}>
          <div className={styles.verificationModal}>
            <div className={styles.verificationSpinner}></div>
            <div className={styles.verificationTitle}>결제 검증 중</div>
            <div className={styles.verificationMessage}>
              결제가 완료되었습니다.<br/>
              서버에서 결제 내역을 확인하고 있습니다...
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReservationPaymentCardButton;

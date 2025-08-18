import React, { useState, useEffect, useMemo } from "react";
// SPA 방식의 페이지 이동을 위해 useNavigate를 import 하는 것을 권장합니다.
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "../../../api/lib/axios";
import styles from "./PaymentButton.module.css";
import {
  updateGuestId,
  deleteReservationPending,
} from "../../../api/service/reservation/reservationApi";
import { isTokenExpired } from "../../../api/utils/jwtUtils";

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
}) {
  const [loading, setLoading] = useState(false);
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
            // 결제 성공 시 백엔드에 imp_uid, merchant_uid 전달해서 검증 요청
            try {
              // 새로운 통합 API 사용
              const res = await instance.post("/payment/reservation/verify-vbank", {
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

              if (res.status === 200 && res.data.status === "PENDING") {
                alert(
                  "결제 검증 성공! 예매가 완료되었습니다. 금일까지 가상 계좌에 입금해주세요."
                );
                navigate(`/reservation-pending/${reservationId}`);
              } else {
                alert(
                  "결제 검증에 실패했습니다. 문제가 지속되면 고객센터로 문의해주세요."
                );
              }
            } catch (err) {
              alert("결제 처리 중 오류가 발생했습니다.");
              // reservation 데이터 삭제
              await deleteReservationPending(reservationId);
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
    <button
      onClick={handlePay}
      className={styles.paymentButton}
      disabled={loading} // 이 부분을 추가
    >
      {loading ? "처리 중..." : "가상 계좌"}
    </button>
  );
}

export default PaymentVirtualBankButton;

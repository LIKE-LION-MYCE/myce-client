import React, { useState } from "react";
// [gemini] SPA 방식의 페이지 이동을 위해 useNavigate를 import 하는 것을 권장합니다.
import { useNavigate } from "react-router-dom";
import instance from "../../../api/lib/axios";
import styles from "./PaymentButton.module.css";
import {
  resolveReservers,
  saveReservationPending,
} from "../../../api/service/reservation/reservationApi";
import { updateMileageForReservation } from "../../../api/service/user/memberApi";
import { saveReservers } from "../../../api/service/reservation/ReserverService";
import { updateReservationStatusConfirm } from "../../../api/service/reservation/reservationApi";
import { updateRemainingQuantity } from "../../../api/service/user/TicketService";

function ReservationPaymentCardButton({
  targetType,
  expoId,
  ticketId,
  quantity,
  name,
  amount,
  // buyerName,
  // buyerEmail,
  // buyerTel,
  usedMileage,
  savedMileage,
  reserverInfos,
}) {
  const [loading, setLoading] = useState(false);
  // [gemini] useNavigate 훅을 사용하기 위해 변수를 선언합니다.
  const navigate = useNavigate();
  const buyerName = reserverInfos[0]?.name;
  const buyerEmail = reserverInfos[0]?.email;
  const buyerTel = reserverInfos[0]?.phone;

  const handlePay = async () => {
    // [gemini] 함수 시작 부분에 amount가 0 이하이거나, buyerName, buyerEmail 등 필수 정보가 없는 경우를 체크하여 결제를 막는 방어 코드를 추가하면 안정성이 높아집니다.
    if (amount <= 0 && usedMileage === 0) {
      // 마일리지 전액 사용으로 0원 결제는 예외
      alert("결제할 금액이 없습니다.");
      return;
    }
    if (!buyerName || !buyerEmail || !buyerTel) {
      alert("구매자 정보가 올바르지 않습니다.");
      return;
    }

    if (!window.IMP) {
      alert("결제 모듈이 준비되지 않았습니다.");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      // [gemini] 이 함수는 서버에서 reserverInfos의 각 사용자가 회원인지 비회원인지 판별하는 역할을 합니다.
      // [gemini] 만약 비회원이라면, 이 API 내부에서 Guest 엔티티를 생성하고 guestId를 반환받는 로직이 포함되어야 합니다.
      const resolvedReserverInfos = await resolveReservers(reserverInfos);
      console.log("POST 1 : ", resolvedReserverInfos);

      const userType = resolvedReserverInfos[0].userType;
      console.log(userType);
      let userId;
      if (userType === "MEMBER") {
        userId = resolvedReserverInfos[0].memberId;
      } else {
        userId = resolvedReserverInfos[0].guestId;
      }
      console.log(userId);
      console.log(resolvedReserverInfos);

      const reservationId = await saveReservationPending({
        expoId: expoId,
        quantity: quantity,
        ticketId: ticketId,
        userType: userType,
        userId: userId,
      });
      console.log("예약 대기 생성 완료, reservationId:", reservationId);

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
        // [gemini] 아임포트 결제창 호출 후, 결과는 이 콜백 함수 안에서 비동기적으로 처리됩니다.
        async function (rsp) {
          if (rsp.success) {
            // [gemini] 가장 중요한 단계입니다. 클라이언트(브라우저)의 결제 성공 결과는 위변조될 수 있으므로, 반드시 서버에 결제 정보를 넘겨 실제 결제 금액과 상태를 검증해야 합니다.
            try {
              const res = await instance.post("/payment/verify", {
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                amount: amount,
                targetType: targetType,
                targetId: reservationId,
                usedMileage: usedMileage || 0,
                savedMileage: savedMileage || 0,
              });

              if (userType === "MEMBER") {
                await updateMileageForReservation(usedMileage, savedMileage);
              }

              await updateReservationStatusConfirm(reservationId);

              await saveReservers(reservationId, reserverInfos);

              await updateRemainingQuantity(ticketId, quantity);

              console.log("imp_uid:", rsp.imp_uid);
              console.log("merchant_uid:", rsp.merchant_uid);

              if (res.status === 200 && res.data.status === "SUCCESS") {
                alert("결제 검증 성공! 예매가 완료되었습니다.");
                // [gemini] window.location.href는 페이지를 새로고침하므로 SPA에서는 navigate를 사용하는 것이 사용자 경험에 더 좋습니다.
                navigate(`/reservation-success/${reservationId}`);
              } else {
                // [gemini] 이 경우는 거의 발생하지 않아야 하지만, 만약을 대비해 서버에 기록(로깅)하고 사용자에게는 일반적인 실패 메시지를 보여주는 것이 좋습니다.
                alert(
                  "결제 검증에 실패했습니다. 문제가 지속되면 고객센터로 문의해주세요."
                );
              }
            } catch (err) {
              // [gemini] '결제는 성공'했지만 '서버 검증' 또는 'DB 처리' 중 실패한 매우 치명적인 상황입니다.
              // [gemini] 이 경우, 서버에서 아임포트 '결제 취소(환불)' API를 호출하여 방금 결제된 금액을 즉시 환불 처리하는 로직을 반드시 구현해야 합니다.
              // [gemini] 그렇지 않으면 고객은 돈을 냈는데 예약은 실패한 상태가 되어버립니다.
              alert(
                "결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요. " +
                  (err.response?.data?.message || err.message)
              );
            }
          } else {
            alert("결제에 실패했습니다: " + rsp.error_msg);
            // [gemini] 사용자가 결제를 중간에 취소한 경우입니다. 이 경우 생성했던 PENDING 상태의 예약을 삭제하거나 CANCELED 상태로 변경하는 API를 호출하는 것이 좋습니다.
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
      disabled={loading}
    >
      {/* [gemini] 로딩 중일 때 버튼 내용을 변경하여 사용자에게 상태를 알려주고, 중복 클릭을 방지합니다. */}
      {loading ? "결제 진행 중..." : "카드 결제"}
    </button>
  );
}

export default ReservationPaymentCardButton;

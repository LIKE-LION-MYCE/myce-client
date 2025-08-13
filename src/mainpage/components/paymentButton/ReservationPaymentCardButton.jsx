import React, { useState } from "react";
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
  buyerName,
  buyerEmail,
  buyerTel,
  usedMileage,
  savedMileage,
  reserverInfos,
}) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!window.IMP) {
      alert("결제 모듈이 준비되지 않았습니다.");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      // POST1 결제 전에 참석자 정보 resolve 호출
      const resolvedReserverInfos = await resolveReservers(reserverInfos);
      console.log("POST 1 : ", resolvedReserverInfos);

      // POST2 예약 대기(CONFIRMED_PENDING) 생성
      // 예약자 정보
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

      // reservation pending 생성
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
          pg: "uplus", // 토스페이먼츠 v1 모듈 pg사
          pay_method: "card",
          merchant_uid: "order_" + new Date().getTime(),
          name,
          amount,
          buyer_email: buyerEmail,
          buyer_name: buyerName,
          buyer_tel: buyerTel,
        },
        async function (rsp) {
          if (rsp.success) {
            // 결제 검증 요청
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
              // payment 저장 로직 따로 하는 거 일단(보류)

              if (userType === "MEMBER") {
                // 사용 마일리지 차감 정보 변경 - PATCH (전체 - 사용 + 적립)
                updateMileageForReservation(usedMileage, savedMileage);
              }

              // status를 CONFIRMED로 변경 - PATCH
              updateReservationStatusConfirm(reservationId);

              // reservationId, reserverInfos 저장 POST
              saveReservers(reservationId, reserverInfos);

              // 결제 완료되면 티켓 수 빼는 것까지. - PATCH
              updateRemainingQuantity(ticketId, quantity);

              // imp_uid, merchant_uid 콘솔에 출력
              console.log("imp_uid:", rsp.imp_uid);
              console.log("merchant_uid:", rsp.merchant_uid);
              // 백엔드에서 검증 성공하면 status === "paid"
              if (res.status === 200 && res.data.status === "SUCCESS") {
                alert("결제 검증 성공! 예매가 완료되었습니다.");
                window.location.href = "/reservation-success";
              } else {
                alert("결제 검증 실패! 관리자 문의");
              }
            } catch (err) {
              alert(
                "서버 통신 오류: " +
                  (err.response?.data?.message || err.message)
              );
            }
          } else {
            alert("결제 실패: " + rsp.error_msg);
          }
        }
      );
    } catch (e) {
      alert(
        "참석자 정보 처리 중 오류 : " + (e.response?.data?.message || e.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePay} className={styles.paymentButton}>
      카드 결제
    </button>
  );
}

export default ReservationPaymentCardButton;

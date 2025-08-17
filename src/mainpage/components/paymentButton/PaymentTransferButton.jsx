import React, { useState } from "react";
// SPA 방식의 페이지 이동을 위해 useNavigate를 import 하는 것을 권장합니다.
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "../../../api/lib/axios";
import styles from "./PaymentButton.module.css";
import { saveReservers } from "../../../api/service/reservation/ReserverService";
import {
  updateReservationStatusConfirm,
  updateGuestId,
  deleteReservationPending,
} from "../../../api/service/reservation/reservationApi";
import { updateRemainingQuantity } from "../../../api/service/user/TicketService";
import { isTokenExpired } from "../../../api/utils/jwtUtils";
import { updateGrade } from "../../../api/service/user/memberApi";
import { generateQrForReservation } from "../../../api/service/qr/qrApi";
import { requestRefund } from "../../../api/service/payment/RefundService";


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

              await updateReservationStatusConfirm(reservationId);

              await saveReservers(reservationId, reserverInfos);

              await updateRemainingQuantity(ticketId, quantity);

              // 회원 등급 업데이트 member_grade의 base_amount
              // reservation에서 회원 ID로 reservation_payment_info 조회해서 그동안의 결제 금액 계산
              // 비교에 따라 업데이트
              if (userType === "MEMBER") {
                await updateGrade();
              }

              console.log("imp_uid:", rsp.imp_uid);
              console.log("merchant_uid:", rsp.merchant_uid);

              if (res.status === 200 && res.data.status === "SUCCESS") {
                // QR 코드 즉시 생성 시도
                try {
                  await generateQrForReservation(reservationId);
                  console.log("QR 코드 생성 완료");
                } catch (qrError) {
                  console.warn("QR 코드 생성 실패 (스케줄러에서 생성됨):", qrError);
                }
                
                alert("결제 검증 성공! 예매가 완료되었습니다.");
                navigate(`/reservation-success/${reservationId}`);
              } else {
                alert(
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
    <button
      onClick={handlePay}
      className={styles.paymentButton}
      disabled={loading}
    >
      {/* 로딩 중일 때 버튼 내용을 변경하여 사용자에게 상태를 알려주고, 중복 클릭을 방지합니다. */}
      {loading ? "결제 진행 중..." : "계좌 이체"}
    </button>
  );
}

export default PaymentTransferButton;

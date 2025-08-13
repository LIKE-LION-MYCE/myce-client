import React from "react";
import instance from "../../../api/lib/axios";
import styles from "./PaymentButton.module.css";

/**
 * props 설명
 * - amount: 결제 금액(서버에서도 최종 검증)
 * - name: 상품명
 * - buyerName / buyerEmail / buyerTel: 구매자 정보(결제창 표시용)
 * - targetType / targetId / usedMileage / savedMileage: 서버 검증/저장에 필요한 값
 */
function PaymentEasyPayButton({
  amount,
  name,
  buyerName,
  buyerEmail,
  buyerTel,
  savedMileage,
}) {
  const handlePay = () => {
    if (!window.IMP) {
      alert("결제 모듈이 준비되지 않았습니다.");
      return;
    }

    window.IMP.init("imp13502610");
    window.IMP.request_pay(
      {
        pg: "uplus", // 토스페이먼츠 v1 모듈 pg사
        pay_method: "trans",
        merchant_uid: "order_" + new Date().getTime(),
        name, // props에서 받아온 상품명
        amount, // props에서 받아온 결제금액
        buyer_email: buyerEmail,
        buyer_name: buyerName,
        buyer_tel: buyerTel,
      },
      async function (rsp) {
        if (rsp.success) {
          // 결제 검증 요청
          try {
            // imp_uid, merchant_uid, amount를 백엔드로 전송!
            const res = await instance.post("/payment/verify", {
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              amount: amount,
              targetType: "RESERVATION",
              targetId: 45,
              usedMileage: 0,
              savedMileage: 0,
            });
            // imp_uid, merchant_uid 콘솔에 출력
            console.log("imp_uid:", rsp.imp_uid);
            console.log("merchant_uid:", rsp.merchant_uid);
            // 백엔드에서 검증 성공하면 status === "paid"
            if (res.data.status && res.data.status.toLowerCase() === "paid") {
              alert("결제 검증 성공! 예매가 완료되었습니다.");
              window.location.href = "/reservation-success";
            } else {
              alert("결제 검증 실패! 관리자 문의");
            }
          } catch (err) {
            alert(
              "서버 통신 오류: " + (err.response?.data?.message || err.message)
            );
          }
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <button onClick={handlePay} className={styles.paymentButton}>
      계좌 이체(아직 개발 전)
    </button>
  );
}

export default PaymentEasyPayButton;

import React from "react";
import instance from "../../../api/lib/axios";
import styles from "./PaymentButton.module.css";

function PaymentVirtualBankButton({
  amount,
  name,
  buyerName,
  buyerEmail,
  buyerTel,
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
            const res = await instance.post("/payment/verify-vbank", {
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              amount: amount,
              targetType: "RESERVATION",
              targetId: 48,
              usedMileage: 0,
              savedMileage: 0,
            });
            if (res.status === 200 && res.data.status === "PENDING") {
              alert(
                "결제 검증 성공! 예매가 완료되었습니다. 기한 내에 가상 계좌에 입금해주세요."
              );
              // 여기에 결제 정보 저장되어야 겠네
              window.location.href = "/reservation-success";
            } else {
              alert("결제 검증 실패! 관리자 문의");
            }
          } catch (err) {
            alert("서버 통신 오류: " + err.message);
          }
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return <button onClick={handlePay} className={styles.paymentButton}>가상 계좌</button>;
}

export default PaymentVirtualBankButton;

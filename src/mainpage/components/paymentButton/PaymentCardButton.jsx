import React from "react";
import axios from "../../../api/lib/axios";

function PaymentCardButton({ amount, name, buyerName, buyerEmail, buyerTel }) {
  const handlePay = () => {
    if (!window.IMP) {
      alert("결제 모듈이 준비되지 않았습니다.");
      return;
    }

    window.IMP.init("imp13502610");
    window.IMP.request_pay(
      {
        pg: "uplus", // 토스페이먼츠 v1 모듈 pg사
        pay_method: "card",
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
            const res = await axios.post("/payment/complete", {
              imp_uid: rsp.imp_uid,
              merchant_uid: rsp.merchant_uid,
            });
            if (res.data.verified) {
              alert("결제 검증 성공! 예매가 완료되었습니다.");
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

  return <button onClick={handlePay}>결제하기</button>;
}

export default PaymentCardButton;

import React, { useState } from "react";
// SPA 방식의 페이지 이동을 위해 useNavigate를 import 하는 것을 권장합니다.
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../api/lib/axios";
import styles from "./PaymentButton.module.css";
import { requestRefund } from "../../../api/service/payment/RefundService";

function PaymentTransferButton({ name, amount, buyer, targetType }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handlePay = async () => {
    if (!window.IMP) {
      alert("결제 모듈이 준비되지 않았습니다.");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      window.IMP.init("imp13502610");
      window.IMP.request_pay(
        {
          pg: "uplus",
          pay_method: "trans",
          merchant_uid: "order_" + new Date().getTime(),
          name,
          amount,
          buyer_name: buyer,
          buyer_tel: "010-1234-5678", // 임의값 넣어주기. 안 그러면 undefined
        },
        // 아임포트 결제창 호출 후, 결과는 이 콜백 함수 안에서 비동기적으로 처리
        async function (rsp) {
          if (rsp.success) {
            try {
              const res = await instance.post(`/payment/verify`, {
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                amount: amount,
                targetId: id,
                targetType: targetType,
              });

              console.log("imp_uid:", rsp.imp_uid);
              console.log("merchant_uid:", rsp.merchant_uid);

              if (res.status === 200 && res.data.status === "SUCCESS") {
                if (targetType === "EXPO") {
                  alert("결제 검증 성공! 박람회 결제가 완료되었습니다.");
                  navigate(`/mypage/expo-status/${id}`);
                } else {
                  alert("결제 검증 성공! 광고 결제가 완료되었습니다.");
                  navigate(`/mypage/ads-status/${id}`);
                }
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
              } catch (refundError) {
                alert("환불 처리에 실패했습니다. 고객센터에 문의해주세요.");
              }
            }
          } else {
            alert("결제가 취소되었습니다. 다시 시도해주세요.");
            if (targetType === "EXPO") {
              navigate(`/mypage/expo-status/${id}`);
            } else {
              navigate(`/mypage/ads-status/${id}`);
            }
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

import { useParams } from "react-router-dom";
import { useState } from "react";
import styles from "./AdCancelSummaryModal.module.css";
import { requestRefund } from "../../../api/service/payment/RefundService";
import { getImpUid } from "../../../api/service/payment/RefundService";
import { updateAdStatus } from "../../../api/service/user/advertisementApi";
import { updateAdPaymentInfoStatus } from "../../../api/service/payment/PaymentService";

function SettlementSummaryModal({ isOpen, onClose, onSubmit, cancelForm }) {
  const { id } = useParams(); // URL 경로에서 {id} 부분을 가져옴
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // '환불 승인' 버튼 클릭 시 실행될 내부 함수
  const handleRefundSubmit = async () => {
    const impUid = await getImpUid("AD", id);
    // cancelForm prop에 API 호출에 필요한 ID가 포함되어 있어야 합니다.
    // 예: cancelForm.adId, cancelForm.paymentId
    if (!cancelForm?.adId || !cancelForm?.paymentId) {
      alert("환불 처리에 필요한 정보가 부족합니다.");
      return;
    }

    setIsLoading(true);
    setError(null); // 이전 에러 메시지 초기화

    try {
      // 전체 환불 API 호출
      await requestRefund({
        impUid: impUid,
        reason: "광고 게시 대기 중 전체 환불",
      });
      // Advertisement 상태 변경 API 호출
      await updateAdStatus(id, {
        advertisementStatus: "CANCELED",
      });
      // AdPaymentInfoStatus 상태 변경 API 호출
      await updateAdPaymentInfoStatus(id, {
        paymentStatus: "REFUNDED",
      });

      // 모든 API 호출 성공 시
      alert("환불 처리가 성공적으로 완료되었습니다.");
      if (onSuccess) {
        onSuccess(); // 부모 컴포넌트에 성공을 알림 (모달 닫기, 목록 새로고침 등)
      }
    } catch (err) {
      console.error("환불 처리 중 오류 발생:", err);
      setError("환불 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>환불 승인</h2>

        {/* 박람회/신청자 정보 */}
        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>배너 제목</span>
            <span className={styles.value}>{cancelForm?.title || "-"}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>신청자</span>
            <span className={styles.value}>
              {cancelForm?.requesterName || "-"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>게시 기간</span>
            <span className={styles.value}>
              {cancelForm?.startAt} ~ {cancelForm?.endAt}
            </span>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>결제 수단</span>
            <span className={styles.value}>
              {cancelForm?.paymentType === "CARD" ? "카드 결제" : "기타"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>결제사</span>
            <span className={styles.value}>
              {cancelForm?.paymentCompanyName || "-"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>결제 계좌/카드번호</span>
            <span className={styles.value}>
              {cancelForm?.paymentAccountInfo || "-"}
            </span>
          </div>
        </div>

        {/* 금액 정보 */}
        <div className={styles.feeBox}>
          <div className={styles.row}>
            <span className={styles.label}>총 결제 금액</span>
            <span className={styles.amount}>
              {cancelForm?.totalAmount?.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>
            취소
          </button>
          <button className={styles.submitBtn} onClick={handleRefundSubmit}>
            환불 승인
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettlementSummaryModal;

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./AdCancelSummaryModal.module.css";
import { processAdRefund } from "../../../api/service/payment/AdRefundService";
import { denyCancelBanner } from "../../../api/service/platform-admin/banner/BannerService";

function SettlementSummaryModal({ isOpen, onClose, onSubmit, cancelForm }) {
  const { id } = useParams(); // URL 경로에서 {id} 부분을 가져옴
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // 부분환불 여부 판단: 게시 시작일이 현재보다 이전이면 부분환불
  const today = new Date();
  const startDate = cancelForm?.startAt ? new Date(cancelForm.startAt) : null;
  const isPartialRefund = startDate && startDate <= today;

  const handleCancelDeny = async () => {
    try {
      await denyCancelBanner(id);
      alert("취소 거절에 성공했습니다.");
      onClose;
      navigate(-1);
    } catch (err) {
      console.log("취소 거부 실패 : ", err);
    }
  }

  // '환불 승인' 버튼 클릭 시 실행될 내부 함수
  const handleRefundSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const refundData = {
        adId: parseInt(id),
        reason: isPartialRefund
          ? "게시 중 부분 환불"
          : "광고 게시 대기 중 전체 환불",
        cancelAmount: isPartialRefund ? cancelForm.totalAmount : null,
      };

      await processAdRefund(refundData);

      alert("환불 처리가 성공적으로 완료되었습니다.");
      onClose();
      if (onSubmit) {
        onSubmit();
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
        <h2 className={styles.title}>
          {isPartialRefund ? "부분 환불 승인" : "전체 환불 승인"}
        </h2>

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
            <span className={styles.label}>총 환불 금액</span>
            <span className={styles.amount}>
              {cancelForm?.totalAmount?.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className={styles.actionBox}>
          <button className={styles.submitBtn} onClick={handleRefundSubmit}>
            {isPartialRefund ? "부분 환불 승인" : "전체 환불 승인"}
          </button>
          <button className={styles.submitBtn} onClick={handleCancelDeny}>
            환불 거부
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettlementSummaryModal;

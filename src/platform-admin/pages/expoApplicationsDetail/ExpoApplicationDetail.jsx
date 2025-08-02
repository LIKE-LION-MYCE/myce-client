import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ExpoApplicationDetail.module.css';
import ExpoApplicationForm from '../../components/expoApplicationForm/ExpoApplicationForm';
import OperatorApplicationForm from '../../components/operatorApplicationForm/OperatorApplicationForm';
import RejectReasonModal from '../../components/rejectReasonModal/RejectReasonModal';
import RejectReasonViewModal from '../../components/rejectReasonViewModal/RejectReasonViewModal';
import PaymentSummaryModal from '../../components/paymentSummaryModal/PaymentSummaryModal';
import PaymentDetailModal from '../../components/paymentDetailModal/PaymentDetailModal';
import CancelDetailModal from '../../components/cancelDetailModal/cancelDetailModal';
import SettlementDetailModal from '../../components/settlementDetailModal/SettlementDetailModal';
import SettlementSummaryModal from '../../components/settlementSummaryModal/SettlementSummaryModal';

const statusClassMap = {
  PENDING: '승인_대기',
  APPROVED: '승인_완료',
  REJECTED: '승인_거절',
  CANCELED: '취소_완료',
  SETTLE_PENDING: '정산_대기',
  SETTLED: '정산_완료',
};

const statusTextMap = {
  승인_대기: '승인 대기',
  승인_완료: '승인 완료',
  승인_거절: '승인 거절',
  취소_완료: '취소 완료',
  정산_대기: '정산 대기',
  정산_완료: '정산 완료',
};

function ExpoApplicationDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [showRejectViewModal, setShowRejectViewModal] = useState(false);
  const [showCancelDetail, setShowCancelDetail] = useState(false);
  const [showSettlementDetail, setShowSettlementDetail] = useState(false);
  const [showSettlementSummary, setShowSettlementSummary] = useState(false);

  const rawStatus = location.state?.expoStatus;
  const statusClass = statusClassMap[rawStatus];
  const statusText = statusTextMap[statusClass];

  const rejectReason = '심사 기준 미달로 인해 반려되었습니다.';

  const handleBack = () => {
    navigate(-1);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = (reason) => {
    console.log('거절 사유:', reason);
    setShowRejectModal(false);
  };

  const handleApprove = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    console.log('결제 요청 처리 로직 실행');
    setShowPaymentModal(false);
  };

  const handleSettlementSubmit = () => {
    console.log('정산 요청 처리 로직 실행');
    setShowSettlementSummary(false);
  };

  let buttonGroup = null;

  if (rawStatus === 'PENDING') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.rejectBtn} onClick={handleReject}>거절</button>
        <button className={styles.approveBtn} onClick={handleApprove}>승인</button>
      </div>
    );
  } else if (rawStatus === 'APPROVED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowPaymentDetail(true)}>결제 내역</button>
      </div>
    );
  } else if (rawStatus === 'REJECTED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowRejectViewModal(true)}>거절 사유</button>
      </div>
    );
  } else if (rawStatus === 'CANCELED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowCancelDetail(true)}>취소 내역</button>
        <button className={styles.approveBtn} onClick={() => setShowSettlementDetail(true)}>정산 내역</button>
      </div>
    );
  } else if (rawStatus === 'SETTLE_PENDING') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowPaymentDetail(true)}>결제 내역</button>
        <button className={styles.approveBtn} onClick={() => setShowSettlementSummary(true)}>정산 요청</button>
      </div>
    );
  } else if (rawStatus === 'SETTLED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowPaymentDetail(true)}>결제 내역</button>
        <button className={styles.approveBtn} onClick={() => setShowSettlementDetail(true)}>정산 내역</button>
      </div>
    );
  }

  return (
    <div className={styles.operatorContainer}>
      {/* 상단 제목 및 상태 뱃지 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <button className={styles.backArrow} onClick={handleBack}>←</button>
          <h4 className={styles.sectionTitle}>박람회 신청 상세</h4>
          {statusClass && (
            <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
              {statusText}
            </span>
          )}
        </div>
        <ExpoApplicationForm />
      </div>

      {/* 신청자 정보 */}
      <div className={styles.section}>
        <OperatorApplicationForm />
      </div>

      {/* 버튼 그룹 */}
      {buttonGroup}

      {/* 모달들 */}
      <RejectReasonModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
      />

      <RejectReasonViewModal
        isOpen={showRejectViewModal}
        onClose={() => setShowRejectViewModal(false)}
        reason={rejectReason}
      />

      <PaymentSummaryModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
      />

      <PaymentDetailModal
        isOpen={showPaymentDetail}
        onClose={() => setShowPaymentDetail(false)}
      />

      <CancelDetailModal
        isOpen={showCancelDetail}
        onClose={() => setShowCancelDetail(false)}
      />

      <SettlementDetailModal
        isOpen={showSettlementDetail}
        onClose={() => setShowSettlementDetail(false)}
      />

      <SettlementSummaryModal
        isOpen={showSettlementSummary}
        onClose={() => setShowSettlementSummary(false)}
        onSubmit={handleSettlementSubmit}
      />
    </div>
  );
}

export default ExpoApplicationDetail;
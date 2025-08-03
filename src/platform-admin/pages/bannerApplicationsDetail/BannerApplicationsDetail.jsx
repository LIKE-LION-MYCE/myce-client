import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BannerApplicationsDetail.module.css';
import BannerApplicationForm from '../../components/bannerApplicationForm/BannerApplicationForm';
import OperatorApplicationForm from '../../components/operatorApplicationForm/OperatorApplicationForm';
import RejectReasonModal from '../../components/rejectReasonModal/RejectReasonModal';
import RejectReasonViewModal from '../../components/rejectReasonViewModal/RejectReasonViewModal';
import PaymentSummaryModal from '../../components/paymentSummaryModal/PaymentSummaryModal';
import PaymentDetailModal from '../../components/paymentDetailModal/PaymentDetailModal';
import SettlementDetailModal from '../../components/settlementDetailModal/SettlementDetailModal';

const statusClassMap = {
  PENDING_APPROVAL: '승인_대기',
  WAITING_PAYMENT: '결제_대기',
  ENDED: '게시_종료',
  REJECTED: '승인_거절',
};

const statusTextMap = {
  승인_대기: '승인 대기',
  결제_대기: '결제 대기',
  게시_종료: '게시 종료',
  승인_거절: '승인 거절',
};

function BannerApplicationsDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [showRejectViewModal, setShowRejectViewModal] = useState(false);
  const [showSettlementDetail, setShowSettlementDetail] = useState(false);

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

  let buttonGroup = null;

  if (rawStatus === 'PENDING_APPROVAL') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.rejectBtn} onClick={handleReject}>거절</button>
        <button className={styles.approveBtn} onClick={handleApprove}>승인</button>
      </div>
    );
  } else if (rawStatus === 'WAITING_PAYMENT') {
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
  } else if (rawStatus === 'ENDED') {
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
          <h4 className={styles.sectionTitle}>배너 신청 상세</h4>
          {statusClass && (
            <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
              {statusText}
            </span>
          )}
        </div>
        <BannerApplicationForm />
      </div>

      {/* 신청자 정보 */}
      <div className={styles.section}>
        <OperatorApplicationForm />
      </div>

      {/* 버튼 그룹 */}
      {buttonGroup}

      {/* 모달 */}
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

      <SettlementDetailModal
        isOpen={showSettlementDetail}
        onClose={() => setShowSettlementDetail(false)}
      />
    </div>
  );
}

export default BannerApplicationsDetail;
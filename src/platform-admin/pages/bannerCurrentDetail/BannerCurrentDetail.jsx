import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BannerCurrentDetail.module.css';
import BannerApplicationForm from '../../components/bannerApplicationForm/BannerApplicationForm';
import OperatorApplicationForm from '../../components/operatorApplicationForm/OperatorApplicationForm';
import PaymentDetailModal from '../../components/paymentDetailModal/PaymentDetailModal';
import SettlementDetailModal from '../../components/settlementDetailModal/SettlementDetailModal';
import SettlementSummaryModal from '../../components/settlementSummaryModal/SettlementSummaryModal';

const statusClassMap = {
  PENDING: '취소_대기',
  POSTING: '게시중',
};

const statusTextMap = {
  취소_대기: '취소 대기',
  게시중: '게시중',
};

function BannerCurrentDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSettlementSummary, setShowSettlementSummary] = useState(false);
  const [showSettlementDetail, setShowSettlementDetail] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);

  const rawStatus = location.state?.bannerStatus;
  const statusClass = statusClassMap[rawStatus];
  const statusText = statusTextMap[statusClass];

  const handleBack = () => {
    navigate(-1);
  };

  const handleSettlementSubmit = () => {
    console.log('✅ 정산 요청 처리 완료');
    setShowSettlementSummary(false);
  };

  let buttonGroup = null;

  if (rawStatus === 'PENDING') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button
          className={styles.approveBtn}
          onClick={() => setShowSettlementSummary(true)}
        >
          취소 승인
        </button>
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
        <BannerApplicationForm />
      </div>

      {/* 신청자 정보 */}
      <div className={styles.section}>
        <OperatorApplicationForm />
      </div>

      {/* 버튼 그룹 */}
      {buttonGroup}

      {/* 모달들 */}
      <SettlementSummaryModal
        isOpen={showSettlementSummary}
        onClose={() => setShowSettlementSummary(false)}
        onSubmit={handleSettlementSubmit}
      />

      <SettlementDetailModal
        isOpen={showSettlementDetail}
        onClose={() => setShowSettlementDetail(false)}
      />

      <PaymentDetailModal
        isOpen={showPaymentDetail}
        onClose={() => setShowPaymentDetail(false)}
      />
    </div>
  );
}

export default BannerCurrentDetail;
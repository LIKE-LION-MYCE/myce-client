import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ExpoCurrentDetail.module.css';
import ExpoApplicationForm from '../../components/expoApplicationForm/ExpoApplicationForm';
import ApplicantForm from '../../components/applicantForm/ApplicantForm';
import OperatorApplicationForm from '../../components/operatorApplicationForm/OperatorApplicationForm';
import ExpoPaymentDetailModal from '../../components/expoPaymentDetailModal/ExpoPaymentDetailModal';
import SettlementDetailModal from '../../components/settlementDetailModal/SettlementDetailModal';
import ExpoAdminDetailModal from '../../components/expoAdminDetailModal/ExpoAdminDetailModal';
import SettlementSummaryModal from '../../components/settlementSummaryModal/SettlementSummaryModal';
import CancelDetailModal from '../../components/cancelDetailModal/cancelDetailModal';
import { fetchExpoDetail, approveCancellation, approveSettlement, fetchPaymentInfo, fetchCancelInfo } from '../../../api/service/platform-admin/expo/ExpoService';

const statusClassMap = {
  PENDING_CANCEL: '취소_대기',
  PENDING_PAYMENT: '결제_대기',
  PENDING_PUBLISH: '게시_대기',
  PUBLISHED: '게시중',
  PUBLISH_ENDED: '게시_종료',
  SETTLEMENT_REQUESTED: '정산_요청',
  COMPLETED: '종료됨',
  CANCELLED: '취소_완료',
};

const statusTextMap = {
  취소_대기: '취소 대기',
  결제_대기: '결제 대기',
  게시_대기: '게시 대기',
  게시중: '게시 중',
  게시_종료: '게시 종료',
  정산_요청: '정산 요청',
  종료됨: '종료됨',
  취소_완료: '취소 완료',
};

function ExpoCurrentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAdminList, setShowAdminList] = useState(false);
  const [showSettlementSummary, setShowSettlementSummary] = useState(false);
  const [showSettlementDetail, setShowSettlementDetail] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [showCancelDetail, setShowCancelDetail] = useState(false);
  const [cancelDetail, setCancelDetail] = useState(null);

  // 박람회 상세 정보 로드
  const loadExpoDetail = async () => {
    try {
      setLoading(true);
      const response = await fetchExpoDetail(id);
      setExpo(response);
      if (expo?.status === 'PUBLISHED' || expo?.status === 'PENDING_CANCEL') {
        console.log("관리자 정보 불러오는 중");

      }
    } catch (error) {
      console.error('현재 박람회 상세 정보 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadExpoDetail();
    }
  }, [id]);

  const statusClass = expo ? statusClassMap[expo.status] : '';
  const statusText = statusTextMap[statusClass] || '알 수 없음';

  const handleBack = () => {
    navigate(-1);
  };

  const handleAdminListDetail = () => {
    console.log("모달 활성화");
    setShowAdminList(true);
  }

  const handleSettlementSubmit = () => {
    setShowSettlementSummary(false);
  };

  // 취소 내역 조회 및 모달 열기
  const handleCancelDetailView = async () => {
    try {
      const cancelInfo = await fetchCancelInfo(id);
      setCancelDetail(cancelInfo);
      setShowCancelDetail(true);
    } catch (error) {
      console.error('취소 내역 조회 실패:', error);
      alert('취소 내역을 불러올 수 없습니다.');
    }
  };

  // 최종 취소 승인 처리 (모달에서 호출)
  const handleCancelApprove = async () => {
    try {
      await approveCancellation(id);
      alert('취소 승인이 완료되었습니다.');
      setShowCancelDetail(false);
      // 상세 정보 다시 로드하여 상태 업데이트
      await loadExpoDetail();
      // 목록 페이지로 이동
      navigate('/platform/admin/expoCurrent');
    } catch (error) {
      console.error('박람회 취소 승인 실패:', error);
      alert('박람회 취소 승인 처리에 실패했습니다.');
    }
  };

  // 정산 승인 처리
  const handleSettlementApprove = async () => {
    try {
      await approveSettlement(id);
      // 상세 정보 다시 로드하여 상태 업데이트
      await loadExpoDetail();
      // 목록 페이지로 이동
      navigate('/platform/admin/expoCurrent');
    } catch (error) {
      console.error('박람회 정산 승인 실패:', error);
      alert('박람회 정산 승인 처리에 실패했습니다.');
    }
  };

  // 결제 정보 로드
  const handlePaymentDetailOpen = async () => {
    try {
      const response = await fetchPaymentInfo(id);
      setPaymentDetail(response);
      setShowPaymentDetail(true);
    } catch (error) {
      console.error('결제 정보 조회 실패:', error);
      alert('결제 정보를 불러올 수 없습니다.');
    }
  };

  // 취소/환불 정보 로드
  const handleCancelDetailOpen = async () => {
    try {
      setShowCancelDetail(true); // 모달 먼저 열기
      const response = await fetchCancelInfo(id);
      setCancelDetail(response);
    } catch (error) {
      console.error('취소/환불 정보 조회 실패:', error);
      setShowCancelDetail(false);
      alert('취소/환불 정보를 불러올 수 없습니다.');
    }
  };

  let buttonGroup = null;
  let adminListButton = null;

  // 승인 대기와 승인 거절을 제외한 모든 상태에서 결제 정보 표시
  const showPaymentInfo = expo?.status &&
    !['PENDING_APPROVAL', 'REJECTED'].includes(expo.status);

  if (expo?.status === 'PUBLISHED' || expo?.status === 'PENDING_CANCEL'
  || expo?.status === 'CANCELLED' || expo?.status === 'PUBLISH_ENDED'
  || expo?.status === 'SETTLEMENT_REQUESTED' || expo?.status === 'COMPLETED'
  ) {
    adminListButton = (
      <div>
        <button
          className={styles.infoBtnShort}
          onClick={handleAdminListDetail}
        >
          관리자 정보
        </button>
      </div>
    );
  }


  if (expo?.status === 'PENDING_CANCEL') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button
          className={styles.infoBtn}
          onClick={handlePaymentDetailOpen}
        >
          결제 정보
        </button>
        <button
          className={styles.approveBtn}
          onClick={handleCancelDetailView}
        >
          취소 승인
        </button>
      </div>
    );
  } else if (expo?.status === 'CANCELLED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button
          className={styles.infoBtn}
          onClick={handlePaymentDetailOpen}
        >
          결제 정보
        </button>
        <button
          className={styles.infoBtn}
          onClick={handleCancelDetailOpen}
        >
          취소/환불 정보
        </button>
      </div>
    );
  } else if (expo?.status === 'SETTLEMENT_REQUESTED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button
          className={styles.infoBtn}
          onClick={handlePaymentDetailOpen}
        >
          결제 정보
        </button>
        <button
          className={styles.approveBtn}
          onClick={() => setShowSettlementDetail(true)}
        >
          정산 정보 조회
        </button>
      </div>
    );
  } else if (expo?.status === 'COMPLETED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button
          className={styles.infoBtn}
          onClick={handlePaymentDetailOpen}
        >
          결제 정보
        </button>
        <button
          className={styles.approveBtn}
          onClick={() => setShowSettlementDetail(true)}
        >
          정산 완료 정보
        </button>
      </div>
    );
  } else if (expo?.status === 'PUBLISH_ENDED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button
          className={styles.infoBtn}
          onClick={handlePaymentDetailOpen}
        >
          결제 정보
        </button>
        <button
          className={styles.approveBtn}
          onClick={() => setShowSettlementDetail(true)}
        >
          정산 정보 조회
        </button>
      </div>
    );
  } else if (showPaymentInfo) {
    // 나머지 모든 결제 완료 상태들 (PENDING_PAYMENT, PENDING_PUBLISH, PUBLISHED 등)
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button
          className={styles.infoBtn}
          onClick={handlePaymentDetailOpen}
        >
          결제 정보
        </button>
      </div>
    );
  }

  if (loading) {
    return <div>로딩 중...</div>;
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
          {/* 관리자 목록 버튼 */}
          {adminListButton}
        </div>
        <ExpoApplicationForm expoData={expo} />
      </div>

      {/* 신청자 정보 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>신청자 정보</h4>
        <ApplicantForm applicantData={expo?.applicant} />
      </div>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>운영사 정보</h4>
        <OperatorApplicationForm businessData={expo?.business} />
      </div>


      {/* 버튼 그룹 */}
      {buttonGroup}

      <ExpoAdminDetailModal
        isOpen={showAdminList}
        onClose={() => setShowAdminList(false)}
      />

      {/* 모달들 */}
      <SettlementSummaryModal
        isOpen={showSettlementSummary}
        onClose={() => setShowSettlementSummary(false)}
        onSubmit={handleSettlementSubmit}
      />

      <SettlementDetailModal
        isOpen={showSettlementDetail}
        onClose={() => setShowSettlementDetail(false)}
        expoId={id}
        readOnly={expo?.status === 'PUBLISH_ENDED'}
        onSettlementApprove={async () => {
          await loadExpoDetail(); // 상태 업데이트
        }}
      />

      <ExpoPaymentDetailModal
        isOpen={showPaymentDetail}
        onClose={() => setShowPaymentDetail(false)}
        paymentDetail={paymentDetail}
      />

      <CancelDetailModal
        isOpen={showCancelDetail}
        onClose={() => setShowCancelDetail(false)}
        cancelDetail={cancelDetail}
        onApprove={expo?.status === 'PENDING_CANCEL' ? handleCancelApprove : null}
        isPendingCancel={expo?.status === 'PENDING_CANCEL'}
      />
    </div>
  );
}

export default ExpoCurrentDetail;
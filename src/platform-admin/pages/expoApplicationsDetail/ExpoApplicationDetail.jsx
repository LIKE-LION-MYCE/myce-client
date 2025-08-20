import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ExpoApplicationDetail.module.css';
import ExpoApplicationForm from '../../components/expoApplicationForm/ExpoApplicationForm';
import ApplicantForm from '../../components/applicantForm/ApplicantForm';
import OperatorApplicationForm from '../../components/operatorApplicationForm/OperatorApplicationForm';
import RejectReasonModal from '../../components/rejectReasonModal/RejectReasonModal';
import RejectReasonViewModal from '../../components/rejectReasonViewModal/RejectReasonViewModal';
import PaymentSummaryModal from '../../components/paymentSummaryModal/PaymentSummaryModal';
import ExpoPaymentDetailModal from '../../components/expoPaymentDetailModal/ExpoPaymentDetailModal';
import CancelDetailModal from '../../components/cancelDetailModal/cancelDetailModal';
import { fetchExpoDetail, approveExpo, rejectExpo, fetchPaymentInfo, fetchPaymentPreview, fetchRejectInfo, fetchCancelInfo, approveCancellation } from '../../../api/service/platform-admin/expo/ExpoService';

const statusClassMap = {
  PENDING_APPROVAL: '승인_대기',
  PENDING_PAYMENT: '승인_완료',
  PENDING_CANCEL: '취소_대기',
  REJECTED: '승인_거절',
  CANCELLED: '취소_완료',
};

const statusTextMap = {
  승인_대기: '승인 대기',
  승인_완료: '결제 대기',
  취소_대기: '취소 대기',
  승인_거절: '승인 거절',
  취소_완료: '취소 완료',
};

function ExpoApplicationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [showRejectViewModal, setShowRejectViewModal] = useState(false);
  const [showCancelDetail, setShowCancelDetail] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [cancelDetail, setCancelDetail] = useState(null);

  // 박람회 상세 정보 로드
  const loadExpoDetail = async () => {
    try {
      setLoading(true);
      const response = await fetchExpoDetail(id);
      setExpo(response);
      
      // 거절된 경우 거절 사유 조회
      if (response.status === 'REJECTED') {
        try {
          const rejectInfo = await fetchRejectInfo(id);
          setRejectReason(rejectInfo.reason || '거절 사유 없음');
        } catch (error) {
          console.error('거절 사유 조회 실패:', error);
          setRejectReason('거절 사유를 불러올 수 없습니다.');
        }
      }
    } catch (error) {
      console.error('박람회 상세 정보 조회 실패:', error);
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

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (reason) => {
    try {
      await rejectExpo({ id, reason });
      setShowRejectModal(false);
      // 상세 정보 다시 로드하여 상태 업데이트
      await loadExpoDetail();
      // 목록 페이지로 이동
      navigate('/platform/admin/expoApplications');
    } catch (error) {
      console.error('박람회 거절 실패:', error);
      alert('박람회 거절 처리에 실패했습니다.');
    }
  };

  const handleApprove = async () => {
    // 결제 정보 미리보기 모달 열기
    await handlePaymentDetailView();
  };

  // 모달에서 실제 승인 처리
  const handleFinalApprove = async () => {
    try {
      await approveExpo(id);
      // 모달 닫기
      setShowPaymentDetail(false);
      // 상세 정보 다시 로드하여 상태 업데이트
      await loadExpoDetail();
      // 목록 페이지로 이동
      navigate('/platform/admin/expoApplications');
    } catch (error) {
      console.error('박람회 승인 실패:', error);
      alert('박람회 승인 처리에 실패했습니다.');
    }
  };

  const handlePaymentDetailView = async () => {
    try {
      let paymentInfo;
      
      // 상태에 따라 다른 API 호출
      if (expo?.status === 'PENDING_APPROVAL') {
        // 승인 대기: 결제 미리보기
        paymentInfo = await fetchPaymentPreview(id);
      } else {
        // 승인 완료 이후: 실제 결제 정보
        paymentInfo = await fetchPaymentInfo(id);
      }
      
      setPaymentDetail(paymentInfo);
      setShowPaymentDetail(true);
    } catch (error) {
      console.error('결제 정보 조회 실패:', error);
      alert('결제 정보를 불러올 수 없습니다.');
    }
  };

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

  const handleCancelApprove = async () => {
    try {
      await approveCancellation(id);
      alert('취소 승인이 완료되었습니다.');
      setShowCancelDetail(false);
      // 상세 정보 다시 로드하여 상태 업데이트
      await loadExpoDetail();
      // 목록 페이지로 이동
      navigate('/platform/admin/expoApplications');
    } catch (error) {
      console.error('취소 승인 실패:', error);
      alert('취소 승인 처리에 실패했습니다.');
    }
  };

  let buttonGroup = null;

  if (expo?.status === 'PENDING_APPROVAL') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.rejectBtn} onClick={handleReject}>거절</button>
        <button className={styles.approveBtn} onClick={handleApprove}>승인</button>
      </div>
    );
  } else if (expo?.status === 'PENDING_PAYMENT') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={handlePaymentDetailView}>결제 정보</button>
      </div>
    );
  } else if (expo?.status === 'REJECTED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowRejectViewModal(true)}>거절 사유</button>
      </div>
    );
  } else if (expo?.status === 'PENDING_CANCEL') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={handleCancelDetailView}>취소 승인</button>
      </div>
    );
  } else if (expo?.status === 'CANCELLED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={handleCancelDetailView}>취소 내역</button>
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

      {/* 모달들 */}
      <RejectReasonModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
      />

      <RejectReasonViewModal
        isOpen={showRejectViewModal}
        onClose={() => setShowRejectViewModal(false)}
        rejectReason={rejectReason}
      />

      <PaymentSummaryModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />

      <ExpoPaymentDetailModal
        isOpen={showPaymentDetail}
        onClose={() => setShowPaymentDetail(false)}
        paymentDetail={paymentDetail}
        onApprove={expo?.status === 'PENDING_APPROVAL' ? handleFinalApprove : null}
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

export default ExpoApplicationDetail;
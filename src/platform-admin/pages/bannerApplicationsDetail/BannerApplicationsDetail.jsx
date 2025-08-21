import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styles from './BannerApplicationsDetail.module.css';
import BannerApplicationForm from '../../components/bannerApplicationForm/BannerApplicationForm';
import ApplicantForm from '../../components/applicantForm/ApplicantForm'
import OperatorApplicationForm from '../../components/operatorApplicationForm/OperatorApplicationForm';
import RejectReasonModal from '../../components/rejectReasonModal/RejectReasonModal';
import RejectReasonViewModal from '../../components/rejectReasonViewModal/RejectReasonViewModal';
import PaymentSummaryModal from '../../components/paymentSummaryModal/PaymentSummaryModal';
import PaymentDetailModal from '../../components/paymentDetailModal/PaymentDetailModal';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { fetchDetailBanner, rejectBanner, fetchRejectInfo, fetchPaymentDetail } from '../../../api/service/platform-admin/banner/BannerService';

const statusClassMap = {
  PENDING_APPROVAL: '승인_대기',
  PENDING_PAYMENT: '결제_대기',
  REJECTED: '승인_거절',
};

const statusTextMap = {
  승인_대기: '승인 대기',
  결제_대기: '결제 대기',
  승인_거절: '승인 거절',
};

function BannerApplicationsDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [showRejectViewModal, setShowRejectViewModal] = useState(false);

  const [bannerData, setBannerData] = useState(null);
  const [businessData, setBusinessData] = useState(null);

  const rawStatus = location.state?.expoStatus;
  const statusClass = statusClassMap[rawStatus];
  const statusText = statusTextMap[statusClass];

  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [rejectReason, setRejectReason] = useState(null);
  const [paymentDetail, setPaymentDetail] = useState(null);

  const getRejectReason = async () => {
    try {
      const res = await fetchRejectInfo(id);
      setRejectReason(res.description);
    } catch (err) {
      console.log('거절 사유를 가져오지 못했습니다 : ', err);
    }
  }

  const getPaymentDetail = async () => {
    try {
      const res = await fetchPaymentDetail(id);
      setPaymentDetail(res);
      console.log("paymentInfo = ", res); // todo: 삭제
    } catch (err) {
      console.log("결제 정보를 불러오지 못했습니다 : ", err);
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetchDetailBanner(id);
      console.log('배너 상세 데이터:', response);
      // 배너와 운영자 데이터 설정
      if (rawStatus == 'REJECTED') {
        getRejectReason();
      } else if (rawStatus == 'PENDING_PAYMENT') {
        getPaymentDetail();
      }
      setBannerData(response);
      setBusinessData({
        companyName: response.businessCompany,
        ceoName: response.representName,
        contactEmail: response.businessEmail,
        contactPhone: response.businessPhone,
        address: response.address,
        businessRegistrationNumber: response.businessNumber,
      });
    } catch (error) {
      triggerToastFail('데이터를 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleApproveSubmit = () => {
    navigate(location.pathname, {
      replace: true,
      state: { ...location.state, expoStatus: 'PENDING_PAYMENT' },
    });
    setShowPaymentModal(false);
  }

  const handleRejectSubmit = async (reason) => {
    try {
      await rejectBanner({ id, reason });
      await getRejectReason();
      await fetchData();

      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, expoStatus: 'REJECTED' },
      });
    } catch (error) {
      console.log("거절 사유 전송 실패 : ", error);
    }
    setShowRejectModal(false);
  };

  const handleApprove = () => {
    setShowPaymentModal(true);
  };

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    console.log('setFailMessage');
    setTimeout(() => setShowFailToast(false), 3000);
  }

  let buttonGroup = null;

  if (rawStatus === 'PENDING_APPROVAL') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.rejectBtn} onClick={handleReject}>거절</button>
        <button className={styles.approveBtn} onClick={handleApprove}>승인</button>
      </div>
    );
  } else if (rawStatus === 'REJECTED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowRejectViewModal(true)}>거절 사유</button>
      </div>
    );
  } else if (rawStatus === 'PENDING_PAYMENT') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowPaymentDetail(true)}>결제 정보</button>
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
        <BannerApplicationForm bannerData={bannerData} />
      </div>

      {/* 신청자 정보 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>신청자 정보</h4>
        <ApplicantForm applicantData={bannerData?.applicant} />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>운영사 정보</h4>
        {businessData && <OperatorApplicationForm businessData={businessData} />}
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
        rejectReason={rejectReason}
        onClose={() => setShowRejectViewModal(false)}
      />

      <PaymentSummaryModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handleApproveSubmit}
      />

      <PaymentDetailModal
        isOpen={showPaymentDetail}
        onClose={() => setShowPaymentDetail(false)}
        paymentDetail={paymentDetail}
      />


      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default BannerApplicationsDetail;
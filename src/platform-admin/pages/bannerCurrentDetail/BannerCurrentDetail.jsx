import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styles from './BannerCurrentDetail.module.css';
import BannerApplicationForm from '../../components/bannerApplicationForm/BannerApplicationForm';
import OperatorApplicationForm from '../../components/operatorApplicationForm/OperatorApplicationForm';
import PaymentDetailModal from '../../components/paymentDetailModal/PaymentDetailModal';
import AdCancelDetailModal from '../../components/bannerCancelDetailModal/AdCancelDetailModal';
import AdCancelSummaryModal from '../../components/bannerCancelSummaryModal/AdCancelSummaryModal';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { fetchDetailBanner, fetchCancelInfo, cancelBanner, fetchPaymentDetail, fetchCancelDetail } from '../../../api/service/platform-admin/banner/BannerService';

const statusClassMap = {
  PENDING_CANCEL: '취소_대기',
  PUBLISHED: '게시중',
  PENDING_PUBLISH: '게시_대기',
  CANCELLED: '취소됨',
  COMPLETED: '게시_종료',
};

const statusTextMap = {
  취소_대기: '취소 대기',
  게시중: '게시중',
  게시_대기: '게시 대기',
  취소됨: '취소됨',
  게시_종료: '게시 종료'
};

function BannerCurrentDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [showSettlementSummary, setShowSettlementSummary] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [showCancelDetail, setShowCancelDetail] = useState(false);

  const [bannerData, setBannerData] = useState(null);
  const [operatorData, setOperatorData] = useState(null);

  const rawStatus = location.state?.expoStatus;
  const statusClass = statusClassMap[rawStatus];
  const statusText = statusTextMap[statusClass];

  const [cancelDetail, setCancelDetail] = useState(null);
  const [cancelForm, setCancelForm] = useState(null);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [paymentDetail, setPaymentDetail] = useState(null);

  const getPaymentDetail = async () => {
    try {
      const res = await fetchPaymentDetail(id);
      setPaymentDetail(res);
      console.log("paymentInfo = ", res); // todo: 삭제
    } catch (err) {
      console.log("결제 정보를 불러오지 못했습니다 : ", err);
    }
  }

  const fetchCancelForm = async () => {
    try {
      const res = await fetchCancelInfo(id);
      setCancelForm(res);
      console.log("fetch cancel info", res);
    } catch (err) {
      console.log("취소 정보를 불러오지 못했습니다:", err);
    }
  }

  const getCancelDetail = async () => {
    try {
      const res = await fetchCancelDetail(id);
      setCancelDetail(res);
      console.log("cancelInfo = ", res); // todo: 삭제
    } catch (err) {
      console.log("결제 정보를 불러오지 못했습니다 : ", err);
    }
  }

  const handleSettlementSubmit = async () => {
    try {
      await cancelBanner(id, cancelForm);
      alert("취소 처리에 성공했습니다.");
      navigate(-1, {
        replace: true,
        state: { ...location.state, expoStatus: 'CANCELLED' },
      });
    } catch (err) {
      console.log("취소 처리 실패 : ", err);
    }
    setShowSettlementSummary(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDetailBanner(id);
        getPaymentDetail();

        if (rawStatus == 'PENDING_CANCEL') {
          getPaymentDetail();
          fetchCancelForm();
          console.log("cancelForm : ", cancelForm);
        } else if (rawStatus == 'CANCELLED') {
          getCancelDetail();
        }

        console.log('배너 상세 데이터:', response);
        // 배너와 운영자 데이터 설정
        setBannerData(response);
        setOperatorData({
          companyName: response.businessCompany,
          ceoName: response.representName,
          email: response.businessEmail,
          phone: response.businessPhone,
          address: response.address,
          businessNumber: response.businessNumber,
        });
      } catch (error) {
        triggerToastFail('데이터를 불러오는 데 실패했습니다.');
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    console.log('setFailMessage');
    setTimeout(() => setShowFailToast(false), 3000);
  }

  let buttonGroup = null;

  if (rawStatus === 'PENDING_CANCEL') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowPaymentDetail(true)}>결제 내역</button>
        <button className={styles.approveBtn} onClick={() => setShowSettlementSummary(true)}>취소 승인</button>
      </div>
    );
  } else if (rawStatus === 'PUBLISHED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowPaymentDetail(true)}>결제 내역</button>
      </div>
    );
  } else if (rawStatus === 'CANCELLED') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowPaymentDetail(true)}>결제 내역</button>
        <button className={styles.approveBtn} onClick={() => setShowCancelDetail(true)}>취소 내역</button>
      </div>
    );
  } else if (rawStatus === 'COMPLETED' || rawStatus === 'PENDING_PAYMENT') {
    buttonGroup = (
      <div className={styles.buttonGroup}>
        <button className={styles.approveBtn} onClick={() => setShowPaymentDetail(true)}>결제 내역</button>
      </div>
    );
  }


  return (
    <div className={styles.operatorContainer}>
      {/* 상단 제목 및 상태 뱃지 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <button className={styles.backArrow} onClick={handleBack}>←</button>
          <h4 className={styles.sectionTitle}>현재 배너 상세</h4>
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
        {operatorData && <OperatorApplicationForm operatorData={operatorData} />}
      </div>

      {/* 버튼 그룹 */}
      {buttonGroup}

      {/* 모달들 */}
      <AdCancelSummaryModal
        isOpen={showSettlementSummary}
        onClose={() => setShowSettlementSummary(false)}
        cancelForm={cancelForm}
        onSubmit={handleSettlementSubmit}
      />


      
      <PaymentDetailModal
        isOpen={showPaymentDetail}
        onClose={() => setShowPaymentDetail(false)}
        paymentDetail={paymentDetail}
      />

      <AdCancelDetailModal
        isOpen={showCancelDetail}
        onClose={() => setShowCancelDetail(false)}
        cancelDetail={cancelDetail}
      />


      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default BannerCurrentDetail;
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAdvertisementDetail, getAdvertisementPayment, getAdvertisementRefundReceipt, getAdvertisementRefundHistory, deleteAdvertisement, requestAdvertisementRefundByStatus, cancelAdvertisementByStatus, getAdvertisementRejectInfo, completeAdvertisementPayment } from '../../../api/service/user/memberApi';
import styles from "./AdsStatusDetail.module.css";
import AdPaymentDetailModal from "../../components/paymentDetailModal/AdPaymentDetailModal";
import AdPaymentRefundModal from "../../components/paymentDetailModal/AdPaymentRefundModal";
import AdRejectInfoModal from "../../components/rejectInfoModal/AdRejectInfoModal";
import AdCancelModal from "../../components/cancelModal/AdCancelModal";
import PaymentSelection from "../payment-selection/PaymentSelection";

// 단순화된 버튼 설정 (i18n 적용은 component 내부에서)
const ALL_BUTTONS = [
  { action: "payment", color: "black", disabled: false },
  { action: "viewPaymentInfo", color: "blue", disabled: false },
  { action: "refundRequest", color: "purple", disabled: false },
  { action: "cancelRequest", color: "orange", disabled: false },
  { action: "viewRejectInfo", color: "red", disabled: false },
];

// 광고 상태 매핑 객체 (상태별 버튼 분기 처리, i18n 적용은 component 내부에서)
const AD_STATUS_MAP = {
  PENDING_APPROVAL: {
    badge: { key: "PENDING_APPROVAL", className: "pending" },
    buttons: [
      { action: "cancelRequest", color: "orange", disabled: false },
    ],
  },
  PENDING_PAYMENT: {
    badge: { key: "PENDING_PAYMENT", className: "waiting" },
    buttons: [
      { action: "payment", color: "black", disabled: false },
      { action: "cancelRequest", color: "orange", disabled: false },
    ],
  },
  PENDING_PUBLISH: {
    badge: { key: "PENDING_PUBLISH", className: "waiting" },
    buttons: [
      { action: "refundRequest", color: "purple", disabled: false },
      { action: "viewPaymentInfo", color: "blue", disabled: false },
    ],
  },
  PENDING_CANCEL: {
    badge: { key: "PENDING_CANCEL", className: "pending" },
    buttons: [
      { action: "viewPaymentInfo", color: "blue", disabled: false },
      { action: "refundHistory", color: "purple", disabled: false },
    ],
  },
  PUBLISHED: {
    badge: { key: "PUBLISHED", className: "active" },
    buttons: [
      { action: "refundRequest", color: "purple", disabled: false },
      { action: "viewPaymentInfo", color: "blue", disabled: false },
    ],
  },
  COMPLETED: {
    badge: { key: "COMPLETED", className: "finished" },
    buttons: [
      { action: "viewPaymentInfo", color: "blue", disabled: false },
    ],
  },
  REJECTED: {
    badge: { key: "REJECTED", className: "canceled" },
    buttons: [
      { action: "viewRejectInfo", color: "red", disabled: false },
    ],
  },
  CANCELLED: {
    badge: { key: "CANCELLED", className: "canceled" },
    buttons: "conditional", // 결제 정보 유무에 따라 조건부 렌더링
  },
};

function AdsStatusDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 모달 상태
  const [modalType, setModalType] = useState(null); // 'payment' | 'paymentView' | 'refund' | 'rejectInfo' | 'cancel' | null
  const [showPaymentSelection, setShowPaymentSelection] = useState(false); // 결제수단 선택 페이지 표시 상태
  const [paymentData, setPaymentData] = useState(null);
  const [refundData, setRefundData] = useState(null);
  const [rejectInfoData, setRejectInfoData] = useState(null);
  const [cancelData, setCancelData] = useState(null);

  // 광고 상세 데이터 불러오기
  const fetchAdvertisementDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdvertisementDetail(id);
      setAdData(response.data);
    } catch (err) {
      console.error('광고 상세 정보 조회 실패:', err);
      setError(t('mypageGeneral.adsStatus.detail.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAdvertisementDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>{t('mypageGeneral.adsStatus.detail.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!adData) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>{t('mypageGeneral.adsStatus.detail.notFound')}</div>
      </div>
    );
  }

  const statusConf = AD_STATUS_MAP[adData.status] || AD_STATUS_MAP.PENDING_APPROVAL;

  // businessInfo에서 신청자 정보 추출
  const {
    advertisementId,
    title,
    description,
    imageUrl,
    linkUrl,
    displayStartDate,
    displayEndDate,
    status,
    adPositionName,
    businessInfo = {}
  } = adData;

  const {
    companyName = "",
    ceoName = "",
    contactPhone = "",
    businessRegistrationNumber = "",
  } = businessInfo;

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const amount = 600000; // 결제금액은 실제 API에 따라 추가될 수 있음

  // 결제하기 버튼 클릭 핸들러
  const handlePaymentClick = async () => {
    try {
      console.log('결제 API 호출 중, ID:', id);
      const response = await getAdvertisementPayment(id);
      console.log('결제 API 응답:', response);
      setPaymentData(response.data);
      setModalType("payment");
      console.log('모달 타입 설정됨:', "payment");
      console.log('paymentData 설정됨:', response.data);
    } catch (err) {
      console.error('결제 정보 조회 실패:', err);
      console.error('에러 상세:', err.response?.data || err.message);
      alert(t('mypageGeneral.adsStatus.detail.messages.paymentError') + ': ' + (err.response?.data?.message || err.message));
    }
  };

  // 정산하기 버튼 클릭 핸들러
  const handleRefundClick = async () => {
    try {
      console.log('정산 API 호출 중, ID:', id);
      const response = await getAdvertisementRefundReceipt(id);
      console.log('정산 API 응답:', response);
      setRefundData(response.data);
      setModalType("refund");
    } catch (err) {
      console.error('정산 정보 조회 실패:', err);
      console.error('에러 상세:', err.response?.data || err.message);
      alert(t('mypageGeneral.adsStatus.detail.messages.refundError') + ': ' + (err.response?.data?.message || err.message));
    }
  };


  // 거절 사유 조회 핸들러
  const handleViewRejectInfo = async () => {
    try {
      console.log('거절 사유 API 호출 중, ID:', id);
      const response = await getAdvertisementRejectInfo(id);
      console.log('거절 사유 API 응답:', response);
      setRejectInfoData(response.data);
      setModalType("rejectInfo");
    } catch (err) {
      console.error('거절 사유 조회 실패:', err);
      console.error('에러 상세:', err.response?.data || err.message);
      alert(t('mypageGeneral.adsStatus.detail.messages.refundError') + ': ' + (err.response?.data?.message || err.message));
    }
  };


  // 통합된 환불 신청 핸들러 (상태별 자동 처리)
  const handleRefundRequestByStatus = async () => {
    try {
      console.log('환불 영수증 API 호출 중, ID:', id);
      const response = await getAdvertisementRefundReceipt(id);
      console.log('환불 영수증 API 응답:', response);
      setRefundData(response.data);
      setModalType("refundByStatus");
    } catch (err) {
      console.error('환불 영수증 조회 실패:', err);
      console.error('에러 상세:', err.response?.data || err.message);
      alert('환불 영수증을 불러오는데 실패했습니다: ' + (err.response?.data?.message || err.message));
    }
  };

  // 환불 신청 핸들러 (상태별 자동 처리)
  const handleRefundRequest = async () => {
    try {
      console.log('환불 영수증 API 호출 중, ID:', id);
      const response = await getAdvertisementRefundReceipt(id);
      console.log('환불 영수증 API 응답:', response);
      setRefundData({
        ...response.data,
        currentStatus: adData.status // 현재 광고 상태 추가
      });
      setModalType("refund");
    } catch (err) {
      console.error('환불 영수증 조회 실패:', err);
      console.error('에러 상세:', err.response?.data || err.message);
      alert('환불 영수증을 불러오는데 실패했습니다: ' + (err.response?.data?.message || err.message));
    }
  };

  // 환불 내역 조회 핸들러 (COMPLETED, CANCELLED 상태용)
  const handleRefundHistory = async () => {
    try {
      console.log('환불 내역 API 호출 중, ID:', id);
      const response = await getAdvertisementRefundHistory(id);
      console.log('환불 내역 API 응답:', response);
      setRefundData({
        ...response.data,
        currentStatus: adData.status,
        isRefundCompleted: true // 환불 완료 상태 표시
      });
      setModalType("refund");
    } catch (err) {
      console.error('환불 내역 조회 실패:', err);
      console.error('에러 상세:', err.response?.data || err.message);
      alert('환불 내역을 불러오는데 실패했습니다: ' + (err.response?.data?.message || err.message));
    }
  };

  // 부분 환불 신청 핸들러
  const handlePartialRefundRequest = async () => {
    try {
      console.log('부분 환불 영수증 API 호출 중, ID:', id);
      const response = await getAdvertisementRefundReceipt(id);
      console.log('부분 환불 영수증 API 응답:', response);
      setRefundData(response.data);
      setModalType("partialRefund");
    } catch (err) {
      console.error('부분 환불 영수증 조회 실패:', err);
      console.error('에러 상세:', err.response?.data || err.message);
      alert('부분 환불 영수증을 불러오는데 실패했습니다: ' + (err.response?.data?.message || err.message));
    }
  };

  // 취소 모달 표시 핸들러
  const handleCancelByStatus = () => {
    setCancelData({
      advertisementTitle: adData.title,
      applicantName: adData.businessInfo?.ceoName || '',
      displayStartDate: formatDate(adData.displayStartDate),
      displayEndDate: formatDate(adData.displayEndDate),
      currentStatus: adData.status
    });
    setModalType("cancel");
  };

  // 실제 취소 처리 핸들러
  const handleCancelConfirm = async () => {
    try {
      await cancelAdvertisementByStatus(id);
      alert(t('mypageGeneral.adsStatus.detail.messages.cancelSuccess'));
      handleCloseModal();
      fetchAdvertisementDetail(); // 데이터 새로고침
    } catch (error) {
      console.error('취소 실패:', error);
      alert(t('mypageGeneral.adsStatus.detail.messages.cancelError'));
    }
  };

  // 승인대기 취소 핸들러
  const handleCancelPendingApproval = async () => {
    if (window.confirm(t('mypageGeneral.adsStatus.detail.messages.pendingApprovalCancelConfirm'))) {
      try {
        await cancelAdvertisementByStatus(id);
        alert(t('mypageGeneral.adsStatus.detail.messages.cancelSuccess'));
        fetchAdvertisementDetail(); // 데이터 새로고침
      } catch (error) {
        console.error('승인대기 취소 실패:', error);
        alert(t('mypageGeneral.adsStatus.detail.messages.cancelError'));
      }
    }
  };

  // 결제대기 취소 핸들러
  const handleCancelPendingPayment = async () => {
    if (window.confirm(t('mypageGeneral.adsStatus.detail.messages.pendingPaymentCancelConfirm'))) {
      try {
        await cancelAdvertisementByStatus(id);
        alert(t('mypageGeneral.adsStatus.detail.messages.cancelSuccess'));
        fetchAdvertisementDetail(); // 데이터 새로고침
      } catch (error) {
        console.error('결제대기 취소 실패:', error);
        alert(t('mypageGeneral.adsStatus.detail.messages.cancelError'));
      }
    }
  };
  
  const handleCancelAdvertisement = async () => {
    if (window.confirm(t('mypageGeneral.adsStatus.detail.messages.cancelConfirm'))) {
      try {
        await deleteAdvertisement(id);
        alert(t('mypageGeneral.adsStatus.detail.messages.cancelSuccess'));
        fetchAdvertisementDetail(); // 데이터 새로고침
      } catch (error) {
        console.error('취소 실패:', error);
        alert(t('mypageGeneral.adsStatus.detail.messages.cancelError'));
      }
    }
  };

  // 결제 정보 조회 핸들러 (결제 완료 후 정보 보기용)
  const handleViewPaymentInfo = async () => {
    try {
      console.log('결제 정보 조회 API 호출 중, ID:', id);
      const response = await getAdvertisementPayment(id);
      console.log('결제 정보 조회 API 응답:', response);
      setPaymentData(response.data);
      setModalType("paymentView");
    } catch (err) {
      console.error('결제 정보 조회 실패:', err);
      console.error('에러 상세:', err.response?.data || err.message);
      alert(t('mypageGeneral.adsStatus.detail.messages.paymentError') + ': ' + (err.response?.data?.message || err.message));
    }
  };

  // 버튼 액션 핸들러
  const handleButtonAction = (action) => {
    switch (action) {
      case 'payment':
        handlePaymentClick();
        break;
      case 'viewPaymentInfo':
        handleViewPaymentInfo();
        break;
      case 'refundRequest':
        handleRefundRequest();
        break;
      case 'refundHistory':
        handleRefundHistory();
        break;
      case 'cancelRequest':
        handleCancelByStatus();
        break;
      case 'viewRejectInfo':
        handleViewRejectInfo();
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalType(null);
    setPaymentData(null);
    setRefundData(null);
    setRejectInfoData(null);
    setCancelData(null);
  };

  // 결제수단선택 페이지가 표시될 경우 해당 컴포넌트만 렌더링
  if (showPaymentSelection) {
    // 광고 결제이므로 paymentType="ads" prop을 전달합니다.
    return <PaymentSelection paymentType="ads" />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        {/* 상단 헤더/상태 뱃지 */}
        <div className={styles.headerRow}>
          <h2 className={styles.pageTitle}>{t('mypageGeneral.adsStatus.detail.title')}</h2>
          <span
            className={`${styles.statusBadge} ${
              styles[statusConf.badge.className]
            }`}
          >
            {t(`mypageGeneral.adsStatus.status.${statusConf.badge.key}`)}
          </span>
        </div>
        {/* infoGrid(흰색 박스) */}
        <div className={styles.infoGrid}>
          {/* 배너 이미지: infoGrid 내부 맨 위, 2칸 전체 */}
          <div className={styles.bannerImageRow}>
            <div className={styles.bannerImageWrapper}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={t('mypageGeneral.adsStatus.detail.bannerImage')}
                  className={styles.bannerImage}
                />
              ) : (
                <div className={styles.bannerImagePlaceholder}>{t('mypageGeneral.adsStatus.detail.bannerImage')}</div>
              )}
            </div>
          </div>
          {/* 좌측 - 광고 정보 */}
          <div className={styles.infoSection}>
            <label>{t('mypageGeneral.adsStatus.detail.adTitle')}</label>
            <input value={title} readOnly className={styles.input} />

            <label>{t('mypageGeneral.adsStatus.detail.adPosition')}</label>
            <input value={adPositionName} readOnly className={styles.input} />

            <label>{t('mypageGeneral.adsStatus.detail.displayPeriod')}</label>
            <div className={styles.periodInputRow}>
              <input value={formatDate(displayStartDate)} readOnly className={styles.input} />
              <span style={{ margin: "0 8px" }}>~</span>
              <input value={formatDate(displayEndDate)} readOnly className={styles.input} />
            </div>

            <label>{t('mypageGeneral.adsStatus.detail.linkUrl')}</label>
            <input value={linkUrl} readOnly className={styles.input} />
          </div>
          {/* 우측 - 신청자 정보 */}
          <div className={styles.infoSection}>
            <label>{t('mypageGeneral.adsStatus.detail.applicantName')}</label>
            <input value={ceoName} readOnly className={styles.input} />

            <label>{t('mypageGeneral.adsStatus.detail.applicantPhone')}</label>
            <input value={contactPhone} readOnly className={styles.input} />

            <label>{t('mypageGeneral.adsStatus.detail.companyName')}</label>
            <input value={companyName} readOnly className={styles.input} />

            <label>{t('mypageGeneral.adsStatus.detail.businessNumber')}</label>
            <input value={businessRegistrationNumber} readOnly className={styles.input} />
          </div>
          {/* 광고 소개: 두 칸 전체 */}
          <div className={styles.fullRow}>
            <label>{t('mypageGeneral.adsStatus.detail.adDescription')}</label>
            <textarea
              value={description}
              readOnly
              className={styles.textarea}
            />
          </div>
          {/* 버튼: 두 칸 전체 */}
          <div className={styles.fullRow}>
            <div className={styles.buttonRow}>
              {/* 조건부 버튼 렌더링 (취소 완료만 - 결제 정보 유무로 구분) */}
              {statusConf.buttons === "conditional" && (
                <>
                  <button
                    className={`${styles.btn} ${styles.blue}`}
                    onClick={() => handleButtonAction("viewPaymentInfo")}
                  >
                    {t('mypageGeneral.adsStatus.detail.buttons.paymentInfo')}
                  </button>
                  <button
                    className={`${styles.btn} ${styles.purple}`}
                    onClick={() => handleButtonAction("refundHistory")}
                  >
                    {t('mypageGeneral.adsStatus.detail.buttons.refundInfo')}
                  </button>
                </>
              )}
              
              {/* 일반 버튼 렌더링 */}
              {statusConf.buttons && Array.isArray(statusConf.buttons) && statusConf.buttons.length > 0 && statusConf.buttons.map((button, index) => (
                <button
                  key={index}
                  className={`${styles.btn} ${styles[button.color]}`}
                  onClick={() => handleButtonAction(button.action)}
                  disabled={button.disabled}
                >
                  {t(`mypageGeneral.adsStatus.detail.buttons.${button.action}`)}
                </button>
              ))}
              
              {/* 버튼이 없는 경우 */}
              {(!statusConf.buttons || (Array.isArray(statusConf.buttons) && statusConf.buttons.length === 0)) && (
                <div className={styles.noButtonsMessage}>
                  {t('mypageGeneral.adsStatus.detail.messages.noButtonsAvailable')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 모달: 조건부 렌더링 */}
        {console.log('모달 렌더링 체크:', { modalType, paymentData, refundData })}
        {modalType === "payment" && paymentData && (
          <AdPaymentDetailModal
            advertisementTitle={paymentData.advertisementTitle}
            applicantName={paymentData.applicantName}
            period={`${formatDate(paymentData.displayStartDate)} ~ ${formatDate(paymentData.displayEndDate)}`}
            totalDays={paymentData.totalDays}
            feePerDay={paymentData.feePerDay}
            totalAmount={paymentData.totalAmount}
            status={paymentData.status}
            mode="payment"
            onPay={async () => {
              try {
                await completeAdvertisementPayment(id);
                alert(t('mypageGeneral.adsStatus.detail.messages.paymentSuccess'));
                handleCloseModal();
                fetchAdvertisementDetail(); // 데이터 새로고침
              } catch (error) {
                console.error('결제 완료 실패:', error);
                alert(t('mypageGeneral.adsStatus.detail.messages.paymentError') + ': ' + (error.response?.data?.message || error.message));
              }
            }}
            onCancel={handleCloseModal}
            onClose={handleCloseModal}
          />
        )}
        {modalType === "paymentView" && paymentData && (
          <AdPaymentDetailModal
            advertisementTitle={paymentData.advertisementTitle}
            applicantName={paymentData.applicantName}
            period={`${formatDate(paymentData.displayStartDate)} ~ ${formatDate(paymentData.displayEndDate)}`}
            totalDays={paymentData.totalDays}
            feePerDay={paymentData.feePerDay}
            totalAmount={paymentData.totalAmount}
            status={paymentData.status}
            mode="view"
            onClose={handleCloseModal}
          />
        )}
        {modalType === "refund" && refundData && (
          <AdPaymentRefundModal
            advertisementTitle={refundData.advertisementTitle}
            applicantName={refundData.applicantName}
            displayStartDate={formatDate(refundData.displayStartDate)}
            displayEndDate={formatDate(refundData.displayEndDate)}
            totalDays={refundData.totalDays}
            feePerDay={refundData.feePerDay}
            totalAmount={refundData.totalAmount}
            refundRequestDate={formatDate(refundData.refundRequestDate)}
            usedDays={refundData.usedDays}
            usedAmount={refundData.usedAmount}
            remainingDays={refundData.remainingDays}
            refundAmount={refundData.refundAmount}
            currentStatus={refundData.currentStatus}
            isRefundCompleted={refundData.isRefundCompleted}
            onRefund={!refundData.isRefundCompleted ? async (reason) => {
              try {
                await requestAdvertisementRefundByStatus(id, { reason });
                alert(t('mypageGeneral.adsStatus.detail.messages.refundSuccess'));
                handleCloseModal();
                fetchAdvertisementDetail(); // 데이터 새로고침
              } catch (error) {
                console.error('환불 신청 실패:', error);
                alert(t('mypageGeneral.adsStatus.detail.messages.refundError') + ': ' + (error.response?.data?.message || error.message));
              }
            } : null}
            onClose={handleCloseModal}
          />
        )}
        {modalType === "partialRefund" && refundData && (
          <AdPaymentRefundModal
            advertisementTitle={refundData.advertisementTitle}
            applicantName={refundData.applicantName}
            displayStartDate={formatDate(refundData.displayStartDate)}
            displayEndDate={formatDate(refundData.displayEndDate)}
            totalDays={refundData.totalDays}
            feePerDay={refundData.feePerDay}
            totalAmount={refundData.totalAmount}
            refundRequestDate={formatDate(refundData.refundRequestDate)}
            usedDays={refundData.usedDays}
            usedAmount={refundData.usedAmount}
            remainingDays={refundData.remainingDays}
            refundAmount={refundData.refundAmount}
            onRefund={async (reason) => {
              try {
                await requestAdvertisementPartialRefund(id, { reason });
                alert('부분 환불 신청이 성공적으로 접수되었습니다.');
                handleCloseModal();
                fetchAdvertisementDetail(); // 데이터 새로고침
              } catch (error) {
                console.error('부분 환불 신청 실패:', error);
                alert('부분 환불 신청 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
              }
            }}
            onClose={handleCloseModal}
          />
        )}
        {modalType === "refundByStatus" && refundData && (
          <AdPaymentRefundModal
            advertisementTitle={refundData.advertisementTitle}
            applicantName={refundData.applicantName}
            displayStartDate={formatDate(refundData.displayStartDate)}
            displayEndDate={formatDate(refundData.displayEndDate)}
            totalDays={refundData.totalDays}
            feePerDay={refundData.feePerDay}
            totalAmount={refundData.totalAmount}
            refundRequestDate={formatDate(refundData.refundRequestDate)}
            usedDays={refundData.usedDays}
            usedAmount={refundData.usedAmount}
            remainingDays={refundData.remainingDays}
            refundAmount={refundData.refundAmount}
            onRefund={async (reason) => {
              try {
                await requestAdvertisementRefundByStatus(id, { reason });
                alert(t('mypageGeneral.adsStatus.detail.messages.refundSuccess'));
                handleCloseModal();
                fetchAdvertisementDetail(); // 데이터 새로고침
              } catch (error) {
                console.error('환불 신청 실패:', error);
                alert(t('mypageGeneral.adsStatus.detail.messages.refundError') + ': ' + (error.response?.data?.message || error.message));
              }
            }}
            onClose={handleCloseModal}
          />
        )}
        {modalType === "rejectInfo" && rejectInfoData && (
          <AdRejectInfoModal
            description={rejectInfoData.description}
            rejectedAt={rejectInfoData.rejectedAt}
            onClose={handleCloseModal}
          />
        )}
        {modalType === "cancel" && cancelData && (
          <AdCancelModal
            advertisementTitle={cancelData.advertisementTitle}
            applicantName={cancelData.applicantName}
            displayStartDate={cancelData.displayStartDate}
            displayEndDate={cancelData.displayEndDate}
            currentStatus={cancelData.currentStatus}
            onCancel={handleCancelConfirm}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default AdsStatusDetail;

import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getAdvertisementDetail, getAdvertisementPayment, getAdvertisementRefundReceipt, deleteAdvertisement, requestAdvertisementRefundByStatus, cancelAdvertisementByStatus, getAdvertisementRejectInfo } from '../../../api/service/user/memberApi';
import styles from "./AdsStatusDetail.module.css";
import AdPaymentDetailModal from "../../components/paymentDetailModal/AdPaymentDetailModal";
import AdPaymentRefundModal from "../../components/paymentDetailModal/AdPaymentRefundModal";
import AdRejectInfoModal from "../../components/rejectInfoModal/AdRejectInfoModal";
import AdCancelModal from "../../components/cancelModal/AdCancelModal";
import PaymentSelection from "../payment-selection/PaymentSelection";

// 단순화된 버튼 설정
const ALL_BUTTONS = [
  { label: "결제 신청", color: "black", disabled: false, action: "payment" },
  { label: "환불 신청", color: "purple", disabled: false, action: "refundRequest" },
  { label: "광고 취소", color: "orange", disabled: false, action: "cancelRequest" },
  { label: "거절사유보기", color: "red", disabled: false, action: "viewRejectInfo" },
];

// 광고 상태 매핑 객체 (상태별 버튼 분기 처리)
const AD_STATUS_MAP = {
  PENDING_APPROVAL: {
    badge: { label: "승인대기", className: "pending" },
    buttons: [
      { label: "광고 취소", color: "orange", disabled: false, action: "cancelRequest" },
    ],
  },
  PENDING_PAYMENT: {
    badge: { label: "결제대기", className: "waiting" },
    buttons: [
      { label: "결제 신청", color: "black", disabled: false, action: "payment" },
      { label: "광고 취소", color: "orange", disabled: false, action: "cancelRequest" },
    ],
  },
  PENDING_PUBLISH: {
    badge: { label: "게시예정", className: "waiting" },
    buttons: [
      { label: "환불 신청", color: "purple", disabled: false, action: "refundRequest" },
    ],
  },
  PUBLISHED: {
    badge: { label: "게시중", className: "active" },
    buttons: [
      { label: "환불 신청", color: "purple", disabled: false, action: "refundRequest" },
    ],
  },
  COMPLETED: {
    badge: { label: "게시완료", className: "finished" },
    buttons: [
      // 게시완료 상태에서는 버튼 없음
    ],
  },
  REJECTED: {
    badge: { label: "거절됨", className: "canceled" },
    buttons: [
      { label: "거절사유보기", color: "red", disabled: false, action: "viewRejectInfo" },
    ],
  },
  PENDING_CANCEL: {
    badge: { label: "환불대기", className: "waiting" },
    buttons: [
      // 환불대기 상태에서는 버튼 없음 (처리 중)
    ],
  },
  CANCELLED: {
    badge: { label: "취소됨", className: "canceled" },
    buttons: [
      // 취소됨 상태에서는 버튼 없음
    ],
  },
};

function AdsStatusDetail() {
  const { id } = useParams();
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 모달 상태
  const [modalType, setModalType] = useState(null); // 'payment' | 'refund' | 'rejectInfo' | 'cancel' | null
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
      setError('광고 상세 정보를 불러오는데 실패했습니다.');
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
        <div className={styles.loading}>로딩 중...</div>
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
        <div className={styles.error}>광고 정보를 찾을 수 없습니다.</div>
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
      alert('결제 정보를 불러오는데 실패했습니다: ' + (err.response?.data?.message || err.message));
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
      alert('정산 정보를 불러오는데 실패했습니다: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDownload = () => {
    // alert("다운로드 기능 연동 필요");
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
      alert('거절 사유를 불러오는데 실패했습니다: ' + (err.response?.data?.message || err.message));
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
      alert('광고가 성공적으로 취소되었습니다.');
      handleCloseModal();
      fetchAdvertisementDetail(); // 데이터 새로고침
    } catch (error) {
      console.error('취소 실패:', error);
      alert('취소 중 오류가 발생했습니다.');
    }
  };

  // 승인대기 취소 핸들러
  const handleCancelPendingApproval = async () => {
    if (window.confirm('승인대기 중인 광고를 취소하시겠습니까?')) {
      try {
        await cancelAdvertisementByStatus(id);
        alert('광고가 성공적으로 취소되었습니다.');
        fetchAdvertisementDetail(); // 데이터 새로고침
      } catch (error) {
        console.error('승인대기 취소 실패:', error);
        alert('취소 중 오류가 발생했습니다.');
      }
    }
  };

  // 결제대기 취소 핸들러
  const handleCancelPendingPayment = async () => {
    if (window.confirm('결제대기 중인 광고를 취소하시겠습니까?')) {
      try {
        await cancelAdvertisementByStatus(id);
        alert('광고가 성공적으로 취소되었습니다.');
        fetchAdvertisementDetail(); // 데이터 새로고침
      } catch (error) {
        console.error('결제대기 취소 실패:', error);
        alert('취소 중 오류가 발생했습니다.');
      }
    }
  };
  
  const handleCancelAdvertisement = async () => {
    if (window.confirm('광고를 취소하시겠습니까?')) {
      try {
        await deleteAdvertisement(id);
        alert('광고가 성공적으로 취소되었습니다.');
        fetchAdvertisementDetail(); // 데이터 새로고침
      } catch (error) {
        console.error('취소 실패:', error);
        alert('취소 중 오류가 발생했습니다.');
      }
    }
  };

  // 버튼 액션 핸들러
  const handleButtonAction = (action) => {
    switch (action) {
      case 'payment':
        handlePaymentClick();
        break;
      case 'refundRequest':
        handleRefundRequest();
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
          <h2 className={styles.pageTitle}>배너 상세</h2>
          <span
            className={`${styles.statusBadge} ${
              styles[statusConf.badge.className]
            }`}
          >
            {statusConf.badge.label}
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
                  alt="배너 이미지"
                  className={styles.bannerImage}
                />
              ) : (
                <div className={styles.bannerImagePlaceholder}>배너 이미지</div>
              )}
            </div>
          </div>
          {/* 좌측 - 광고 정보 */}
          <div className={styles.infoSection}>
            <label>광고 제목</label>
            <input value={title} readOnly className={styles.input} />

            <label>광고 위치</label>
            <input value={adPositionName} readOnly className={styles.input} />

            <label>게시 기간</label>
            <div className={styles.periodInputRow}>
              <input value={formatDate(displayStartDate)} readOnly className={styles.input} />
              <span style={{ margin: "0 8px" }}>~</span>
              <input value={formatDate(displayEndDate)} readOnly className={styles.input} />
            </div>

            <label>링크 URL</label>
            <input value={linkUrl} readOnly className={styles.input} />
          </div>
          {/* 우측 - 신청자 정보 */}
          <div className={styles.infoSection}>
            <label>신청자명 (대표자)</label>
            <input value={ceoName} readOnly className={styles.input} />

            <label>신청자 연락처</label>
            <input value={contactPhone} readOnly className={styles.input} />

            <label>회사명</label>
            <input value={companyName} readOnly className={styles.input} />

            <label>사업자등록번호</label>
            <input value={businessRegistrationNumber} readOnly className={styles.input} />
          </div>
          {/* 광고 소개: 두 칸 전체 */}
          <div className={styles.fullRow}>
            <label>광고 소개</label>
            <textarea
              value={description}
              readOnly
              className={styles.textarea}
            />
          </div>
          {/* 첨부파일: 두 칸 전체 */}
          <div className={styles.fullRow}>
            <label>광고 이미지</label>
            <div className={styles.attachmentRow}>
              <input value={imageUrl || "이미지 없음"} readOnly className={styles.input} />
              <button className={styles.downloadBtn} onClick={handleDownload}>
                이미지 업로드
              </button>
            </div>
          </div>
          {/* 버튼: 두 칸 전체 */}
          <div className={styles.fullRow}>
            <div className={styles.buttonRow}>
              {statusConf.buttons && statusConf.buttons.length > 0 && statusConf.buttons.map((button, index) => (
                <button
                  key={index}
                  className={`${styles.btn} ${styles[button.color]}`}
                  onClick={() => handleButtonAction(button.action)}
                  disabled={button.disabled}
                >
                  {button.label}
                </button>
              ))}
              {(!statusConf.buttons || statusConf.buttons.length === 0) && (
                <div className={styles.noButtonsMessage}>
                  사용 가능한 작업이 없습니다.
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
            onPay={() => {
              setShowPaymentSelection(true);
              handleCloseModal();
            }}
            onCancel={handleCloseModal}
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
            onRefund={async (reason) => {
              try {
                await requestAdvertisementRefundByStatus(id, { reason });
                alert('환불 신청이 성공적으로 접수되었습니다.');
                handleCloseModal();
                fetchAdvertisementDetail(); // 데이터 새로고침
              } catch (error) {
                console.error('환불 신청 실패:', error);
                alert('환불 신청 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
              }
            }}
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
                alert('환불 신청이 성공적으로 접수되었습니다.');
                handleCloseModal();
                fetchAdvertisementDetail(); // 데이터 새로고침
              } catch (error) {
                console.error('환불 신청 실패:', error);
                alert('환불 신청 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
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

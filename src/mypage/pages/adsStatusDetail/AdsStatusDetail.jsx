import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getAdvertisementDetail, getAdvertisementPayment, getAdvertisementRefundReceipt } from '../../../api/service/user/memberApi';
import styles from "./AdsStatusDetail.module.css";
import AdPaymentDetailModal from "../../components/paymentDetailModal/AdPaymentDetailModal";
import AdPaymentRefundModal from "../../components/paymentDetailModal/AdPaymentRefundModal";
import PaymentSelection from "../payment-selection/PaymentSelection";

// 광고 상태 매핑 객체 (실제 API 상태에 맞게 수정)
const AD_STATUS_MAP = {
  PENDING_APPROVAL: {
    badge: { label: "승인대기", className: "pending" },
    mainBtn: { label: "신청 취소", color: "pink", disabled: false },
    subBtn: null,
  },
  PENDING_PAYMENT: {
    badge: { label: "결제대기", className: "waiting" },
    mainBtn: { label: "결제", color: "black", disabled: false },
    subBtn: { label: "신청 취소", color: "pink", disabled: false },
  },
  PUBLISHED: {
    badge: { label: "게시중", className: "active" },
    mainBtn: { label: "신청 취소", color: "pink", disabled: false },
    subBtn: { label: "결제 내역", color: "black", disabled: false },
  },
  COMPLETED: {
    badge: { label: "게시완료", className: "finished" },
    mainBtn: { label: "결제 내역", color: "black", disabled: false },
    subBtn: null,
  },
  REJECTED: {
    badge: { label: "거절됨", className: "canceled" },
    mainBtn: null,
    subBtn: null,
  },
  CANCELLED: {
    badge: { label: "취소됨", className: "canceled" },
    mainBtn: null,
    subBtn: null,
  },
};

function AdsStatusDetail() {
  const { id } = useParams();
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 모달 상태
  const [modalType, setModalType] = useState(null); // 'payment' | 'refund' | null
  const [showPaymentSelection, setShowPaymentSelection] = useState(false); // 결제수단 선택 페이지 표시 상태
  const [paymentData, setPaymentData] = useState(null);
  const [refundData, setRefundData] = useState(null);

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

  // 모달 닫기
  const handleCloseModal = () => {
    setModalType(null);
    setPaymentData(null);
    setRefundData(null);
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
              <button
                className={`${styles.btn} ${styles.black}`}
                onClick={handlePaymentClick}
              >
                결제하기
              </button>
              <button
                className={`${styles.btn} ${styles.pink}`}
                onClick={handleRefundClick}
              >
                정산하기
              </button>
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
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default AdsStatusDetail;

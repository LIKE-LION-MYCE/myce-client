import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./AdsStatusDetail.module.css";
import PaymentWaitingModal from "../../components/paymentDetailModal/PaymentWaitingModal";
import PaymentFinishedModal from "../../components/paymentDetailModal/PaymentFinishedModal";
import PaymentSelection from "../payment-selection/PaymentSelection";

// 광고 상태 매핑 객체
const AD_STATUS_MAP = {
  PENDING: {
    badge: { label: "승인 대기", className: "pending" },
    mainBtn: { label: "신청 취소", color: "pink", disabled: false },
    subBtn: null,
  },
  WAITING: {
    badge: { label: "결제 대기중", className: "waiting" },
    mainBtn: { label: "결제", color: "black", disabled: false },
    subBtn: { label: "신청 취소", color: "pink", disabled: false },
  },
  ACTIVE: {
    badge: { label: "게시중", className: "active" },
    mainBtn: { label: "신청 취소", color: "pink", disabled: false },
    subBtn: { label: "결제 내역", color: "black", disabled: false },
  },
  FINISHED: {
    badge: { label: "종료됨", className: "finished" },
    mainBtn: { label: "결제 내역", color: "black", disabled: false },
    subBtn: null,
  },
  CANCELED: {
    badge: { label: "취소됨", className: "canceled" },
    mainBtn: null,
    subBtn: null,
  },
};

function AdsStatusDetail() {
  const location = useLocation();
  const { adStatus = "PENDING", adData = {} } = location.state || {};

  const statusConf = AD_STATUS_MAP[adStatus] || AD_STATUS_MAP.PENDING;

  const {
    imageUrl = "",
    bannerName = "",
    bannerType = "",
    periodStart = "",
    periodEnd = "",
    expoUrl = "",
    description = "",
    fileName = "",
    applicant = "",
    contact = "",
    email = "",
    company = "",
    amount = 600000, // 결제금액 예시 (실제 데이터로 교체)
  } = adData;

  // 모달 상태
  const [modalType, setModalType] = useState(null); // 'waiting' | 'finished' | null
  const [showPaymentSelection, setShowPaymentSelection] = useState(false); // 결제수단 선택 페이지 표시 상태

  // 메인 버튼 클릭 핸들러
  const handleMainBtnClick = () => {
    if (!statusConf.mainBtn) return;

    switch (statusConf.mainBtn.label) {
      case "결제":
        setModalType("waiting");
        break;
      case "결제 내역":
        setModalType("finished");
        break;
      case "신청 취소":
        // 실제 취소 연동 또는 confirm alert 등
        // alert("신청 취소 기능 연동 예정");
        break;
      default:
        // alert(statusConf.mainBtn.label + " 클릭됨");
        break;
    }
  };

  // 서브 버튼 클릭 핸들러
  const handleSubBtnClick = () => {
    if (!statusConf.subBtn) return;

    switch (statusConf.subBtn.label) {
      case "결제 내역":
        setModalType("finished");
        break;
      case "신청 취소":
        // alert("신청 취소 기능 연동 예정");
        break;
      default:
        // alert(statusConf.subBtn.label + " 클릭됨");
        break;
    }
  };

  const handleDownload = () => {
    // alert("다운로드 기능 연동 필요");
  };

  // 모달 닫기
  const handleCloseModal = () => setModalType(null);

  // 결제하기 버튼 (모달 내)
  const handlePay = () => {
    // 실제 결제 연동
    setShowPaymentSelection(true); // 결제수단 선택 페이지 표시
    handleCloseModal();
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
            <label>배너 이름</label>
            <input value={bannerName} readOnly className={styles.input} />

            <label>배너 타입</label>
            <input value={bannerType} readOnly className={styles.input} />

            <label>게시 기간</label>
            <div className={styles.periodInputRow}>
              <input value={periodStart} readOnly className={styles.input} />
              <span style={{ margin: "0 8px" }}>~</span>
              <input value={periodEnd} readOnly className={styles.input} />
            </div>

            <label>박람회 url</label>
            <input value={expoUrl} readOnly className={styles.input} />
          </div>
          {/* 우측 - 신청자 정보 */}
          <div className={styles.infoSection}>
            <label>신청자명</label>
            <input value={applicant} readOnly className={styles.input} />

            <label>신청자 연락처</label>
            <input value={contact} readOnly className={styles.input} />

            <label>신청자 이메일</label>
            <input value={email} readOnly className={styles.input} />

            <label>회사명</label>
            <input value={company} readOnly className={styles.input} />
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
            <label>첨부파일</label>
            <div className={styles.attachmentRow}>
              <input value={fileName} readOnly className={styles.input} />
              <button className={styles.downloadBtn} onClick={handleDownload}>
                다운로드
              </button>
            </div>
          </div>
          {/* 버튼: 두 칸 전체 */}
          <div className={styles.fullRow}>
            <div className={styles.buttonRow}>
              {statusConf.subBtn && (
                <button
                  className={`${styles.btn} ${styles[statusConf.subBtn.color]}`}
                  disabled={statusConf.subBtn.disabled}
                  onClick={handleSubBtnClick}
                >
                  {statusConf.subBtn.label}
                </button>
              )}
              {statusConf.mainBtn && (
                <button
                  className={`${styles.btn} ${
                    styles[statusConf.mainBtn.color]
                  }`}
                  disabled={statusConf.mainBtn.disabled}
                  onClick={handleMainBtnClick}
                >
                  {statusConf.mainBtn.label}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 모달: 조건부 렌더링 */}
        {modalType === "waiting" && (
          <PaymentWaitingModal
            expoName={bannerName}
            applicant={applicant}
            period={`${periodStart} ~ ${periodEnd}`}
            amount={amount}
            totalAmount={amount}
            onPay={handlePay}
            onCancel={handleCloseModal}
            onClose={handleCloseModal}
          />
        )}
        {modalType === "finished" && (
          <PaymentFinishedModal
            expoName={bannerName}
            applicant={applicant}
            period={`${periodStart} ~ ${periodEnd}`}
            amount={amount}
            totalAmount={amount}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default AdsStatusDetail;

import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./AdApplicationDetail.module.css";

function AdsInfoGrid({ 
  adData, 
  statusConf, 
  handleButtonAction,
  formatDate 
}) {
  const { t } = useTranslation();

  const {
    title,
    description,
    imageUrl,
    linkUrl,
    displayStartDate,
    displayEndDate,
    adPositionName,
    businessInfo = {}
  } = adData;

  const {
    companyName = "",
    ceoName = "",
    contactPhone = "",
    businessRegistrationNumber = "",
  } = businessInfo;

  return (
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
            <div className={styles.bannerImagePlaceholder}>
              {t('mypageGeneral.adsStatus.detail.bannerImage')}
            </div>
          )}
        </div>
      </div>
      
      {/* 좌측 - 광고 정보 */}
      <div className={styles.infoSection}>
        <label>{t('mypageGeneral.adsStatus.detail.adTitle')}</label>
        <div className={styles.input}>{title}</div>

        <label>{t('mypageGeneral.adsStatus.detail.adPosition')}</label>
        <div className={styles.input}>{adPositionName}</div>

        <label>{t('mypageGeneral.adsStatus.detail.displayPeriod')}</label>
        <div className={styles.periodInputRow}>
          <div className={styles.input}>{formatDate(displayStartDate)}</div>
          <span style={{ margin: "0 8px" }}>~</span>
          <div className={styles.input}>{formatDate(displayEndDate)}</div>
        </div>

        <label>{t('mypageGeneral.adsStatus.detail.linkUrl')}</label>
        <div className={styles.input}>{linkUrl}</div>
      </div>
      
      {/* 우측 - 신청자 정보 */}
      <div className={styles.infoSection}>
        <label>{t('mypageGeneral.adsStatus.detail.applicantName')}</label>
        <div className={styles.input}>{ceoName}</div>

        <label>{t('mypageGeneral.adsStatus.detail.applicantPhone')}</label>
        <div className={styles.input}>{contactPhone}</div>

        <label>{t('mypageGeneral.adsStatus.detail.companyName')}</label>
        <div className={styles.input}>{companyName}</div>

        <label>{t('mypageGeneral.adsStatus.detail.businessNumber')}</label>
        <div className={styles.input}>{businessRegistrationNumber}</div>
      </div>
      
      {/* 광고 소개: 두 칸 전체 */}
      <div className={styles.fullRow}>
        <label>{t('mypageGeneral.adsStatus.detail.adDescription')}</label>
        <div className={styles.textarea}>
          {description}
        </div>
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
  );
}

export default AdsInfoGrid;
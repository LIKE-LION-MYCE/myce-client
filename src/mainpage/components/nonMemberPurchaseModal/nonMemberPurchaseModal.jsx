import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./nonMemberPurchaseModal.module.css"; // fix case
import { FiX } from "react-icons/fi";
import {
  sendVerificatiionEmail,
  verifyVerificationEmail,
  VERIFICATION_TYPE,
} from "../../../api/service/auth/AuthService";
import { savePreReservation } from "../../../api/service/reservation/reservationApi";

export default function NonMemberPurchaseModal({
  ticket,
  expoId,
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const quantity = 1; // Non-members can only purchase 1 ticket

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen || !ticket) return null;

  const handleSendCode = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert(t('nonmember.purchaseModal.alerts.invalidEmail'));
      return;
    }
    
    setIsSendingEmail(true);
    try {
      await sendVerificatiionEmail(VERIFICATION_TYPE.NONMEMBER_VERIFY, email);
      alert(t('nonmember.purchaseModal.alerts.codeSent'));
      setIsCodeSent(true);
      setTimer(180); // 3 minutes timer
    } catch (error) {
      console.error("인증 코드 발송 실패:", error);
      alert(t('nonmember.purchaseModal.alerts.codeSendFailed'));
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert(t('nonmember.purchaseModal.alerts.enterCode'));
      return;
    }
    
    setIsVerifyingCode(true);
    try {
      await verifyVerificationEmail(
        VERIFICATION_TYPE.NONMEMBER_VERIFY,
        email,
        verificationCode
      );
      alert(t('nonmember.purchaseModal.alerts.emailVerified'));
      setIsVerified(true);
      setTimer(0);
    } catch (error) {
      console.error("이메일 인증 실패:", error);
      alert(t('nonmember.purchaseModal.alerts.invalidCode'));
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handlePurchase = async () => {
    // Added async
    if (!isVerified) {
      // 이 확인 로직이 있어야 함
      alert(t('nonmember.purchaseModal.alerts.verifyFirst'));
      return;
    }

    setIsLoading(true);

    try {
      const preReservationData = {
        ticketId: ticket.ticketId,
        expoId: expoId,
        userType: "GUEST",
        userId: 0, // As per user's clarification
        quantity: quantity,
      };

      console.log("비회원 구매: 결제 페이지로 이동합니다.", {
        expoId,
        preReservationData: {
          ticketId: ticket.ticketId,
          userType: "GUEST",
          userId: 0,
          quantity: quantity,
        },
      });

      // preReservation Id 반환하는 POST
      const response = await savePreReservation(preReservationData);

      // 세션 ID가 있으면 추가로 전달
      const queryParams = new URLSearchParams({
        preReservationId: response.reservationId
      });
      
      if (response.sessionId) {
        queryParams.set('sessionId', response.sessionId);
      }

      navigate(`/detail/${expoId}/payment?${queryParams.toString()}`);
      onClose();
    } catch (error) {
      console.error("사전 예약 생성 실패:", error);
      alert(t('nonmember.purchaseModal.alerts.purchaseFailed'));
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{t('nonmember.purchaseModal.title')}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.notice}>
            <p>{t('nonmember.purchaseModal.notice')}</p>
          </div>
          <div className={styles.ticketInfo}>
            <h4>{ticket.name}</h4>
            <p className={styles.price}>{ticket.price?.toLocaleString()}{t('nonmember.purchaseModal.summary.currency')}</p>
          </div>

          <div className={styles.emailSection}>
            <label htmlFor="email-input">{t('nonmember.purchaseModal.email.label')}</label>
            <div className={styles.inputWithButton}>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsVerified(false);
                  setIsCodeSent(false);
                }}
                placeholder={t('nonmember.purchaseModal.email.placeholder')}
                className={styles.emailInput}
                disabled={isCodeSent}
              />
              <button
                onClick={handleSendCode}
                disabled={isCodeSent || timer > 0 || isSendingEmail}
                className={`${styles.sendCodeBtn} ${isSendingEmail ? styles.loading : ''}`}
              >
                {isSendingEmail ? (
                  <span className={styles.loadingContent}>
                    <span className={styles.spinner}></span>
                    {t('nonmember.purchaseModal.email.sending')}
                  </span>
                ) : isCodeSent ? (
                  `${t('nonmember.purchaseModal.email.resend')} (${timer}s)`
                ) : (
                  t('nonmember.purchaseModal.email.sendCode')
                )}
              </button>
            </div>
          </div>

          {isCodeSent && (
            <div className={styles.verificationSection}>
              <label htmlFor="code-input">{t('nonmember.purchaseModal.code.label')}</label>
              <div className={styles.inputWithButton}>
                <input
                  id="code-input"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder={t('nonmember.purchaseModal.code.placeholder')}
                  className={styles.codeInput}
                  disabled={isVerified}
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={isVerified || isVerifyingCode}
                  className={`${styles.verifyBtn} ${isVerifyingCode ? styles.loading : ''}`}
                >
                  {isVerifyingCode ? (
                    <span className={styles.loadingContent}>
                      <span className={styles.spinner}></span>
                      {t('nonmember.purchaseModal.code.verifying')}
                    </span>
                  ) : isVerified ? (
                    t('nonmember.purchaseModal.code.verified')
                  ) : (
                    t('nonmember.purchaseModal.code.verify')
                  )}
                </button>
              </div>
            </div>
          )}

          <div className={styles.summary}>
            <span>{t('nonmember.purchaseModal.summary.total')}</span>
            <span className={styles.totalPrice}>
              {(ticket.price * quantity).toLocaleString()}{t('nonmember.purchaseModal.summary.currency')}
            </span>
          </div>

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              {t('nonmember.purchaseModal.buttons.cancel')}
            </button>
            <button
              className={styles.purchaseBtn}
              onClick={handlePurchase}
              disabled={!isVerified || isLoading}
            >
              {isLoading ? t('nonmember.purchaseModal.buttons.processing') : t('nonmember.purchaseModal.buttons.purchase')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

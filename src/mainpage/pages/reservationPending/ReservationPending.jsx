import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import styles from "./ReservationPending.module.css"; // CSS 파일 경로 수정
import { Link, useParams } from "react-router-dom";
import { getReservationPending } from "../../../api/service/reservation/reservationApi";
import ChatModal from "../../../components/shared/chat/ChatModal";
import LoginPromptModal from "../../../components/shared/chat/LoginPromptModal";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import ToastFail from "../../../common/components/toastFail/ToastFail";

export default function ReservationPending() {
  const { t } = useTranslation();
  const { reservationId } = useParams();
  // state 변수 이름을 더 명확하게 accountInfo로 변경했습니다.
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [failMessage, setFailMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // 가상계좌 정보를 가져오는 API를 호출합니다.
        const data = await getReservationPending(reservationId);
        setAccountInfo(data);
      } catch (e) {
        setError(
          e?.response?.data?.message || t('reservation.pending.messages.loadFailed')
        );
      }
    })();
  }, [reservationId]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleContactSupport = () => {
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  // 어떤 텍스트든 복사할 수 있도록 handleCopy 함수를 수정했습니다.
  const handleCopy = async (textToCopy, type) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      triggerToastSuccess(t('reservation.pending.messages.copied', { type }));
    } catch {
      triggerToastFail(t('reservation.pending.messages.copyFailed'));
    }
  };

  const triggerToastSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{t('reservation.pending.error')}</h1>
        <p className={styles.subtitle}>{error}</p>
        <Link to="/" className={styles.homeButton}>
          {t('reservation.pending.buttons.backToHome')}
        </Link>
      </div>
    );
  }

  if (!accountInfo) {
    return <div className={styles.container}>{t('reservation.pending.loading')}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('reservation.pending.title')}</h1>
      <p className={styles.subtitle}>
        {t('reservation.pending.subtitle')}
      </p>

      {/* 가상계좌 정보를 보여주는 UI로 변경했습니다. */}
      <div className={styles.infoBox}>
        <div className={styles.infoRow}>
          <span>{t('reservation.pending.fields.bank')}</span>
          <strong>{accountInfo.accountBank}</strong>
        </div>
        <div className={styles.infoRow}>
          <span>{t('reservation.pending.fields.accountNumber')}</span>
          <div className={styles.copyable}>
            <strong>{accountInfo.accountNumber}</strong>
            <button
              className={styles.copyButton}
              onClick={() => handleCopy(accountInfo.accountNumber, t('reservation.pending.fields.accountNumber'))}
            >
              {t('reservation.pending.buttons.copy')}
            </button>
          </div>
        </div>
        <div className={styles.infoRow}>
          <span>{t('reservation.pending.fields.amount')}</span>
          <strong>{accountInfo.amount.toLocaleString()}원</strong>
        </div>
        <div className={styles.infoRow}>
          <span>{t('reservation.pending.fields.dueDate')}</span>
          <strong className={styles.dueDate}>{accountInfo.dueDate}</strong>
        </div>
      </div>

      <p className={styles.notice}>
        {t('reservation.pending.messages.notice')}
      </p>

      <div className={styles.helpBox}>
        <p className={styles.helpText}>{t('reservation.pending.messages.helpText')}</p>
        <button onClick={handleContactSupport} className={styles.contactLink}>
          <span className={styles.icon}>💬</span> {t('reservation.pending.buttons.contactSupport')}
        </button>
      </div>

      <Link to="/" className={styles.homeButton}>
        {t('reservation.pending.buttons.backToHome')}
      </Link>
      
      {/* Chat Modals */}
      {isAuthenticated ? (
        <ChatModal 
          isOpen={isChatOpen} 
          onClose={handleChatClose}
        />
      ) : (
        <LoginPromptModal 
          isOpen={isChatOpen} 
          onClose={handleChatClose}
        />
      )}
      
      {/* 토스트 알림 */}
      {showSuccessToast && <ToastSuccess message={successMessage} />}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

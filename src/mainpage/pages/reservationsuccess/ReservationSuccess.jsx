import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import styles from "./ReservationSuccess.module.css";
import { Link, useParams } from "react-router-dom";
import { getReservationSuccess } from "../../../api/service/reservation/reservationApi";

export default function ReservationSuccess() {
  const { t } = useTranslation();
  const { reservationId } = useParams();
  const [info, setInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getReservationSuccess(reservationId);
        if (alive) setInfo(data);
      } catch (e) {
        if (alive) setError(e?.response?.data?.message || t('reservation.success.messages.loadFailed'));
      }
    })();
    return () => {
      alive = false;
    };
  }, [reservationId]);

  const handleCopy = async () => {
    if (!info?.reservationCode) return;
    try {
      await navigator.clipboard.writeText(info.reservationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(t('reservation.success.messages.copyFailed'));
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{t('reservation.success.messages.loadFailed')}</h1>
        <p className={styles.subtitle}>{error}</p>
        <Link to="/" className={styles.homeButton}>
          {t('reservation.success.buttons.backToHome')}
        </Link>
      </div>
    );
  }

  if (!info) {
    return <div className={styles.container}>{t('reservation.success.loading')}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('reservation.success.title')}</h1>
      <p className={styles.subtitle}>{t('reservation.success.subtitle')}</p>
      <p className={styles.email}>{info.email}</p>

      <button
        className={styles.resendButton}
        onClick={() => alert(t('reservation.success.messages.resendApiPending'))}
      >
        {t('reservation.success.buttons.resendEmail')}
      </button>

      <div className={styles.ticketBox}>
        <span className={styles.ticketLabel}>{t('reservation.success.fields.reservationNumber')}</span>
        <div className={styles.ticketCodeBox}>
          <span className={styles.ticketCode}>{info.reservationCode}</span>
          <button className={styles.copyButton} onClick={handleCopy}>
            {copied ? t('reservation.success.buttons.copied') : t('reservation.success.buttons.copy')}
          </button>
        </div>
      </div>

      <div className={styles.helpBox}>
        <p className={styles.helpText}>{t('reservation.success.messages.helpText')}</p>
        <Link to="/contact" className={styles.contactLink}>
          <span className={styles.icon}>💬</span> {t('reservation.success.buttons.contactSupport')}
        </Link>
      </div>

      <Link to="/" className={styles.homeButton}>
        {t('reservation.success.buttons.backToHome')}
      </Link>
    </div>
  );
}

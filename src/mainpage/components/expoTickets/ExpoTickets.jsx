import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExpoTickets.module.css';

const ExpoTickets = ({ tickets }) => {
  const { t } = useTranslation();
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className={styles.ticketsSection}>
      <h3>{t('expoDetail.expoTickets.title', '티켓 정보')}</h3>
      {tickets && tickets.length > 0 ? (
        <div className={styles.ticketsList}>
          {tickets.map((ticket) => (
            <div key={ticket.ticketId} className={styles.ticketInfoCard}>
              <div className={styles.ticketLeft}>
                <p className={styles.ticketType}>
                  {ticket.type === 'EARLY_BIRD' 
                    ? t('expoDetail.expoTickets.ticketTypes.earlyBird', '얼리버드') 
                    : t('expoDetail.expoTickets.ticketTypes.general', '일반')}
                </p>
                <h4>{ticket.name}</h4>
                <p className={styles.salePeriod}>
                  {t('expoDetail.expoTickets.salePeriod', '판매기간')}: {formatDate(ticket.saleStartDate)} - {formatDate(ticket.saleEndDate)}
                </p>
                {ticket.description && (
                  <p className={styles.description}>{ticket.description}</p>
                )}
              </div>
              <div className={styles.ticketRight}>
                <p className={styles.price}>
                  {ticket.price?.toLocaleString()}{t('expoDetail.expoTickets.won', '원')}
                </p>
                <p className={styles.quantity}>
                  {t('expoDetail.expoTickets.remainingQuantity', '남은 수량')}: {ticket.remainingQuantity?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('expoDetail.expoTickets.noTickets', '등록된 티켓이 없습니다.')}</p>
      )}
    </div>
  );
};

export default ExpoTickets;
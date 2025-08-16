import React from 'react';
import styles from './ExpoTickets.module.css';

const ExpoTickets = ({ tickets }) => {
  return (
    <div className={styles.ticketsSection}>
      <h3>티켓 정보</h3>
      {tickets && tickets.length > 0 ? (
        <div className={styles.ticketsList}>
          {tickets.map((ticket) => (
            <div key={ticket.ticketId} className={styles.ticketInfoCard}>
              <div className={styles.ticketLeft}>
                <p className={styles.ticketType}>
                  {ticket.type === 'EARLY_BIRD' ? '얼리버드' : '일반'}
                </p>
                <h4>{ticket.name}</h4>
                <p className={styles.salePeriod}>
                  판매기간: 2024.03.01 - 2024.05.15
                </p>
              </div>
              <div className={styles.ticketRight}>
                <p className={styles.price}>
                  {ticket.price?.toLocaleString()}원
                </p>
                <p className={styles.quantity}>
                  남은 수량: {ticket.remainingQuantity?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>등록된 티켓이 없습니다.</p>
      )}
    </div>
  );
};

export default ExpoTickets;
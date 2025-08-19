import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ticketDropdown.module.css'; // Fixed case sensitivity: TicketDropdown -> ticketDropdown

const TicketDropdown = ({ 
  tickets = [], 
  selectedTicketId, 
  onTicketSelect, 
  onPurchase,
  disabled = false 
}) => {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 선택된 티켓 정보 가져오기
  const selectedTicket = tickets.find(t => t.ticketId === selectedTicketId);

  // 판매 기간 체크 함수
  const isTicketSalePeriodValid = (ticket) => {
    if (!ticket.saleStartDate || !ticket.saleEndDate) return true; // 날짜 정보가 없으면 판매 가능으로 처리
    
    const today = new Date();
    const saleStart = new Date(ticket.saleStartDate);
    const saleEnd = new Date(ticket.saleEndDate);
    
    // 시간 부분을 제거하고 날짜만 비교
    today.setHours(0, 0, 0, 0);
    saleStart.setHours(0, 0, 0, 0);
    saleEnd.setHours(23, 59, 59, 999);
    
    return today >= saleStart && today <= saleEnd;
  };

  // 티켓 구매 가능 여부 체크
  const isTicketAvailable = (ticket) => {
    return ticket.remainingQuantity > 0 && isTicketSalePeriodValid(ticket);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleTicketSelect = (ticketId) => {
    onTicketSelect(ticketId);
    setDropdownOpen(false);
  };

  const handlePurchaseClick = () => {
    if (!selectedTicketId || !tickets || tickets.length === 0) {
      alert(t('expoDetail.expoTickets.dropdown.alerts.selectTicket', '티켓을 선택해주세요.'));
      return;
    }
    
    const ticket = tickets.find(t => t.ticketId === selectedTicketId);
    if (ticket && !isTicketAvailable(ticket)) {
      if (ticket.remainingQuantity <= 0) {
        alert(t('expoDetail.expoTickets.dropdown.alerts.ticketSoldOut', '선택한 티켓이 매진되었습니다.'));
      } else if (!isTicketSalePeriodValid(ticket)) {
        alert(t('expoDetail.expoTickets.dropdown.alerts.notInSalePeriod', '선택한 티켓의 판매 기간이 아닙니다.'));
      }
      return;
    }
    
    onPurchase();
  };

  return (
    <div className={styles.ticketPurchaseSection}>
      <h3>{t('expoDetail.expoTickets.dropdown.title', '티켓 구매')}</h3>
      <div className={styles.ticketDropdownContainer}>
        <div className={styles.customDropdown} ref={dropdownRef}>
          <button 
            className={styles.dropdownButton}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
            disabled={disabled || !tickets || tickets.length === 0}
          >
            {selectedTicket ? (
              `${selectedTicket.name} - ${selectedTicket.price?.toLocaleString()}${t('expoDetail.expoTickets.won', '원')}`
            ) : (
              t('expoDetail.expoTickets.dropdown.selectTicket', '티켓을 선택하세요')
            )}
            <span className={`${styles.dropdownArrow} ${dropdownOpen ? styles.open : ''}`}>
              ▼
            </span>
          </button>
          
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {tickets && tickets.length > 0 ? (
                tickets.map((ticket) => {
                  const isAvailable = isTicketAvailable(ticket);
                  const isSalePeriodValid = isTicketSalePeriodValid(ticket);
                  
                  return (
                    <button
                      key={ticket.ticketId}
                      className={`${styles.dropdownOption} ${!isAvailable ? styles.disabled : ''}`}
                      onClick={() => {
                        if (isAvailable) {
                          handleTicketSelect(ticket.ticketId);
                        }
                      }}
                      disabled={!isAvailable}
                      type="button"
                      title={
                        !isSalePeriodValid 
                          ? t('expoDetail.expoTickets.dropdown.salePeriodTooltip', '판매기간: {{start}} ~ {{end}}', { start: ticket.saleStartDate, end: ticket.saleEndDate })
                          : ticket.remainingQuantity <= 0 
                            ? t('expoDetail.expoTickets.dropdown.soldOutTooltip', '매진된 티켓입니다')
                            : ''
                      }
                    >
                      {ticket.name} - {ticket.price?.toLocaleString()}{t('expoDetail.expoTickets.won', '원')} 
                      ({!isSalePeriodValid 
                        ? t('expoDetail.expoTickets.dropdown.saleNotStarted', '판매기간 아님') 
                        : `${t('expoDetail.expoTickets.dropdown.remainingQuantityLabel', '남은 수량')}: ${ticket.remainingQuantity?.toLocaleString()}`})
                    </button>
                  );
                })
              ) : (
                <div className={styles.noOptions}>{t('expoDetail.expoTickets.noTickets', '등록된 티켓이 없습니다')}</div>
              )}
            </div>
          )}
        </div>
        
        <button 
          className={`${styles.purchaseBtn} ${!selectedTicketId || !tickets || tickets.length === 0 || disabled || (selectedTicket && !isTicketAvailable(selectedTicket)) ? styles.disabled : ''}`}
          disabled={!selectedTicketId || !tickets || tickets.length === 0 || disabled || (selectedTicket && !isTicketAvailable(selectedTicket))}
          onClick={handlePurchaseClick}
        >
          {t('expoDetail.expoTickets.dropdown.purchaseButton', '구매하기')}
        </button>
      </div>
    </div>
  );
};

export default TicketDropdown;
import React, { useState, useEffect, useRef } from 'react';
import styles from './TicketDropdown.module.css';

const TicketDropdown = ({ 
  tickets = [], 
  selectedTicketId, 
  onTicketSelect, 
  onPurchase,
  disabled = false 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 선택된 티켓 정보 가져오기
  const selectedTicket = tickets.find(t => t.ticketId === selectedTicketId);

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
      alert('티켓을 선택해주세요.');
      return;
    }
    onPurchase();
  };

  return (
    <div className={styles.ticketPurchaseSection}>
      <h3>티켓 구매</h3>
      <div className={styles.ticketDropdownContainer}>
        <div className={styles.customDropdown} ref={dropdownRef}>
          <button 
            className={styles.dropdownButton}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
            disabled={disabled || !tickets || tickets.length === 0}
          >
            {selectedTicket ? (
              `${selectedTicket.name} - ${selectedTicket.price?.toLocaleString()}원`
            ) : (
              '티켓을 선택하세요'
            )}
            <span className={`${styles.dropdownArrow} ${dropdownOpen ? styles.open : ''}`}>
              ▼
            </span>
          </button>
          
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {tickets && tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <button
                    key={ticket.ticketId}
                    className={`${styles.dropdownOption} ${ticket.remainingQuantity <= 0 ? styles.disabled : ''}`}
                    onClick={() => {
                      if (ticket.remainingQuantity > 0) {
                        handleTicketSelect(ticket.ticketId);
                      }
                    }}
                    disabled={ticket.remainingQuantity <= 0}
                    type="button"
                  >
                    {ticket.name} - {ticket.price?.toLocaleString()}원 
                    (남은 수량: {ticket.remainingQuantity?.toLocaleString()})
                  </button>
                ))
              ) : (
                <div className={styles.noOptions}>등록된 티켓이 없습니다</div>
              )}
            </div>
          )}
        </div>
        
        <button 
          className={`${styles.purchaseBtn} ${!selectedTicketId || !tickets || tickets.length === 0 || disabled ? styles.disabled : ''}`}
          disabled={!selectedTicketId || !tickets || tickets.length === 0 || disabled}
          onClick={handlePurchaseClick}
        >
          구매하기
        </button>
      </div>
    </div>
  );
};

export default TicketDropdown;
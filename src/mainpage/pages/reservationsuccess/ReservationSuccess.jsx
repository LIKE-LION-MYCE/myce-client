import React, {useState} from 'react';
import styles from './ReservationSuccess.module.css';
import { Link } from 'react-router-dom'; // 또는 next/link 사용

export default function ReservationSuccess() {
    const [copied, setCopied] = useState(false);
  const ticketCode = 'ab12bc123A53';

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>박람회 예약 완료!</h1>
      <p className={styles.subtitle}>티켓 정보가 이메일로 전송되었습니다</p>
      <p className={styles.email}>abc@abc.abc</p>
      <button className={styles.resendButton}>이메일 재전송</button>

      <div className={styles.ticketBox}>
      <span className={styles.ticketLabel}>예매 번호</span>
      <div className={styles.ticketCodeBox}>
        <span className={styles.ticketCode}>{ticketCode}</span>
        <button className={styles.copyButton} onClick={handleCopy}>
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
    </div>

      <div className={styles.helpBox}>
        <p className={styles.helpText}>문제가 있으신가요?</p>
        <Link to="/contact" className={styles.contactLink}>
          <span className={styles.icon}>💬</span> 담당자 문의
        </Link>
      </div>

      <Link to="/" className={styles.homeButton}>메인 페이지</Link>
    </div>
  );
}

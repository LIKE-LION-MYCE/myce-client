import styles from './SettlementReceipt.module.css';

function SettlementReceipt() {
  const data = {
    expoName: '촌캉스 귀촌 체험 박람회',
    applicant: '인포그램',
    period: '2025-07-19 ~ 2025-07-19',
    bank: '우리은행',
    accountNumber: '1002-238-3293929',
    accountHolder: '홍길동',
    platformFee: 150000,
    ticketAmount: 600000,
    issuedAt: '2025-08-01 11:35:22',
  };

  const total = data.platformFee + data.ticketAmount;
  const taxFree = Math.round(total / 1.1); // 과세물품가액
  const vat = total - taxFree; // 부가세

  return (
    <div className={styles.receiptContainer}>
      <h2 className={styles.title}>정산 내역</h2>

      <div className={styles.subtext}>[발행일시] {data.issuedAt}</div>
      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>박람회명</div>
        <div className={styles.value}>{data.expoName}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>신청자</div>
        <div className={styles.value}>{data.applicant}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>게시 기간</div>
        <div className={styles.value}>{data.period}</div>
      </div>

      <div className={styles.dividerDashed} />

      <div className={styles.section}>
        <div className={styles.label}>은행</div>
        <div className={styles.value}>{data.bank}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>은행 계좌번호</div>
        <div className={styles.value}>{data.accountNumber}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>입금자명</div>
        <div className={styles.value}>{data.accountHolder}</div>
      </div>

      <div className={styles.dividerDashed} />

      <div className={styles.amountRow}>
        <span>플랫폼 이용료</span>
        <span>{data.platformFee.toLocaleString()}원</span>
      </div>
      <div className={styles.amountRow}>
        <span>티켓 정산 금액</span>
        <span>{data.ticketAmount.toLocaleString()}원</span>
      </div>

      <div className={styles.totalRow}>
        <span>합계 금액</span>
        <span>{total.toLocaleString()}원</span>
      </div>

      <div className={styles.dividerDashed} />

      <div className={styles.amountRow}>
        <span>부가세 과세물품가액</span>
        <span>{taxFree.toLocaleString()}원</span>
      </div>
      <div className={styles.amountRow}>
        <span>부가세</span>
        <span>{vat.toLocaleString()}원</span>
      </div>
    </div>
  );
}

export default SettlementReceipt;
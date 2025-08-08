import styles from './PaymentTable.module.css';

function PaymentTable({ data }) {
  const columns = [
    { key: 'reservationCode', header: '예약코드' },
    { key: 'name', header: '이름' },
    { key: 'userType', header: '회원/비회원' },
    { key: 'loginId', header: '아이디' },
    { key: 'phone', header: '전화번호' },
    { key: 'email', header: '이메일' },
    { key: 'quantity', header: '수량' },
    { key: 'totalAmount', header: '결제 금액(원)' },
    { key: 'reservationStatus', header: '결제 상태' },
    { key: 'createdAt', header: '결제일' },
  ];

  const getBadgeClass = (status) => {
    switch (status) {
      case '예약 확정':
        return styles.badgePaid;
      case '결제 대기':
        return styles.badgePending;
      case '예약 취소':
        return styles.badgeCanceled;
      default:
        return '';
    }
  };

  const renderCell = (key, value) => {
    if (key === 'reservationStatus') {
      return (
        <span className={`${styles.badge} ${getBadgeClass(value)}`}>
          {value}
        </span>
      );
    }

    if (key === 'createdAt') {
      const date = new Date(value);
      return isNaN(date)
        ? '-'
        : `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${String(
            date.getHours()
          ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    if (key === 'totalAmount') {
      return typeof value === 'number' ? `${value.toLocaleString()}` : '-';
    }

    return value ?? '-';
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className={styles.row}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {renderCell(col.key, row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
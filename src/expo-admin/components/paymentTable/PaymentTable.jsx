import styles from './PaymentTable.module.css';

function PaymentTable({ data }) {
  const columns = [
    { key: 'reservationNumber', header: '예약 번호' },
    { key: 'name', header: '이름' },
    { key: 'id', header: '아이디' },
    { key: 'gender', header: '성별' },
    { key: 'phone', header: '전화번호' },
    { key: 'email', header: '이메일' },
    { key: 'quantity', header: '수량' },
    { key: 'totalPrice', header: '총 결제 금액' },
    { key: 'paymentStatus', header: '결제 상태' },
    { key: 'createdAt', header: '결제 일시' },
  ];

  const renderCell = (key, value) => {
    if (key === 'paymentStatus') {
      const statusClass =
        value === '결제 완료'
          ? styles.badgePaid
          : value === '결제 취소'
          ? styles.badgeCanceled
          : '';
      return <span className={`${styles.badge} ${statusClass}`}>{value}</span>;
    }

    if (key === 'createdAt') {
      const date = new Date(value);
      return isNaN(date)
        ? '-'
        : `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${String(
            date.getHours()
          ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    return value || '-';
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

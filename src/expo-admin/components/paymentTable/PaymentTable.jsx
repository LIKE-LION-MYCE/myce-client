import styles from './PaymentTable.module.css';

function PaymentTable({ columns, data }) {
  const renderCell = (key, value) => {
    if (key === 'paymentStatus') {
      const statusClass =
        value === '결제 완료'
          ? styles.badgePaid
          : value === '결제 대기'
          ? styles.badgePending
          : value === '결제 취소'
          ? styles.badgeCanceled
          : '';
      return <span className={`${styles.badge} ${statusClass}`}>{value}</span>;
    }

    return value || '-';
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((col, idx) => (
              <th key={idx} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className={styles.row}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={styles.td}>
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
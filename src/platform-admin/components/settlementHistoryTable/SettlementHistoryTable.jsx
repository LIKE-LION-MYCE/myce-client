import styles from './SettlementHistoryTable.module.css';

function SettlementHistoryTable({ data }) {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: '제목' },
    { key: 'type', header: '종류' },
    { key: 'settlementPeriod', header: '정산 기간' },
    { key: 'applicationDate', header: '신청 일자' },
    { key: 'registrationFee', header: '등록금' },
    { key: 'ticketFee', header: '티켓 수수료' },
    { key: 'totalRevenue', header: '총 수익' },
    { key: 'status', header: '상태' },
  ];

  const renderCell = (key, value) => {
    if (key === 'status') {
      const statusClass =
        value === '종료'
          ? styles.badgeTerminated
          : value === '진행중'
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

export default SettlementHistoryTable;
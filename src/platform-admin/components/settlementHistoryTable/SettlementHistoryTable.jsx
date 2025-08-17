import React from 'react';
import styles from './SettlementHistoryTable.module.css';

const statusBadgeMap = {
  SUCCESS: { text: '결제 성공', class: styles.badgeSuccess },
  PENDING: { text: '결제 대기', class: styles.badgePending },
  FAILED: { text: '결제 실패', class: styles.badgeFailed },
  REFUNDED: { text: '환불', class: styles.badgeRefunded },
  PARTIAL_REFUNDED: { text: '부분 환불', class: styles.badgePartialRefunded },
};

function SettlementHistoryTable({ data }) {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: '제목' },
    { key: 'type', header: '종류' },
    { key: 'serviceStartAt', header: '이용 시작' },
    { key: 'serviceEndAt', header: '이용 종료' },
    { key: 'createdAt', header: '신청 일자' },
    { key: 'deposit', header: '등록금' },
    { key: 'ticketBenefit', header: '티켓 수익' },
    { key: 'totalBenefit', header: '총 수익' },
    { key: 'status', header: '상태' },
  ];

  const typeNameMap = {
    EXPO: '박람회',
    AD: '광고',
  };

  const renderCell = (key, value) => {
    if (key === 'status') {
      const statusInfo = statusBadgeMap[value] || { text: value, class: '' };
      return (
        <span className={`${styles.badge} ${statusInfo.class}`}>
          {statusInfo.text}
        </span>
      );
    }

    if (key === 'type') {
      return typeNameMap[value] || value;
    }
    if (key === 'createdAt'){
      return value.substr(0,10);
    }
    if (key === 'deposit' || key === 'ticketBenefit' || key === 'totalBenefit') {
      return value ? `${Number(value).toLocaleString()}원` : '0원';
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
                  {/* renderCell에 row를 전체로 전달하여 다른 키의 값도 참조 가능하도록 수정 */}
                  {renderCell(col.key, row[col.key], row)}
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
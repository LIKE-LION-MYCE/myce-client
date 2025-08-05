import styles from './ReservationTable.module.css';
import { useState } from 'react';

const fieldLabelMap = {
  no: '번호',
  reservationNumber: '예약 번호',
  name: '이름',
  ismember: '회원 여부',
  id: '아이디',
  gender: '성별',
  phone: '전화번호',
  email: '이메일',
  ticketName: '티켓 이름',
  paymentStatus: '결제 상태',
  checkinDateTime: '입장 일시',
  checkinStatus: '입장 상태',
};

function ReservationTable({ data }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const columns = [
    { key: 'reservationNumber', header: '예약 번호' },
    { key: 'name', header: '이름' },
    { key: 'gender', header: '성별' },
    { key: 'phone', header: '전화번호' },
    { key: 'email', header: '이메일' },
    { key: 'ticketName', header: '티켓 이름' },
    { key: 'checkinDateTime', header: '입장 일시' },
    { key: 'checkinStatus', header: '입장 상태' },
  ];

  const toggleRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((_, index) => index));
    }
  };

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const renderCell = (key, value) => {
    if (key === 'checkinStatus') {
      const statusClass =
        value === '입장 완료'
          ? styles.badgeChecked
          : value === '입장 전'
          ? styles.badgeNotChecked
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
            <th className={styles.th}>
              <input
                type="checkbox"
                onChange={toggleAllRows}
                checked={selectedRows.length === data.length && data.length > 0}
              />
            </th>
            {columns.map((col, idx) => (
              <th key={idx} className={styles.th}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <>
              <tr
                key={rowIndex}
                className={`${styles.row} ${selectedRows.includes(rowIndex) ? styles.selectedRow : ''}`}
                onClick={() => handleRowClick(rowIndex)}
              >
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(rowIndex)}
                    onChange={() => toggleRow(rowIndex)}
                  />
                </td>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={styles.td}>
                    {renderCell(col.key, row[col.key])}
                  </td>
                ))}
              </tr>
              {expandedRow === rowIndex && (
                <tr className={styles.detailRow}>
                  <td colSpan={columns.length + 1}>
                    <div className={styles.detailBox}>
                      {Object.entries(row).map(([key, value]) => (
                        <div key={key} className={styles.detailItem}>
                          <div className={styles.detailLabel}>{fieldLabelMap[key] || key}</div>
                          <div className={styles.detailValue}>{value || '-'}</div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationTable;
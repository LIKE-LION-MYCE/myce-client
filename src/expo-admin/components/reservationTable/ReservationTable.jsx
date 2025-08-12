import styles from './ReservationTable.module.css';
import { useState } from 'react';

//날짜 포맷
function formatDateTime(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const pad = (n) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
}

// 생년월일 포맷 (LocalDate → yyyy-MM-dd)
function formatBirth(date) {
  if (!date) return '-';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  const pad = (n) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${y}-${m}-${day}`;
}

function ReservationTable({ data = [], onEntranceClick }) {
  //선택 행 관리
  const [selectedKeys, setSelectedKeys] = useState([]); // [reserverId...]

  const columns = [
    { key: 'reservationCode', header: '예약 코드' },
    { key: 'name', header: '이름' },
    { key: 'gender', header: '성별' },
    { key: 'birth', header : '생년월일'},
    { key: 'phone', header: '전화번호' },
    { key: 'email', header: '이메일' },
    { key: 'ticketName', header: '티켓 이름' },
    { key: 'entranceAt', header: '입장 일시' },
    { key: 'entranceStatus', header: '입장 상태' },
  ];

  const getRowKey = (row, index) =>
    row?.reserverId ?? `${row?.reservationCode || 'row'}-${index}`;

  const toggleRow = (rowKey) => {
    setSelectedKeys((prev) =>
      prev.includes(rowKey) ? prev.filter((k) => k !== rowKey) : [...prev, rowKey]
    );
  };

  const toggleAllRows = () => {
    const allKeys = data.map((row, i) => getRowKey(row, i));
    const allSelected = allKeys.every((k) => selectedKeys.includes(k));
    setSelectedKeys(allSelected ? [] : allKeys);
  };

  const renderCell = (key, value, row) => {
    if (key === 'entranceStatus') {
      const text = value || '-';
      const statusClass =
        text === '입장 완료'
          ? styles.badgeChecked
          : text === '입장 전'
          ? styles.badgeNotChecked
          : text === '티켓 만료'
          ? styles.badgeExpired
          : text === '발급 대기'
          ? styles.badgePending
          : '';

      const clickable =  text === '입장 전' || text === '발급 대기';

      return (
        <span
          className={`${styles.badge} ${statusClass}`}
          onClick={(e) => {
            if (!clickable) return;
            e.stopPropagation();
            onEntranceClick && onEntranceClick(row);
          }}
          role="button"
          aria-disabled={!clickable}
          title={clickable ? '수기 입장 처리' : '상태 변경 불가'}
        >
          {text}
        </span>
      );
    }

    if (key === 'entranceAt') {
      return formatDateTime(value);
    }

    if (key === 'birth') {
      return formatBirth(value);
    }

    return value || '-';
  };

  // 헤더 체크박스 상태
  const allRowKeys = data.map((row, i) => getRowKey(row, i));
  const allChecked = allRowKeys.length > 0 && allRowKeys.every((k) => selectedKeys.includes(k));

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.th}>
              <input
                type="checkbox"
                onChange={toggleAllRows}
                checked={allChecked}
                aria-label="전체 선택"
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey = getRowKey(row, rowIndex);
            const isSelected = selectedKeys.includes(rowKey);

            return (
              <tr
                key={rowKey}
                className={`${styles.row} ${isSelected ? styles.selectedRow : ''}`}
              >
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRow(rowKey)}
                    aria-label="행 선택"
                  />
                </td>

                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {renderCell(col.key, row[col.key], row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationTable;
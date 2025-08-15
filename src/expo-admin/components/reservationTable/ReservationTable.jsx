import styles from './ReservationTable.module.css';
import { useEffect, useRef } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

// 날짜 포맷
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

function ReservationTable({
  data = [],
  selectedIds,
  selectAllMatching,
  onToggleRow,
  onTogglePage,
  onEntranceClick,
  reissuedIds = new Set(),
}) {
  const columns = [
    { key: 'reservationCode', header: '예약 코드' },
    { key: 'name', header: '이름' },
    { key: 'gender', header: '성별' },
    { key: 'birth', header: '생년월일' },
    { key: 'phone', header: '전화번호' },
    { key: 'email', header: '이메일' },
    { key: 'ticketName', header: '티켓 이름' },
    { key: 'entranceAt', header: '입장 일시' },
    { key: 'entranceStatus', header: '입장 상태' },
  ];

  const getRowKey = (row, index) => row?.reserverId ?? `${row?.reservationCode || 'row'}-${index}`;
  const currentPageIds = data.map(getRowKey);

  const allCheckedOnThisPage =
    currentPageIds.length > 0 && currentPageIds.every((k) => selectedIds.has(k));
  const someCheckedOnThisPage =
    !allCheckedOnThisPage && currentPageIds.some((k) => selectedIds.has(k));

  const headerRef = useRef(null);
  useEffect(() => {
    if (headerRef.current) headerRef.current.indeterminate = someCheckedOnThisPage;
  }, [someCheckedOnThisPage]);

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

      const clickable = text === '입장 전' || text === '발급 대기';

      const recentlyReissued = reissuedIds.has(row.reserverId);

      return (
        <span className={styles.statusCellWrapper}>
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

          {recentlyReissued && (
            <span className={styles.reissueChip} title="방금 재발급 완료">
              <FaCheckCircle className={styles.reissueIcon} />
              재발급 완료
            </span>
          )}
        </span>
      );
    }

    if (key === 'entranceAt') return formatDateTime(value);
    if (key === 'birth') return formatBirth(value);

    return value || '-';
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.th}>
              <input
                ref={headerRef}
                type="checkbox"
                onChange={() => onTogglePage(currentPageIds, data)}
                checked={allCheckedOnThisPage}
                aria-label="현재 페이지 전체 선택"
                title="현재 페이지 전체 선택"
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
            const isSelected = selectAllMatching ? true : selectedIds.has(rowKey);
            const recentlyReissued = reissuedIds.has(row.reserverId);

            return (
              <tr
                key={rowKey}
                className={`${styles.row} ${isSelected ? styles.selectedRow : ''} ${recentlyReissued ? styles.updatedRow : ''}`}
              >
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleRow(rowKey, row)}
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
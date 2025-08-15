import { useState, useMemo, useEffect, Fragment } from 'react';
import styles from './PaymentTable.module.css';

const DISPLAY_LIMIT = 10;
const DATE_KEYS = new Set(['createdAt']);

function formatDateTime(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const pad = (n) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
}

function formatBirth(dateVal) {
  if (!dateVal) return '-';
  if (typeof dateVal === 'string') return dateVal;
  try {
    const d = new Date(dateVal);
    if (Number.isNaN(d.getTime())) return String(dateVal);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  } catch {
    return String(dateVal);
  }
}

function PaymentTable({ data = [], fetchDetail }) {
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

  const [expandedRow, setExpandedRow] = useState(null);
  const [detailMap, setDetailMap] = useState({});
  const [showAllMap, setShowAllMap] = useState({});

  const getRowKey = (row, idx) => {
    const base =
      row?.reservationId ??
      row?.paymentId ??
      row?.id ??
      row?._id ??
      row?.reservationCode ??
      `idx-${idx}`;
    return `payrow-${String(base)}-${idx}`;
  };

  const dataSignature = useMemo(
    () => (data || []).map((r, i) => getRowKey(r, i)).join('|'),
    [data]
  );

  useEffect(() => {
    setExpandedRow(null);
    setDetailMap({});
    setShowAllMap({});
  }, [dataSignature]);

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
      return <span className={`${styles.badge} ${getBadgeClass(value)}`}>{value}</span>;
    }
    if (key === 'createdAt' || DATE_KEYS.has(key)) {
      return formatDateTime(value);
    }
    if (key === 'totalAmount') {
      return typeof value === 'number' ? value.toLocaleString() : '-';
    }
    return value ?? '-';
  };

  const handleRowClick = async (rowIndex) => {
    const next = expandedRow === rowIndex ? null : rowIndex;
    setExpandedRow(next);
    if (next === null) return;

    const row = data[rowIndex];
    const rowKey = getRowKey(row, rowIndex);

    if (detailMap[rowKey]?.data || detailMap[rowKey]?.loading) return;

    const inline = row?.reservations || row?.reservers;
    if (Array.isArray(inline)) {
      setDetailMap((prev) => ({
        ...prev,
        [rowKey]: { loading: false, error: null, data: { reservers: inline } },
      }));
      return;
    }

    if (typeof fetchDetail === 'function') {
      setDetailMap((prev) => ({
        ...prev,
        [rowKey]: { loading: true, error: null, data: null },
      }));
      try {
        const detail = await fetchDetail(row?.reservationId);
        setDetailMap((prev) => ({
          ...prev,
          [rowKey]: { loading: false, error: null, data: detail || { reservers: [] } },
        }));
      } catch (err) {
        setDetailMap((prev) => ({
          ...prev,
          [rowKey]: { loading: false, error: err?.message || '상세 조회 실패', data: null },
        }));
      }
    }
  };

  const toggleShowAll = (rowKey) => {
    setShowAllMap((prev) => ({ ...prev, [rowKey]: !prev[rowKey] }));
  };

const renderDetailBox = (detail, rowKey) => {
  if (!detail) return null;

  const reservers = Array.isArray(detail) ? detail : Array.isArray(detail.reservers) ? detail.reservers : [];
  const total = reservers.length;
  const showAll = !!showAllMap[rowKey];
  const hiddenCount = Math.max(0, total - DISPLAY_LIMIT);
  const visible = showAll ? reservers : reservers.slice(0, DISPLAY_LIMIT);

  return (
    <div className={styles.detailBox}>
      <div className={styles.detailHeaderRow}>
        <div className={styles.detailHeaderLeft}>
          <span className={styles.detailTitle}>예약자 목록 : </span>
          <span className={styles.detailCount}>총 {total}명</span>
        </div>
        {hiddenCount > 0 && (
          <button
            type="button"
            className={styles.moreBtn}
            onClick={() => toggleShowAll(rowKey)}
          >
            {showAll ? '접기' : `외 ${hiddenCount}명 더 보기`}
          </button>
        )}
      </div>

      <div className={styles.detailTableWrapper}>
        <table className={styles.detailTable}>
          <thead>
            <tr>
              <th className={styles.thMini}>#</th>
              <th>이름</th>
              <th>성별</th>
              <th>생년월일</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>티켓 이름</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  -
                </td>
              </tr>
            ) : (
              visible.map((r, i) => {
                const ticketName =
                  r.ticketName ??
                  detail.ticketName ??
                  r?.reservation?.ticketName ??
                  '-';

                return (
                  <tr
                    key={`reserver-${r.reserverId ?? ''}-${r.email ?? ''}-${r.phone ?? ''}-${i}`}
                  >
                    <td className={styles.tdIndex}>{showAll ? i + 1 : i + 1}</td>
                    <td>{r.name ?? '-'}</td>
                    <td>{r.gender ?? '-'}</td>
                    <td>{formatBirth(r.birth)}</td>
                    <td>{r.phone ?? '-'}</td>
                    <td className={styles.emailCell}>{r.email ?? '-'}</td>
                    <td className={styles.emailCell}>{ticketName}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((col) => (
              <th key={`pay-col-${col.key}`} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey = getRowKey(row, rowIndex);
            const detailState = rowKey ? detailMap[rowKey] : undefined;
            const isExpanded = expandedRow === rowIndex;

            return (
              <Fragment key={`rowgrp-${rowKey}`}>
                <tr className={styles.row} onClick={() => handleRowClick(rowIndex)}>
                  {columns.map((col) => (
                    <td key={`pay-cell-${col.key}-${rowIndex}`} className={styles.td}>
                      {renderCell(col.key, row[col.key])}
                    </td>
                  ))}
                </tr>

                {isExpanded && (
                  <tr className={styles.detailRow}>
                    <td colSpan={columns.length}>
                      {detailState?.loading && <div className={styles.detailBox}>불러오는 중...</div>}
                      {detailState?.error && (
                        <div className={styles.detailBox} style={{ color: '#dc2626' }}>
                          {detailState.error}
                        </div>
                      )}
                      {detailState?.data && renderDetailBox(detailState.data, rowKey)}
                      {!detailState && <div className={styles.detailBox}>불러오는 중...</div>}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
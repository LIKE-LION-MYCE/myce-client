import { useState, useMemo, useEffect, Fragment, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMyEmailDetail } from '../../../api/service/expo-admin/email/EmailService';
import styles from './EmailTable.module.css';

const fieldLabelMap = {
  subject: '제목',
  content: '내용',
  recipientCount: '총 수신자',
  recipients: '총 수신자',
  createdAt: '발송일시',
};

const DATE_KEYS = new Set(['createdAt']);
const DISPLAY_LIMIT = 10; // 수신자 기본 노출 개수(버튼 카운트 계산용)

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

function EmailTable({ columns, data = [] }) {
  const { expoId } = useParams();
  const [expandedRow, setExpandedRow] = useState(null);
  const [detailMap, setDetailMap] = useState({});
  const [showAllRecipientsMap, setShowAllRecipientsMap] = useState({});
  const listRefs = useRef({});

  const renderValue = (key, value) => {
    if (DATE_KEYS.has(key)) return formatDateTime(value);
    return value ?? '-';
  };

  const getRowKey = (row, idx) => {
    const base = row?.id ?? row?._id ?? `${row?.createdAt ?? ''}-${row?.subject ?? ''}`;
    return `emrow-${String(base)}-${idx}`;
  };

  const dataSignature = useMemo(
    () => (data || []).map((r, i) => getRowKey(r, i)).join('|'),
    [data]
  );

  useEffect(() => {
    setExpandedRow(null);
    setDetailMap({});
    setShowAllRecipientsMap({});
    listRefs.current = {};
  }, [dataSignature, expoId]);

  const handleRowClick = async (rowIndex) => {
    const next = expandedRow === rowIndex ? null : rowIndex;
    setExpandedRow(next);
    if (next === null) return;

    const row = data[rowIndex];
    const emailId = row?.id ?? row?._id ?? null;
    const rowKey = getRowKey(row, rowIndex);
    const storeKey = emailId ?? rowKey;

    if (detailMap[storeKey]?.data || detailMap[storeKey]?.loading) return;

    if (!expoId) {
      setDetailMap((prev) => ({
        ...prev,
        [storeKey]: { loading: false, error: 'expoId가 없습니다.', data: null },
      }));
      return;
    }

    setDetailMap((prev) => ({
      ...prev,
      [storeKey]: { loading: true, error: null, data: null },
    }));

    try {
      const detail = await getMyEmailDetail(expoId, emailId);
      setDetailMap((prev) => ({
        ...prev,
        [storeKey]: { loading: false, error: null, data: detail },
      }));
    } catch (err) {
      setDetailMap((prev) => ({
        ...prev,
        [storeKey]: { loading: false, error: err?.message || '상세 조회 실패', data: null },
      }));
    }
  };

  const toggleRecipients = (storeKey) => {
    setShowAllRecipientsMap((prev) => {
      const nextExpanded = !prev[storeKey];
      if (!nextExpanded && listRefs.current[storeKey]) {
        listRefs.current[storeKey].scrollTop = 0;
      }
      return { ...prev, [storeKey]: nextExpanded };
    });
  };

  const renderDetailBox = (detail, storeKey) => {
    if (!detail) return null;
    const { subject, content, recipientCount, recipientInfos = [], createdAt } = detail;

    const total = recipientCount ?? recipientInfos.length ?? 0;
    const hiddenCount = Math.max(0, (recipientInfos?.length ?? 0) - DISPLAY_LIMIT);
    const expanded = !!showAllRecipientsMap[storeKey];

    return (
      <div className={styles.detailBox}>
        <div className={styles.detailTableWrapper}>
          <table className={styles.detailTable}>
            <tbody>
              <tr>
                <td className={styles.metaLabel}>{fieldLabelMap.subject}</td>
                <td className={styles.metaValue}>{subject ?? '-'}</td>
              </tr>
              <tr>
                <td className={styles.metaLabel}>{fieldLabelMap.content}</td>
                <td className={`${styles.metaValue} ${styles.preWrap}`}>{content ?? '-'}</td>
              </tr>
              <tr>
                <td className={styles.metaLabel}>{fieldLabelMap.createdAt}</td>
                <td className={styles.metaValue}>{formatDateTime(createdAt)}</td>
              </tr>
              <tr>
                <td className={styles.metaLabel}>{fieldLabelMap.recipientCount}</td>
                <td className={styles.metaValue}>{total}</td>
              </tr>

              <tr>
                <td className={styles.metaLabel}>수신자 목록</td>
                <td className={`${styles.metaValue} ${styles.recipientsCell}`}>
                  {recipientInfos.length === 0 ? (
                    <span className={styles.emptyCell}>-</span>
                  ) : (
                    <>
                      <div
                        className={`${styles.recipientsScroll} ${
                          expanded ? styles.recipientsExpanded : ''
                        }`}
                        ref={(el) => {
                          if (el) listRefs.current[storeKey] = el;
                        }}
                      >
                        <ul className={styles.recipientsList}>
                          {recipientInfos.map((r, i) => (
                            <li key={`recipient-${r.email ?? ''}-${i}`}>
                              {r.name ? `${r.name} ` : ''}
                              <span className={styles.recipientEmail}>{`<${r.email}>`}</span>
                            </li>
                          ))}
                        </ul>

                        {!expanded && hiddenCount > 0 && (
                          <div className={styles.fadeOverlay} aria-hidden="true" />
                        )}
                      </div>

                      {hiddenCount > 0 && (
                        <button
                          type="button"
                          className={styles.moreBtn}
                          onClick={() => toggleRecipients(storeKey)}
                        >
                          {expanded ? '접기' : `외 ${hiddenCount}명 더 보기`}
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
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
              <th key={`em-col-${col.key}`} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey = getRowKey(row, rowIndex);
            const emailId = row?.id ?? row?._id ?? null;
            const storeKey = emailId ?? rowKey;
            const detailState = detailMap[storeKey];
            const isExpanded = expandedRow === rowIndex;

            return (
              <Fragment key={`rowgrp-${rowKey}`}>
                <tr className={styles.row} onClick={() => handleRowClick(rowIndex)}>
                  {columns.map((col) => (
                    <td
                      key={`em-cell-${col.key}-${rowIndex}`}
                      className={`${styles.td} ${
                        col.key === 'content' || col.key === 'body' ? styles.bodyCell : ''
                      } ${col.groupStart ? styles.groupStart : ''} ${
                        col.code ? styles.codeCell : ''
                      }`}
                    >
                      {renderValue(col.key, row[col.key])}
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
                      {detailState?.data && renderDetailBox(detailState.data, storeKey)}
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

export default EmailTable;
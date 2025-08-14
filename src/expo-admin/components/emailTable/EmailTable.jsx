import { useState, useMemo, useEffect, Fragment } from 'react';
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
const DISPLAY_LIMIT = 10; // 수신자 기본 표시 개수

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

function EmailTable({ columns, data }) {
  const { expoId } = useParams();
  const [expandedRow, setExpandedRow] = useState(null);
  const [detailMap, setDetailMap] = useState({});
  const [showAllRecipientsMap, setShowAllRecipientsMap] = useState({});

  const renderValue = (key, value) => {
    if (DATE_KEYS.has(key)) return formatDateTime(value);
    return value ?? '-';
  };

  const dataSignature = useMemo(
    () =>
      (data || [])
        .map((r) => r.id ?? r._id ?? `${r.createdAt ?? ''}-${r.subject ?? ''}-${r.fileName ?? ''}`)
        .join('|'),
    [data]
  );

  useEffect(() => {
    setExpandedRow(null);
    setDetailMap({});
    setShowAllRecipientsMap({});
  }, [dataSignature, expoId]);

  const handleRowClick = async (rowIndex) => {
    const next = expandedRow === rowIndex ? null : rowIndex;
    setExpandedRow(next);
    if (next === null) return;

    const row = data[rowIndex];
    const emailId = row.id ?? row._id;
    if (!emailId) return;

    if (detailMap[emailId]?.data || detailMap[emailId]?.loading) return;

    if (!expoId) {
      setDetailMap((prev) => ({
        ...prev,
        [emailId]: { loading: false, error: 'expoId가 없습니다.', data: null },
      }));
      return;
    }

    setDetailMap((prev) => ({
      ...prev,
      [emailId]: { loading: true, error: null, data: null },
    }));

    try {
      const detail = await getMyEmailDetail(expoId, emailId);
      setDetailMap((prev) => ({
        ...prev,
        [emailId]: { loading: false, error: null, data: detail },
      }));
    } catch (err) {
      setDetailMap((prev) => ({
        ...prev,
        [emailId]: { loading: false, error: err?.message || '상세 조회 실패', data: null },
      }));
    }
  };

  const toggleRecipients = (emailId) => {
    setShowAllRecipientsMap((prev) => ({ ...prev, [emailId]: !prev[emailId] }));
  };

  const renderDetailBox = (detail, emailId) => {
    if (!detail) return null;
    const { subject, content, recipientCount, recipientInfos = [], createdAt } = detail;

    const showAll = !!showAllRecipientsMap[emailId];
    const hiddenCount = Math.max(0, recipientInfos.length - DISPLAY_LIMIT);
    const visibleList = showAll ? recipientInfos : recipientInfos.slice(0, DISPLAY_LIMIT);

    return (
      <div className={styles.detailBox}>
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>{fieldLabelMap.subject}</div>
          <div className={styles.detailValue}>{subject ?? '-'}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>{fieldLabelMap.content}</div>
          <div className={styles.detailValue} style={{ whiteSpace: 'pre-wrap' }}>
            {content ?? '-'}
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>{fieldLabelMap.createdAt}</div>
          <div className={styles.detailValue}>{formatDateTime(createdAt)}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>{fieldLabelMap.recipientCount}</div>
          <div className={styles.detailValue}>{recipientCount ?? recipientInfos.length ?? 0}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>수신자 목록</div>
          <div className={styles.detailValue}>
            {recipientInfos.length === 0 ? (
              '-'
            ) : (
              <>
                <ul className={styles.recipientsList}>
                  {visibleList.map((r, i) => (
                    <li key={`${r.email}-${i}`}>
                      {r.name ? `${r.name} ` : ''}
                      <span style={{ color: '#6b7280' }}>{`<${r.email}>`}</span>
                    </li>
                  ))}
                </ul>

                {hiddenCount > 0 && !showAll && (
                  <button
                    type="button"
                    className={styles.moreBtn}
                    onClick={() => toggleRecipients(emailId)}
                  >
                    외 {hiddenCount}명 더 보기
                  </button>
                )}

                {showAll && recipientInfos.length > DISPLAY_LIMIT && (
                  <button
                    type="button"
                    className={styles.moreBtn}
                    onClick={() => toggleRecipients(emailId)}
                  >
                    접기
                  </button>
                )}
              </>
            )}
          </div>
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
              <th key={col.key} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey = row.id ?? row._id ?? `row-${rowIndex}`;
            const emailId = row.id ?? row._id;
            const detailState = emailId ? detailMap[emailId] : undefined;
            const isExpanded = expandedRow === rowIndex;

            return (
              <Fragment key={rowKey}>
                <tr className={styles.row} onClick={() => handleRowClick(rowIndex)}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`${styles.td} ${
                        col.key === 'content' || col.key === 'body' ? styles.bodyCell : ''
                      } ${col.groupStart ? styles.groupStart : ''} ${col.code ? styles.codeCell : ''}`}
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
                      {detailState?.data && renderDetailBox(detailState.data, emailId)}
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
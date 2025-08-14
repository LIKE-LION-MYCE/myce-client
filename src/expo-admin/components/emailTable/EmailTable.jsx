import { useState, Fragment } from 'react';
import styles from './EmailTable.module.css';

const fieldLabelMap = {
  subject: '제목',
  content: '내용',
  body: '내용',
  recipientCount: '총 수신자',
  recipients: '총 수신자',
  createdAt: '발송일시',
  sentAt: '발송일시',
  fileName: '첨부파일',
};

// ✅ 누락된 날짜 키 집합 추가
const DATE_KEYS = new Set(['createdAt', 'sentAt', 'updatedAt']);

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

function EmailTable({ columns, data, numbered = true, numberOffset = 0 }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const renderValue = (key, value) => {
    if (DATE_KEYS.has(key)) return formatDateTime(value);
    return value ?? '-';
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {numbered && (
              <th className={styles.th} style={{ width: 64, textAlign: 'center' }}>
                번호
              </th>
            )}
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
            return (
              <Fragment key={rowKey}>
                <tr className={styles.row} onClick={() => handleRowClick(rowIndex)}>
                  {numbered && (
                    <td className={styles.td} style={{ textAlign: 'center' }}>
                      {numberOffset + rowIndex + 1}
                    </td>
                  )}

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

                {expandedRow === rowIndex && (
                  <tr className={styles.detailRow}>
                    <td colSpan={columns.length + (numbered ? 1 : 0)}>
                      <div className={styles.detailBox}>
                        {Object.entries(row).map(([key, value]) => (
                          <div key={key} className={styles.detailItem}>
                            <div className={styles.detailLabel}>{fieldLabelMap[key] || key}</div>
                            <div className={styles.detailValue}>{renderValue(key, value)}</div>
                          </div>
                        ))}
                      </div>
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
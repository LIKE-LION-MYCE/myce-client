import { useState } from 'react';
import styles from './EmailTable.module.css';

const fieldLabelMap = {
  subject: '제목',
  body: '내용',
  recipients: '총 수신자',
  sentAt: '발송일시',
  fileName: '첨부파일',
};

function EmailTable({ columns, data }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
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
            <>
              <tr
                key={rowIndex}
                className={styles.row}
                onClick={() => handleRowClick(rowIndex)}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`${styles.td} ${
                      col.key === 'body' ? styles.bodyCell : ''
                    } ${col.groupStart ? styles.groupStart : ''} ${
                      col.code ? styles.codeCell : ''
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
              {expandedRow === rowIndex && (
                <tr className={styles.detailRow}>
                  <td colSpan={columns.length}>
                    <div className={styles.detailBox}>
                      {Object.entries(row).map(([key, value]) => (
                        <div key={key} className={styles.detailItem}>
                          <div className={styles.detailLabel}>
                            {fieldLabelMap[key] || key}
                          </div>
                          <div className={styles.detailValue}>
                            {value || '-'}
                          </div>
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

export default EmailTable;

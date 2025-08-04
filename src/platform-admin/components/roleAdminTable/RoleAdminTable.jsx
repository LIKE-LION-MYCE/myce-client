import { useState } from 'react';
import styles from './RoleAdminTable.module.css';

const fieldLabelMap = {
  id: 'ID',
  username: '아이디',
  name: '이름',
  gender: '성별',
  birth: '생년월일',
  expoName: '박람회명',
  email: '이메일',
  phone: '전화번호',
  createdAt: '등록일자',
  status: '상태',
  adminCodes: '하위 관리자 코드',
};

const statusMap = {
  PENDING_APPROVAL: '승인 대기',
  WAITING_PAYMENT: '결제 대기',
  APPROVED: '승인 완료',
  REJECTED: '반려됨',
  CANCELED: '취소됨',
};

function RoleAdminTable({ data }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'username', header: '아이디' },
    { key: 'name', header: '신청자' },
    { key: 'expoName', header: '박람회명' },
    { key: 'email', header: '이메일' },
    { key: 'phone', header: '전화번호' },
    { key: 'createdAt', header: '등록일자' },
    { key: 'status', header: '상태' },
  ];

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
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
            <>
              <tr
                key={rowIndex}
                className={styles.row}
                onClick={() => handleRowClick(rowIndex)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.key === 'status'
                      ? statusMap[row[col.key]] || row[col.key]
                      : row[col.key]}
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
                            {key === 'adminCodes'
                              ? value?.join(', ') || '-'
                              : key === 'status'
                              ? statusMap[value] || value
                              : value || '-'}
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

export default RoleAdminTable;
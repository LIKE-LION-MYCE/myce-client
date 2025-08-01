import { useState } from 'react';
import styles from './RoleUserTable.module.css';

const fieldLabelMap = {
  id: 'ID',
  username: '아이디',
  name: '회원이름',
  gender: '성별',
  birth: '생년월일',
  email: '이메일',
  phone: '전화번호',
  createdAt: '회원가입 일시',
  mileage: '보유 마일리지',
  isActive: '활성화 여부',
};

const isActiveMap = {
  true: '활성화',
  false: '비활성화',
};

function RoleUserTable({ data }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'username', header: '아이디' },
    { key: 'name', header: '회원이름' },
    { key: 'gender', header: '성별' },
    { key: 'birth', header: '생년월일' },
    { key: 'email', header: '이메일' },
    { key: 'phone', header: '전화번호' },
    { key: 'createdAt', header: '회원가입 일시' },
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
          {data.map((row, rowIndex) => {
            const isExpanded = expandedRow === rowIndex;
            return [
              <tr
                key={`main-${row.id}`}
                className={styles.row}
                onClick={() => handleRowClick(rowIndex)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>,
              isExpanded && (
                <tr key={`detail-${row.id}`} className={styles.detailRow}>
                  <td colSpan={columns.length}>
                    <div className={styles.detailBox}>
                      {Object.entries(row).map(([key, value]) => (
                        <div key={key} className={styles.detailItem}>
                          <div className={styles.detailLabel}>
                            {fieldLabelMap[key] || key}
                          </div>
                          <div className={styles.detailValue}>
                            {key === 'isActive'
                              ? isActiveMap[String(value)]
                              : value ?? '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ),
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RoleUserTable;
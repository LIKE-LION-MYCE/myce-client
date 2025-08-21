import { useState } from 'react';
import styles from './RoleUserTable.module.css';

const fieldLabelMap = {
  id: 'ID',
  loginId: '아이디',
  name: '회원이름',
  gender: '성별',
  birth: '생년월일',
  email: '이메일',
  phone: '전화번호',
  createdAt: '회원가입 일시',
  mileage: '보유 마일리지',
  isActive: '활성화 여부',
  role: '권한',
  gradeDescription: '회원 등급',
  delete: '활성화 여부',
};

const getFormattedValue = (key, value) => {
  const roleMap = {
    USER: '사용자',
    EXPO_ADMIN: '박람회 관리자',
    PLATFORM_ADMIN: '플랫폼 관리자',
  };

  const genderMap = {
    MALE: '남자',
    FEMALE: '여자',
    '': '-',
    null: '-',
  };

  const isDeleteMap = {
    true: '활성',
    false: '비활성',
  };

  if (key === 'gender') {
    return genderMap[value] || value;
  }
  if (key === 'role') {
    return roleMap[value] || value;
  }
  if (key === 'delete') {
    return isDeleteMap[String(!value)] || value; // delete(true) → 비활성
  }
  if (key === 'isActive') {
    return value ? '활성' : '비활성';
  }
  if (key === 'createdAt') {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${year}.${month}.${day}. ${ampm} ${hours}:${minutes}:${seconds}`;
  }

  return value ?? '-';
};

function RoleUserTable({ data }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'loginId', header: '아이디' },
    { key: 'name', header: '회원이름' },
    { key: 'gender', header: '성별' },
    { key: 'birth', header: '생년월일' },
    { key: 'email', header: '이메일' },
    { key: 'phone', header: '전화번호' },
    { key: 'createdAt', header: '회원가입 일시' },
    { key: 'delete', header: '활성화 여부' },
  ];

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // delete 필드 → 활성/비활성 배지 렌더링
  const renderStatusBadge = (fromKey, rawValue) => {
    const isActive = fromKey === 'delete' ? !rawValue : !!rawValue;
    const label = getFormattedValue(fromKey, rawValue);
    return (
      <span
        className={`${styles.badge} ${
          isActive ? styles.badgeActive : styles.badgeInactive
        }`}
      >
        {label}
      </span>
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
          {data?.map((row, rowIndex) => {
            const isExpanded = expandedRow === rowIndex;
            return [
              <tr
                key={`main-${row.id}`}
                className={styles.row}
                onClick={() => handleRowClick(rowIndex)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.key === 'delete'
                      ? renderStatusBadge('delete', row[col.key])
                      : getFormattedValue(col.key, row[col.key])}
                  </td>
                ))}
              </tr>,
              isExpanded && (
                <tr key={`detail-${row.id}`} className={styles.detailRow}>
                  <td colSpan={columns.length}>
                    <div className={styles.detailBox}>
                      {Object.entries(row).map(([key, value]) => {
                        if (key === 'gradeImageUrl') return null;

                        const label = fieldLabelMap[key] || key;
                        const isStatusKey =
                          key === 'delete' || key === 'isActive';

                        return (
                          <div key={key} className={styles.detailItem}>
                            <div className={styles.detailLabel}>{label}</div>
                            <div className={styles.detailValue}>
                              {isStatusKey ? (
                                renderStatusBadge(key, value)
                              ) : (
                                getFormattedValue(key, value)
                              )}
                            </div>
                          </div>
                        );
                      })}
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
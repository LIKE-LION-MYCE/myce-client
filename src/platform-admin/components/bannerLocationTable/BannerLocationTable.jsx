import { useNavigate } from 'react-router-dom';
import styles from './BannerLocationTable.module.css';

function BannerLocationTable({ data = [] }) {
  const navigate = useNavigate();

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: '배너명' },
    { key: 'createdAt', header: '생성일' },
    { key: 'updatedAt', header: '수정일자' },
    { key: 'active', header: '상태' },
    { key: 'action', header: '상세보기' },
  ];

  const goToDetail = (row) => {
    navigate(`/platform/admin/adPosition/${row.id}`, {
      state: {
        expoStatus: row.status,
        expoId: row.id,
      },
    });
  };

  const formatDate = (v) => (v ? String(v).substring(0, 10) : '-');

  const renderCell = (colKey, row) => {
    if (colKey === 'action') {
      return (
        <button className={styles.detailBtn} onClick={() => goToDetail(row)}>
          상세보기
        </button>
      );
    }
    if (colKey === 'createdAt' || colKey === 'updatedAt') {
      return formatDate(row[colKey]);
    }
    if (colKey === 'active') {
      const isActive = row[colKey] === true;
      return (
        <span
          className={`${styles.badge} ${
            isActive ? styles.badgeActive : styles.badgeInactive
          }`}
        >
          {isActive ? '활성' : '비활성'}
        </span>
      );
    }
    return row[colKey] ?? '-';
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
            <tr key={row.id ?? rowIndex} className={styles.row}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {renderCell(col.key, row)}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BannerLocationTable;
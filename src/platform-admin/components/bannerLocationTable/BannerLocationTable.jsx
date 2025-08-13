import { useNavigate } from 'react-router-dom';
import styles from './BannerLocationTable.module.css';


function BannerLocationTable({ data }) {
  const navigate = useNavigate();

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: '배너명' },
    { key: 'createdAt', header: '생성일' },
    { key: 'updatedAt', header: '수정일자' },
    { key: 'status', header: '상태' },
    { key: 'action', header: '상세보기' },
  ];

  // 상세 페이지로 이동하면서 status도 함께 전달
  const goToDetail = (row) => {
    navigate(`/platform/admin/adPosition/${row.id}`, {
      state: {
        expoStatus: row.status, // 예: '활성'
        expoId: row.id
      },
    });
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
            <tr key={rowIndex} className={styles.row}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.key === 'action' ? (
                    <button
                      className={styles.detailBtn}
                      onClick={() => goToDetail(row)}
                    >
                      상세보기
                    </button>
                  ) : (
                    (col.key === 'createdAt' || col.key === 'updatedAt') ? (
                      row[col.key] ? row[col.key].substring(0, 10) : '-'
                    ) : (
                      row[col.key] || '-'
                    )
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BannerLocationTable;

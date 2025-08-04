import { useNavigate } from 'react-router-dom';
import styles from './CurrentBannerTable.module.css';

const statusMap = {
  PENDING: '취소 대기',
  POSTING: '게시중',
};

function CurrentBannerTable({ data }) {
  const navigate = useNavigate();

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'username', header: '아이디' },
    { key: 'name', header: '신청자' },
    { key: 'bannerName', header: '배너명' },
    { key: 'bannerType', header: '배너 타입' },
    { key: 'email', header: '이메일' },
    { key: 'phone', header: '전화번호' },
    { key: 'createdAt', header: '신청일자' },
    { key: 'status', header: '상태' },
    { key: 'action', header: '상세보기' },
  ];

  const goToDetail = (row) => {
    navigate(`/platform/admin/bannerCurrent/${row.id}`, {
      state: {
        bannerStatus: row.status,
        bannerId: row.id,
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
                  {col.key === 'status' ? (
                    statusMap[row[col.key]] || row[col.key]
                  ) : col.key === 'action' ? (
                    <button className={styles.detailBtn} onClick={() => goToDetail(row)}>
                      상세보기
                    </button>
                  ) : (
                    row[col.key] || '-'
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

export default CurrentBannerTable;
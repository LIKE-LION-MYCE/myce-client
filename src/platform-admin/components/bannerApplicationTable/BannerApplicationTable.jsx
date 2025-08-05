import { useNavigate } from 'react-router-dom';
import styles from './BannerApplicationTable.module.css';

// 상태값 매핑: 화면에 보여줄 한글 (게시 대기, 게시중 제외)
const statusMap = {
  PENDING_APPROVAL: '승인 대기',
  WAITING_PAYMENT: '결제 대기',
  ENDED: '게시 종료',
  REJECTED: '승인 거절'
};

function BannerApplicationTable({ data }) {
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
    navigate(`/platform/admin/bannerApplications/${row.id}`, {
      state: {
        expoStatus: row.status,
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
                  {col.key === 'status' ? (
                    statusMap[row[col.key]] || row[col.key]
                  ) : col.key === 'action' ? (
                    <button
                      className={styles.detailBtn}
                      onClick={() => goToDetail(row)}
                    >
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

export default BannerApplicationTable;
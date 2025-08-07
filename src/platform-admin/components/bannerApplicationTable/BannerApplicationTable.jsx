import { useNavigate } from 'react-router-dom';
import styles from './BannerApplicationTable.module.css';

// 상태값 매핑: 화면에 보여줄 한글
const statusMap = {
  PENDING_APPROVAL: '승인 대기',
  PENDING_PAYMENT: '결제 대기',
  COMPLETED: '게시 종료',
  REJECTED: '승인 거절',
};

function BannerApplicationTable({ data }) {
  const navigate = useNavigate();

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'memberUsername', header: '아이디' },
    { key: 'memberNickname', header: '신청자' },
    { key: 'title', header: '배너명' },
    { key: 'bannerLocationName', header: '배너 위치' },
    { key: 'memberEmail', header: '이메일' },
    { key: 'memberPhone', header: '전화번호' },
    { key: 'createdAt', header: '신청일자' },
    { key: 'statusMessage', header: '상태' },
    { key: 'action', header: '상세보기' },
  ];

  const goToDetail = (row) => {
    navigate(`/platform/admin/bannerApplications/${row.id}`, {
      state: {
        expoStatus: row.statusMessage,
        expoId: row.id,
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
                  {col.key === 'statusMessage' ? (
                    statusMap[row[col.key]] || row[col.key]
                  ) : col.key === 'action' ? (
                    <button
                      className={styles.detailBtn}
                      onClick={() => goToDetail(row)}
                    >
                      상세보기
                    </button>
                  ) : col.key === 'createdAt' ? (
                    row[col.key]?.split('T')[0] || '-'
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

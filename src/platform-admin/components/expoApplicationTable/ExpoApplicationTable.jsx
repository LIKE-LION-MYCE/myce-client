import { useNavigate } from 'react-router-dom';
import styles from './ExpoApplicationTable.module.css';

// 상태값 매핑: 화면에 보여줄 한글
const statusMap = {
  PENDING: '승인 대기',
  APPROVED: '승인 완료',
  REJECTED: '승인 거절',
  CANCELED: '취소 완료',
  SETTLE_PENDING: '정산 대기',
  SETTLED: '정산 완료'
};

function ExpoApplicationTable({ data }) {
  const navigate = useNavigate();

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'username', header: '아이디' },
    { key: 'name', header: '신청자' },
    { key: 'expoName', header: '박람회명' },
    { key: 'email', header: '이메일' },
    { key: 'phone', header: '전화번호' },
    { key: 'createdAt', header: '신청일자' },
    { key: 'status', header: '상태' },
    { key: 'action', header: '상세보기' },
  ];

  // 상세 페이지로 이동하면서 status도 함께 전달
  const goToDetail = (row) => {
    navigate(`/platform/admin/expoApplications/${row.id}`, {
      state: {
        expoStatus: row.status, // 예: 'APPROVED'
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

export default ExpoApplicationTable;
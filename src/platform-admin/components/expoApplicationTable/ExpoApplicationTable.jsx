import { useNavigate } from 'react-router-dom';
import styles from './ExpoApplicationTable.module.css';

const statusMap = {
  PENDING_APPROVAL: '승인 대기',
  WAITING_PAYMENT: '결제 대기',
  APPROVED: '승인 완료',
  REJECTED: '반려됨',
  CANCELED: '취소됨',
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
    { key: 'action', header: '상세보기' }
  ];

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
                  {col.key === 'status'
                    ? statusMap[row[col.key]] || row[col.key]
                    : col.key === 'action' ? (
                        <button
                          className={styles.detailBtn}
                          onClick={() => navigate(`/platform/admin/expoApplications/${row.id}`)}
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
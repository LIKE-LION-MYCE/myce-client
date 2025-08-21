import { useNavigate } from 'react-router-dom';
import styles from './ExpoApplicationTable.module.css';

// statusMessage는 백엔드에서 한글로 변환되어 옴

function ExpoApplicationTable({ data }) {
  const navigate = useNavigate();

  // 상태별 CSS 클래스 매핑 (상세 페이지와 동일한 색상)
  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return styles.pendingApproval; // 승인_대기 - 주황색
      case 'REJECTED':
        return styles.rejected; // 승인_거절 - 빨간색
      case 'PENDING_PAYMENT':
        return styles.pendingPayment; // 결제_대기 - 녹색
      default:
        return styles.defaultStatus;
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'memberUsername', header: '아이디' },
    { key: 'memberName', header: '신청자' },
    { key: 'title', header: '박람회명' },
    { key: 'memberEmail', header: '이메일' },
    { key: 'memberPhone', header: '전화번호' },
    { key: 'createdAt', header: '신청일자' },
    { key: 'statusMessage', header: '상태' },
    { key: 'action', header: '상세보기' },
  ];

  // 상세 페이지로 이동하면서 status도 함께 전달
  const goToDetail = (row) => {
    navigate(`/platform/admin/expoApplications/${row.id}`, {
      state: {
        expoStatus: row.statusMessage, // 예: '승인 대기'
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
                  {col.key === 'statusMessage' ? (
                    <span className={`${styles.statusBadge} ${getStatusClass(row.status)}`}>
                      {row[col.key]}
                    </span>
                  ) : col.key === 'action' ? (
                    <button
                      className={styles.detailBtn}
                      onClick={() => goToDetail(row)}
                    >
                      상세보기
                    </button>
                  ) : col.key === 'createdAt' ? (
                    new Date(row[col.key]).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit', 
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
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
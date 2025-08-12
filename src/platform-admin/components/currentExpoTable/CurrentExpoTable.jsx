import { useNavigate } from 'react-router-dom';
import styles from './CurrentExpoTable.module.css';

// 상태값 매핑: 화면에 보여줄 한글
const statusMap = {
  PUBLISHED: '게시 중',
  PENDING_CANCEL: '취소 대기'
};

function CurrentExpoTable({ data }) {
  const navigate = useNavigate();

  // 상태별 CSS 클래스 매핑 (상세 페이지와 동일한 색상)
  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING_PUBLISH':
        return styles.pendingPublish; // 게시 대기
      case 'PUBLISHED':
        return styles.published; // 게시중 - 녹색
      case 'PENDING_CANCEL':
        return styles.pendingCancel; // 취소_대기 - 주황색
      case 'PUBLISH_ENDED':
        return styles.publishEnded; // 게시_종료 - 회색
      case 'SETTLEMENT_REQUESTED':
        return styles.settlementRequested; // 정산_요청 - 하늘색
      case 'COMPLETED':
        return styles.completed; // 종료됨 - 회색
      case 'CANCELLED':
        return styles.cancelled; // 취소_완료 - 빨간색
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
    navigate(`/platform/admin/expoCurrent/${row.id}`, {
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
                  {col.key === 'statusMessage' ? (
                    <span className={`${styles.statusBadge} ${getStatusClass(row.status)}`}>
                      {row[col.key] || '-'}
                    </span>
                  ) : col.key === 'createdAt' ? (
                    row[col.key] ? new Date(row[col.key]).toLocaleDateString() : '-'
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

export default CurrentExpoTable;
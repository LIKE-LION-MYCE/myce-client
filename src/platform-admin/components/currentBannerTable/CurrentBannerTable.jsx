import { useNavigate } from 'react-router-dom';
import styles from './CurrentBannerTable.module.css';

const statusMap = {
  PENDING_PUBLISH: '게시 대기',
  PUBLISHED: '게시중',
  PENDING_CANCEL: '취소 대기',
  CANCELLED: '취소됨',
  COMPLETED: '게시 종료',
};

function CurrentBannerTable({ data }) {
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
    navigate(`/platform/admin/bannerCurrent/${row.id}`, {
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
              {columns.map((col) => {
                // 상태(statusMessage) 열에 뱃지 스타일 적용
                if (col.key === 'statusMessage') {
                  // statusMap에 매핑된 한글 상태명 가져오기
                  const statusKorean = statusMap[row[col.key]] || row[col.key];
                  const statusClass = statusKorean.replace(/\s/g, '_');
                  const badgeClassName = `${styles.statusBadge} ${styles[`status_${statusClass}`]}`;
                  
                  return (
                    <td key={col.key} className={styles.td}>
                      <span className={badgeClassName}>
                        {statusKorean}
                      </span>
                    </td>
                  );
                }
                
                // 상세보기 버튼
                if (col.key === 'action') {
                  return (
                    <td key={col.key} className={styles.td}>
                      <button
                        className={styles.detailBtn}
                        onClick={() => goToDetail(row)}
                      >
                        상세보기
                      </button>
                    </td>
                  );
                }

                // 신청일자 포맷 변경
                if (col.key === 'createdAt') {
                  return (
                    <td key={col.key} className={styles.td}>
                      {row[col.key]?.split('T')[0] || '-'}
                    </td>
                  );
                }

                // 그 외 열
                return (
                  <td key={col.key} className={styles.td}>
                    {row[col.key] || '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrentBannerTable;
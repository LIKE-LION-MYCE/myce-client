import styles from './BoothTable.module.css';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';

const DEFAULT_IMAGE = 'https://via.placeholder.com/240x180?text=No+Image';

function BoothTable({ data = [], onDelete, onRowClick, showToast }) {
  const columns = [
    { header: 'No', key: 'no' },
    { header: '부스명', key: 'name' },
    { header: '부스 위치', key: 'boothNumber' },
    { header: '노출 순위', key: 'displayRank' },
    { header: '담당자 연락처', key: 'contactPhone' },
    { header: '담당자 이메일', key: 'contactEmail' },
  ];

  const handleDeleteClick = (e, no) => {
    e.stopPropagation(); // 행 클릭 이벤트 전파 방지
    onDelete(no);
  };

  return (
    <div className={styles.tableWrapper}>
      {showToast && <ToastSuccess />}

      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.header}
              </th>
            ))}
            <th className={styles.th}>관리</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={`row-${row.no}`}
              className={styles.row}
              onClick={() => onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.key === 'displayRank'
                    ? row[col.key] === null
                      ? ''
                      : row[col.key]
                    : row[col.key]}
                </td>
              ))}
              <td className={styles.td}>
                <div className={styles.buttonGroupInline}>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => handleDeleteClick(e, row.no)}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BoothTable;


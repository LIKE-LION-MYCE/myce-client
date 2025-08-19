import styles from './DashboardTable.module.css';

function DashboardTable({ columns, data, summaryRow }) {
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
          {data.map((row, idx) => (
            <tr key={idx} className={styles.row}>
              {columns.map((col) => (
                <td key={col.key} className={`${styles.td} ${col.key === 'ticketType' ? styles.leftAlign : ''}`}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {summaryRow && (
          <tfoot>
            <tr className={styles.summaryRow}>
              {columns.map((col) => (
                <td key={col.key} className={`${styles.tfootTd} ${col.key === 'ticketType' ? styles.leftAlign : ''}`}>
                  <strong>{summaryRow[col.key] || ''}</strong>
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default DashboardTable;

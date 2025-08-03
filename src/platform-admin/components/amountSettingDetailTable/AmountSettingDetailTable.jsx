import styles from './AmountSettingDetailTable.module.css';

function AmountSettingDetailTable({ columns, data }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((col, idx) => (
              <th key={idx} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.row}>
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`${styles.td} ${
                    col.groupStart ? styles.groupStart : ''
                  } ${col.code ? styles.codeCell : ''}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AmountSettingDetailTable;

import { useState } from 'react';
import styles from './EventTable.module.css';

const fieldLabelMap = {
  eventName: '행사 이름',
  eventLocation: '행사 위치',
  eventDate: '행사 날짜',
  eventTimeStart: '시작 시간',
  eventTimeEnd: '종료 시간',
  eventDescription: '행사 소개',
  managerName: '담당자명',
  managerPhone: '담당자 전화번호',
  managerEmail: '담당자 이메일',
};

const eventFields = [
  'eventName',
  'eventLocation',
  'eventDate',
  'eventTimeStart',
  'eventTimeEnd',
  'eventDescription',
];

const managerFields = [
  'managerName',
  'managerPhone',
  'managerEmail',
];

function EventTable({ data = [], onUpdate, onDelete }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const handleRowClick = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      setEditForm(null);
    } else {
      setExpandedRow(index);
      setEditForm(data[index]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(editForm);
    setExpandedRow(null);
    setEditForm(null);
  };

  const handleCancel = () => {
    setExpandedRow(null);
    setEditForm(null);
  };

  const columns = [
    { header: '행사 이름', key: 'eventName' },
    { header: '행사 위치', key: 'eventLocation' },
    { header: '행사 날짜', key: 'eventDate' },
    { header: '시작 시간', key: 'eventTimeStart' },
    { header: '종료 시간', key: 'eventTimeEnd' },
    { header: '담당자명', key: 'managerName' },
    { header: '전화번호', key: 'managerPhone' },
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
            <th className={styles.th}>관리</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const isExpanded = expandedRow === rowIndex;

            return (
              <>
                <tr
                  key={`row-${row.id}`}
                  className={styles.row}
                  onClick={() => handleRowClick(rowIndex)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      {row[col.key]}
                    </td>
                  ))}
                  <td className={styles.td}>
                    <div className={styles.buttonGroupInline}>
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row.id);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>

                {isExpanded && editForm && (
                  <tr key={`detail-${row.id}`} className={styles.detailRow}>
                    <td colSpan={columns.length + 1}>
                      <div className={styles.detailBox}>
                        <div className={styles.detailGrid}>
                          {/* 왼쪽: 행사 정보 */}
                          <div className={styles.column}>
                            {eventFields.map((key) => {
                              if (key === 'eventTimeStart') return null;
                              if (key === 'eventTimeEnd') {
                                return (
                                  <div key="eventTimeGroup" className={styles.detailItem}>
                                    <div className={styles.detailLabel}>행사 시간</div>
                                    <div className={styles.timeGroup}>
                                      <input
                                        type="time"
                                        name="eventTimeStart"
                                        value={editForm.eventTimeStart || ''}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                      />
                                      <span className={styles.tilde}>~</span>
                                      <input
                                        type="time"
                                        name="eventTimeEnd"
                                        value={editForm.eventTimeEnd || ''}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                      />
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div key={key} className={styles.detailItem}>
                                  <div className={styles.detailLabel}>
                                    {fieldLabelMap[key]}
                                  </div>
                                  <input
                                    type={key === 'eventDate' ? 'date' : 'text'}
                                    name={key}
                                    value={editForm[key] || ''}
                                    onChange={handleChange}
                                    className={styles.inputField}
                                  />
                                </div>
                              );
                            })}
                          </div>

                          {/* 오른쪽: 담당자 정보 */}
                          <div className={styles.column}>
                            {managerFields.map((key) => (
                              <div key={key} className={styles.detailItem}>
                                <div className={styles.detailLabel}>
                                  {fieldLabelMap[key]}
                                </div>
                                <input
                                  name={key}
                                  value={editForm[key] || ''}
                                  onChange={handleChange}
                                  className={styles.inputField}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={styles.buttonGroupBottom}>
                          <button className={styles.editBtn} onClick={handleSave}>
                            저장
                          </button>
                          <button className={styles.cancelBtn} onClick={handleCancel}>
                            취소
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EventTable;

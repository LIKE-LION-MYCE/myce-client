import React from 'react';
import { useState } from 'react';
import styles from './EventTable.module.css';

const fieldLabelMap = {
  name: '행사 이름',
  location: '행사 위치',
  eventDate: '행사 날짜',
  startTime: '시작 시간',
  endTime: '종료 시간',
  description: '행사 소개',
  contactName: '담당자명',
  contactPhone: '담당자 전화번호',
  contactEmail: '담당자 이메일',
};

const eventFields = [
  'name',
  'location',
  'eventDate',
  'startTime',
  'endTime',
  'description',
];

const managerFields = [
  'contactName',
  'contactPhone',
  'contactEmail',
];

function EventTable({ data = [], onUpdate, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const handleRowClick = (row) => {
    if (expandedId === row.id) {
      setExpandedId(null);
      setEditForm(null);
    } else {
      setExpandedId(row.id);
      setEditForm(row);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(editForm);
    // 부모에서 토스트 관리하므로 여기서는 토스트 띄우지 않음
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    onDelete(id);
    setExpandedId(null);
    setEditForm(null);
    // 삭제 시에는 toast 띄우지 않음
  };

  const handleCancel = () => {
    setExpandedId(null);
    setEditForm(null);
  };

  const columns = [
    { header: '행사 이름', key: 'name' },
    { header: '행사 위치', key: 'location' },
    { header: '행사 날짜', key: 'eventDate' },
    { header: '시작 시간', key: 'startTime' },
    { header: '종료 시간', key: 'endTime' },
    { header: '담당자명', key: 'contactName' },
    { header: '전화번호', key: 'contactPhone' },
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
          {data.map((row) => {
            const isExpanded = expandedId === row.id;

            return (
              <React.Fragment key={row.id}>
                <tr
                  className={styles.row}
                  onClick={() => handleRowClick(row)}
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
                        onClick={(e) => handleDeleteClick(e, row.id)}
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
                          {/* 행사 정보 */}
                          <div className={styles.column}>
                            {eventFields.map((key) => {
                              if (key === 'startTime') return null;
                              if (key === 'endTime') {
                                return (
                                  <div key="eventTimeGroup" className={styles.detailItem}>
                                    <div className={styles.detailLabel}>행사 시간</div>
                                    <div className={styles.timeGroup}>
                                      <input
                                        type="time"
                                        name="startTime"
                                        value={editForm.startTime || ''}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                      />
                                      <span className={styles.tilde}>~</span>
                                      <input
                                        type="time"
                                        name="endTime"
                                        value={editForm.endTime || ''}
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

                          {/* 담당자 정보 */}
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
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EventTable;
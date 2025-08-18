import React, { useState } from 'react';
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

const eventFields = ['name', 'location', 'eventDate', 'startTime', 'endTime', 'description'];
const managerFields = ['contactName', 'contactPhone', 'contactEmail'];

function EventTable({ data = [], onUpdate, onDelete, expoStartDate, expoEndDate, hasPermission = true }) {
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const handleRowClick = (row) => {
    if (expandedId === row.id) {
      setExpandedId(null);
      setEditingId(null);
      setEditForm(null);
    } else {
      setExpandedId(row.id);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleEditClick = (e, row) => {
    e.stopPropagation();
    setEditingId(row.id);
    setEditForm(row);
  };

  const handleChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onUpdate(editForm);
    setEditingId(null);
    setEditForm(null);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    onDelete(id);
    setExpandedId(null);
    setEditForm(null);
    setEditingId(null);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditingId(null);
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
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isExpanded = expandedId === row.id;

            return (
              <React.Fragment key={row.id}>
                <tr className={styles.row} onClick={() => handleRowClick(row)}>
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      {row[col.key]}
                    </td>
                  ))}
                </tr>

                {isExpanded && (
                  <tr className={styles.detailRow} onClick={(e) => e.stopPropagation()}>
                    <td colSpan={columns.length}>
                      <div className={styles.detailBox}>
                        {editingId === row.id && editForm ? (
                          <>
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
                                      <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>
                                      <input
                                        type={key === 'eventDate' ? 'date' : 'text'}
                                        name={key}
                                        value={editForm[key] || ''}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                        min={
                                          key === 'eventDate' && expoStartDate
                                            ? expoStartDate.split('T')[0]
                                            : undefined
                                        }
                                        max={
                                          key === 'eventDate' && expoEndDate
                                            ? expoEndDate.split('T')[0]
                                            : undefined
                                        }
                                      />
                                    </div>
                                  );
                                })}
                              </div>

                              {/* 담당자 정보 */}
                              <div className={styles.column}>
                                {managerFields.map((key) => (
                                  <div key={key} className={styles.detailItem}>
                                    <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>
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

                            <div className={styles.buttonDivider} />
                            <div className={styles.buttonGroupBottom}>
                              <button className={styles.editBtn} onClick={handleSave}>
                                저장
                              </button>
                              <button className={styles.cancelBtn} onClick={handleCancel}>
                                취소
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.detailGrid}>
                              <div className={styles.column}>
                                {eventFields.map((key) => {
                                  if (key === 'startTime') return null;
                                  if (key === 'endTime') {
                                    return (
                                      <div key="eventTimeGroup" className={styles.detailItem}>
                                        <div className={styles.detailLabel}>행사 시간</div>
                                        <div className={styles.valueText}>
                                          {row.startTime && row.endTime
                                            ? `${row.startTime} ~ ${row.endTime}`
                                            : '-'}
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div key={key} className={styles.detailItem}>
                                      <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>
                                      <div className={styles.valueText}>{row[key] || '-'}</div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className={styles.column}>
                                {managerFields.map((key) => (
                                  <div key={key} className={styles.detailItem}>
                                    <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>
                                    <div className={styles.valueText}>{row[key] || '-'}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className={styles.buttonDivider} />
                            <div className={styles.buttonGroupBottom}>
                              {hasPermission && onUpdate && (
                                <button className={styles.editBtn} onClick={(e) => handleEditClick(e, row)}>
                                  수정
                                </button>
                              )}
                              {hasPermission && onDelete && (
                                <button
                                  className={styles.deleteBtn}
                                  onClick={(e) => handleDeleteClick(e, row.id)}
                                >
                                  삭제
                                </button>
                              )}
                            </div>
                          </>
                        )}
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
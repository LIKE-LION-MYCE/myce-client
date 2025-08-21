// EventTable.jsx
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
  const [errors, setErrors] = useState({});

  const handleRowClick = (row) => {
    if (expandedId === row.id) {
      setExpandedId(null);
      setEditingId(null);
      setEditForm(null);
      setErrors({});
    } else {
      setExpandedId(row.id);
      setEditingId(null);
      setEditForm(null);
      setErrors({});
    }
  };

  const handleEditClick = (e, row) => {
    e.stopPropagation();
    setEditingId(row.id);
    setEditForm(row);
    setErrors({});
  };

  const formatPhoneNumber = (value) => {
    const onlyNums = String(value || '').replace(/[^0-9]/g, '');
    if (onlyNums.startsWith('02')) {
      if (onlyNums.length <= 2) return onlyNums;
      if (onlyNums.length <= 5) return onlyNums.replace(/(\d{2})(\d{1,3})/, '$1-$2');
      if (onlyNums.length <= 9) return onlyNums.replace(/(\d{2})(\d{3})(\d{1,4})/, '$1-$2-$3');
      return onlyNums.replace(/(\d{2})(\d{4})(\d{4}).*/, '$1-$2-$3');
    }
    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 6) return onlyNums.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    if (onlyNums.length <= 10) return onlyNums.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
    return onlyNums.replace(/(\d{3})(\d{4})(\d{4}).*/, '$1-$2-$3');
  };

  const handleChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'contactPhone' ? formatPhoneNumber(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const runValidation = () => {
    const e = {};
    const f = editForm || {};
    const isBlank = (v) => !v || String(v).trim() === '';

    if (isBlank(f.name)) e.name = '행사명을 입력해주세요.';
    if (isBlank(f.location)) e.location = '장소를 입력해주세요.';
    if (isBlank(f.description)) e.description = '행사 설명을 입력해주세요.';
    if (isBlank(f.contactName)) e.contactName = '담당자 이름을 입력해주세요.';
    if (isBlank(f.contactPhone)) e.contactPhone = '담당자 연락처를 입력해주세요.';
    if (isBlank(f.contactEmail)) e.contactEmail = '담당자 이메일을 입력해주세요.';

    if (isBlank(f.eventDate)) e.eventDate = '행사 날짜를 입력해주세요.';
    if (isBlank(f.startTime)) e.startTime = '시작 시간을 입력해주세요.';
    if (isBlank(f.endTime)) e.endTime = '종료 시간을 입력해주세요.';

    if (!e.contactPhone && !/^[0-9-]+$/.test(f.contactPhone || '')) {
      e.contactPhone = '올바른 전화번호 형식을 입력하세요. (숫자와 하이픈만 허용)';
    }
    if (!e.contactEmail) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(f.contactEmail || '')) {
        e.contactEmail = '이메일 형식이 올바르지 않습니다.';
      }
    }
    if (!e.startTime && !e.endTime && f.startTime && f.endTime) {
      const [sh, sm] = f.startTime.split(':').map(Number);
      const [eh, em] = f.endTime.split(':').map(Number);
      if (!(sh * 60 + sm < eh * 60 + em)) {
        e.endTime = '시작시간은 종료시간보다 빨라야 합니다.';
      }
    }
    const expoStart = expoStartDate ? expoStartDate.split('T')[0] : null;
    const expoEnd = expoEndDate ? expoEndDate.split('T')[0] : null;
    if (!e.eventDate && f.eventDate && (expoStart || expoEnd)) {
      if (expoStart && f.eventDate < expoStart) {
        e.eventDate = '행사 날짜는 박람회 시작일과 같거나 이후여야 합니다.';
      }
      if (expoEnd && f.eventDate > expoEnd) {
        e.eventDate = '행사 날짜는 박람회 종료일과 같거나 이전이어야 합니다.';
      }
    }

    return e;
  };

  const handleSave = (e) => {
    e.stopPropagation();
    const v = runValidation();
    setErrors(v);
    if (Object.values(v).some(Boolean)) return;
    onUpdate?.(editForm);
    setEditingId(null);
    setEditForm(null);
    setErrors({});
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    onDelete?.(id);
    setExpandedId(null);
    setEditForm(null);
    setEditingId(null);
    setErrors({});
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEditForm(null);
    setErrors({});
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
                                            aria-invalid={!!errors.startTime}
                                            step="1800"
                                            title="정각(00분) 또는 30분만 선택 가능합니다"
                                          />
                                          <span className={styles.tilde}>~</span>
                                          <input
                                            type="time"
                                            name="endTime"
                                            value={editForm.endTime || ''}
                                            onChange={handleChange}
                                            className={styles.inputField}
                                            aria-invalid={!!errors.endTime}
                                          />
                                        </div>
                                        {(errors.startTime || errors.endTime) && (
                                          <p className={styles.errorText}>
                                            {errors.startTime || errors.endTime}
                                          </p>
                                        )}
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
                                        placeholder={
                                          key === 'name'
                                            ? '행사 이름 입력'
                                            : key === 'location'
                                            ? '행사 위치 입력'
                                            : key === 'description'
                                            ? '행사 소개 입력'
                                            : undefined
                                        }
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
                                        aria-invalid={!!errors[key]}
                                      />
                                      {errors[key] && <p className={styles.errorText}>{errors[key]}</p>}
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
                                      aria-invalid={!!errors[key]}
                                      placeholder={
                                        key === 'contactName'
                                          ? '담당자명 입력'
                                          : key === 'contactPhone'
                                          ? '예: 010-1234-5678'
                                          : key === 'contactEmail'
                                          ? '예 : example@company.com'
                                          : undefined
                                      }
                                      inputMode={key === 'contactPhone' ? 'numeric' : undefined}
                                    />
                                    {errors[key] && <p className={styles.errorText}>{errors[key]}</p>}
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
                                <button
                                  className={styles.editBtn}
                                  onClick={(e) => handleEditClick(e, row)}
                                >
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
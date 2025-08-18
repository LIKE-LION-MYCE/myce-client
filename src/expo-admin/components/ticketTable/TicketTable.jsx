// TicketTable.jsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TicketTable.module.css';
import { getMyExpoInfo } from '../../../api/service/expo-admin/setting/ExpoInfoService';

const fieldLabelMap = {
  name: '티켓 이름',
  type: '타입',
  description: '설명',
  price: '가격(원)',
  totalQuantity: '수량',
  saleStartDate: '판매 시작일',
  saleEndDate: '판매 종료일',
  useStartDate: '사용 시작일',
  useEndDate: '사용 종료일',
};

const ticketFieldsLeft = ['name', 'type', 'description'];
const ticketFieldsRightTop = ['price', 'totalQuantity'];
const rightFieldIsNumber = (key) => key === 'price' || key === 'totalQuantity';

function toLocalDateOnly(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}
function isSaleStarted(dateStr) {
  if (!dateStr) return false;
  const start = toLocalDateOnly(dateStr);
  if (!start) return false;
  const today = new Date();
  const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return start.getTime() <= today0.getTime();
}

function TicketTable({ data = [], onUpdate, onDelete }) {
  const { expoId } = useParams();

  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [errors, setErrors] = useState({});
  const refs = {
    name: useRef(null),
    type: useRef(null),
    description: useRef(null),
    price: useRef(null),
    totalQuantity: useRef(null),
    saleStartDate: useRef(null),
    saleEndDate: useRef(null),
    useStartDate: useRef(null),
    useEndDate: useRef(null),
  };

  const [expoLoaded, setExpoLoaded] = useState(false);
  const [displayStartDate, setDisplayStartDate] = useState('');
  const [displayEndDate, setDisplayEndDate] = useState('');
  const [expoStartDate, setExpoStartDate] = useState('');
  const [expoEndDate, setExpoEndDate] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!expoId) {
        setExpoLoaded(true);
        return;
      }
      try {
        const expo = await getMyExpoInfo(expoId);
        if (!mounted) return;
        setDisplayStartDate(expo?.displayStartDate?.split('T')[0] || '');
        setDisplayEndDate(expo?.displayEndDate?.split('T')[0] || '');
        setExpoStartDate(expo?.startDate?.split('T')[0] || '');
        setExpoEndDate(expo?.endDate?.split('T')[0] || '');
        setExpoLoaded(true);
      } catch {
        setExpoLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [expoId]);

  const handleRowClick = (row) => {
    if (expandedId === row.ticketId) {
      setExpandedId(null);
      setEditForm(null);
      setIsEditing(false);
      setErrors({});
    } else {
      setExpandedId(row.ticketId);
      setEditForm({ ...row });
      setIsEditing(false);
      setErrors({});
    }
  };

  const clampDate = (v, min, max) => {
    if (!v) return v;
    let nv = v;
    if (min && nv < min) nv = min;
    if (max && nv > max) nv = max;
    return nv;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => {
      let next = { ...prev, [name]: value };

      if (name === 'saleStartDate') {
        const clamped = expoLoaded
          ? clampDate(value, displayStartDate || undefined, displayEndDate || undefined)
          : value;
        next.saleStartDate = clamped;

        if (next.saleEndDate && next.saleEndDate < clamped) next.saleEndDate = clamped;
        if (expoLoaded && displayEndDate && next.saleEndDate && next.saleEndDate > displayEndDate) {
          next.saleEndDate = displayEndDate;
        }
        if (next.useStartDate && next.useStartDate < clamped) next.useStartDate = clamped;
        if (next.useEndDate && next.useEndDate < (next.useStartDate || clamped)) {
          next.useEndDate = next.useStartDate || clamped;
        }
      }

      if (name === 'saleEndDate') {
        const minStart = next.saleStartDate || prev.saleStartDate;
        next.saleEndDate = expoLoaded
          ? clampDate(value, minStart || displayStartDate || undefined, displayEndDate || undefined)
          : value;
      }

      if (name === 'useStartDate') {
        const minBySale = next.saleStartDate || prev.saleStartDate;
        let min = expoStartDate || undefined;
        if (minBySale) min = min ? (minBySale > min ? minBySale : min) : minBySale;
        const clamped = expoLoaded ? clampDate(value, min, expoEndDate || undefined) : value;
        next.useStartDate = clamped;

        if (next.useEndDate && next.useEndDate < clamped) next.useEndDate = clamped;
        if (expoLoaded && expoEndDate && next.useEndDate && next.useEndDate > expoEndDate) {
          next.useEndDate = expoEndDate;
        }
      }

      if (name === 'useEndDate') {
        const minUseStart = next.useStartDate || prev.useStartDate || expoStartDate || undefined;
        next.useEndDate = expoLoaded
          ? clampDate(value, minUseStart, expoEndDate || undefined)
          : value;
      }

      if (name === 'saleStartDate' && next.saleEndDate && next.saleEndDate < next.saleStartDate) {
        next.saleEndDate = next.saleStartDate;
      }
      if (name === 'useStartDate' && next.useEndDate && next.useEndDate < next.useStartDate) {
        next.useEndDate = next.useStartDate;
      }

      return next;
    });

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const minUseStart = useMemo(() => {
    if (!editForm) return undefined;
    const cands = [];
    if (expoStartDate) cands.push(expoStartDate);
    if (editForm.saleStartDate) cands.push(editForm.saleStartDate);
    if (!cands.length) return undefined;
    return cands.sort()[cands.length - 1];
  }, [expoStartDate, editForm]);

  const isBlank = (s) => !s || String(s).trim() === '';

  // ✅ 모든 필드를 독립적으로 검사해 한 번에 에러 노출
  const runValidation = () => {
    const e = {};
    const f = editForm || {};

    // 기본 정보
    if (isBlank(f.name)) e.name = '티켓 이름은 필수입니다.';
    else if (f.name.length > 100) e.name = '티켓 이름은 100자 이하여야 합니다.';

    if (isBlank(f.type)) e.type = '티켓 타입은 필수입니다.';

    if (isBlank(f.description)) e.description = '티켓 설명은 필수입니다.';

    // 숫자 필드
    if (f.price === '' || f.price === null || typeof f.price === 'undefined')
      e.price = '티켓 가격은 필수입니다.';
    else if (isNaN(Number(f.price))) e.price = '가격은 숫자여야 합니다.';
    else if (Number(f.price) < 0) e.price = '가격은 0원 이상이어야 합니다.';

    if (f.totalQuantity === '' || f.totalQuantity === null || typeof f.totalQuantity === 'undefined')
      e.totalQuantity = '티켓 수량은 필수입니다.';
    else if (isNaN(Number(f.totalQuantity))) e.totalQuantity = '티켓 수량은 숫자여야 합니다.';
    else if (Number(f.totalQuantity) < 1) e.totalQuantity = '티켓 수량은 1장 이상이어야 합니다.';

    // 판매 기간: 개별 필수
    if (isBlank(f.saleStartDate)) e.saleStartDate = '판매 시작일은 필수입니다.';
    if (isBlank(f.saleEndDate)) e.saleEndDate = '판매 종료일은 필수입니다.';

    // 판매 기간: 상호 제약 (둘 다 있을 때만 비교)
    if (!e.saleStartDate && !e.saleEndDate && f.saleStartDate && f.saleEndDate) {
      if (f.saleEndDate < f.saleStartDate)
        e.saleEndDate = '판매 종료일은 시작일과 같거나 이후여야 합니다.';
      if (displayStartDate && f.saleStartDate < displayStartDate)
        e.saleStartDate = '판매 시작일은 게시 시작일과 같거나 이후여야 합니다.';
      if (displayEndDate && f.saleStartDate > displayEndDate)
        e.saleStartDate = '판매 시작일은 게시 종료일과 같거나 이전이어야 합니다.';
      if (displayEndDate && f.saleEndDate > displayEndDate)
        e.saleEndDate = '판매 종료일은 게시 종료일과 같거나 이전이어야 합니다.';
    }

    // 사용 기간: 개별 필수
    if (isBlank(f.useStartDate)) e.useStartDate = '사용 시작일은 필수입니다.';
    if (isBlank(f.useEndDate)) e.useEndDate = '사용 종료일은 필수입니다.';

    // 사용 기간: 상호/제약 (둘 다 있을 때만 비교)
    if (!e.useStartDate && !e.useEndDate && f.useStartDate && f.useEndDate) {
      if (f.useEndDate < f.useStartDate)
        e.useEndDate = '사용 종료일은 시작일과 같거나 이후여야 합니다.';
      if (f.saleStartDate && f.useStartDate < f.saleStartDate)
        e.useStartDate = '사용 시작일은 판매 시작일과 같거나 이후여야 합니다.';
      if (expoStartDate && f.useStartDate < expoStartDate)
        e.useStartDate = '사용 시작일은 행사 시작일과 같거나 이후여야 합니다.';
      if (expoEndDate && f.useEndDate > expoEndDate)
        e.useEndDate = '사용 종료일은 행사 종료일과 같거나 이전이어야 합니다.';
    }

    return e;
  };

  const focusFirstError = (e) => {
    const order = [
      'name',
      'type',
      'description',
      'price',
      'totalQuantity',
      'saleStartDate',
      'saleEndDate',
      'useStartDate',
      'useEndDate',
    ];
    for (const key of order) {
      if (e[key]) {
        refs[key]?.current?.focus?.();
        break;
      }
    }
  };

  const handleEditStart = () => {
    if (isSaleStarted(editForm?.saleStartDate)) return;
    setIsEditing(true);
    setErrors({});
  };

  const handleSave = () => {
    const e = runValidation();
    setErrors(e);
    if (Object.values(e).some(Boolean)) {
      focusFirstError(e);
      return;
    }
    const payload = {
      ...editForm,
      price: editForm.price === '' ? '' : Number(editForm.price),
      totalQuantity: editForm.totalQuantity === '' ? '' : Number(editForm.totalQuantity),
    };
    onUpdate(payload);
    setIsEditing(false);
  };

  const handleDelete = (ticketId) => {
    onDelete(ticketId);
    setExpandedId(null);
    setEditForm(null);
    setIsEditing(false);
    setErrors({});
  };

  const handleCancel = () => {
    const original = data.find((d) => d.ticketId === expandedId);
    setEditForm(original ? { ...original } : null);
    setIsEditing(false);
    setErrors({});
  };

  const columns = [
    { header: '티켓 이름', key: 'name' },
    { header: '타입', key: 'type' },
    { header: '가격(원)', key: 'price' },
    { header: '수량', key: 'totalQuantity' },
    { header: '판매 기간', key: 'saleRange' },
    { header: '사용 기간', key: 'useRange' },
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
            const isExpanded = expandedId === row.ticketId;
            const saleRange = `${row.saleStartDate ?? ''} ~ ${row.saleEndDate ?? ''}`;
            const useRange = `${row.useStartDate ?? ''} ~ ${row.useEndDate ?? ''}`;
            const saleStarted = isSaleStarted(row.saleStartDate);

            return (
              <React.Fragment key={row.ticketId}>
                <tr className={styles.row} onClick={() => handleRowClick(row)}>
                  <td className={styles.td}>{row.name}</td>
                  <td className={styles.td}>{row.type}</td>
                  <td className={styles.td}>{String(row.price ?? '')}</td>
                  <td className={styles.td}>{String(row.totalQuantity ?? '')}</td>
                  <td className={styles.td}>{saleRange}</td>
                  <td className={styles.td}>{useRange}</td>
                </tr>

                {isExpanded && editForm && (
                  <tr key={`detail-${row.ticketId}`} className={styles.detailRow}>
                    <td colSpan={columns.length}>
                      <div className={styles.detailBox} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.detailGrid}>
                          <div className={styles.column}>
                            {ticketFieldsLeft.map((key) => (
                              <div key={key} className={styles.detailItem}>
                                <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>

                                {!isEditing ? (
                                  <div className={styles.valueText}>{editForm[key] ?? ''}</div>
                                ) : (
                                  <>
                                    {key === 'type' ? (
                                      <>
                                        <select
                                          ref={refs.type}
                                          name="type"
                                          value={editForm.type || ''}
                                          onChange={handleChange}
                                          className={styles.inputField}
                                          aria-invalid={!!errors.type}
                                        >
                                          <option value="">타입 선택</option>
                                          <option value="얼리버드">얼리버드</option>
                                          <option value="일반">일반</option>
                                        </select>
                                        {errors.type && (
                                          <p className={styles.errorText}>{errors.type}</p>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <input
                                          ref={refs[key]}
                                          type="text"
                                          name={key}
                                          value={editForm[key] ?? ''}
                                          onChange={handleChange}
                                          className={styles.inputField}
                                          aria-invalid={!!errors[key]}
                                          placeholder={
                                            key === 'name'
                                              ? '티켓 이름 입력'
                                              : key === 'description'
                                              ? '설명 입력'
                                              : undefined
                                          }
                                        />
                                        {errors[key] && (
                                          <p className={styles.errorText}>{errors[key]}</p>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className={styles.column}>
                            {ticketFieldsRightTop.map((key) => (
                              <div key={key} className={styles.detailItem}>
                                <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>

                                {!isEditing ? (
                                  <div className={styles.valueText}>
                                    {String(editForm[key] ?? '')}
                                  </div>
                                ) : (
                                  <>
                                    <input
                                      ref={refs[key]}
                                      type={rightFieldIsNumber(key) ? 'number' : 'text'}
                                      name={key}
                                      value={editForm[key] ?? ''}
                                      onChange={handleChange}
                                      className={styles.inputField}
                                      min={key === 'price' ? 0 : key === 'totalQuantity' ? 1 : undefined}
                                      aria-invalid={!!errors[key]}
                                      placeholder={key === 'price' ? '가격 입력' : '수량 입력'}
                                    />
                                    {errors[key] && (
                                      <p className={styles.errorText}>{errors[key]}</p>
                                    )}
                                  </>
                                )}
                              </div>
                            ))}

                            <div className={styles.detailItem}>
                              <div className={styles.detailLabel}>판매 기간</div>

                              {!isEditing ? (
                                <div className={styles.valueGroup}>
                                  <span className={styles.valueText}>
                                    {editForm.saleStartDate || ''}
                                  </span>
                                  <span className={styles.tilde}>~</span>
                                  <span className={styles.valueText}>
                                    {editForm.saleEndDate || ''}
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <div className={styles.timeGroup}>
                                    <input
                                      ref={refs.saleStartDate}
                                      type="date"
                                      name="saleStartDate"
                                      value={editForm.saleStartDate || ''}
                                      onChange={handleChange}
                                      className={styles.inputField}
                                      min={expoLoaded && displayStartDate ? displayStartDate : undefined}
                                      max={expoLoaded && displayEndDate ? displayEndDate : undefined}
                                      aria-invalid={!!errors.saleStartDate}
                                    />
                                    <span className={styles.tilde}>~</span>
                                    <input
                                      ref={refs.saleEndDate}
                                      type="date"
                                      name="saleEndDate"
                                      value={editForm.saleEndDate || ''}
                                      onChange={handleChange}
                                      className={styles.inputField}
                                      min={
                                        (editForm.saleStartDate ||
                                          (expoLoaded && displayStartDate ? displayStartDate : undefined)) ||
                                        undefined
                                      }
                                      max={expoLoaded && displayEndDate ? displayEndDate : undefined}
                                      aria-invalid={!!errors.saleEndDate}
                                    />
                                  </div>
                                  {(errors.saleStartDate || errors.saleEndDate) && (
                                    <p className={styles.errorText}>
                                      {errors.saleStartDate || errors.saleEndDate}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>

                            <div className={styles.detailItem}>
                              <div className={styles.detailLabel}>사용 기간</div>

                              {!isEditing ? (
                                <div className={styles.valueGroup}>
                                  <span className={styles.valueText}>
                                    {editForm.useStartDate || ''}
                                  </span>
                                  <span className={styles.tilde}>~</span>
                                  <span className={styles.valueText}>
                                    {editForm.useEndDate || ''}
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <div className={styles.timeGroup}>
                                    <input
                                      ref={refs.useStartDate}
                                      type="date"
                                      name="useStartDate"
                                      value={editForm.useStartDate || ''}
                                      onChange={handleChange}
                                      className={styles.inputField}
                                      min={expoLoaded ? minUseStart : undefined}
                                      max={expoLoaded && expoEndDate ? expoEndDate : undefined}
                                      aria-invalid={!!errors.useStartDate}
                                    />
                                    <span className={styles.tilde}>~</span>
                                    <input
                                      ref={refs.useEndDate}
                                      type="date"
                                      name="useEndDate"
                                      value={editForm.useEndDate || ''}
                                      onChange={handleChange}
                                      className={styles.inputField}
                                      min={
                                        editForm.useStartDate ||
                                        (expoLoaded && expoStartDate ? expoStartDate : undefined)
                                      }
                                      max={expoLoaded && expoEndDate ? expoEndDate : undefined}
                                      aria-invalid={!!errors.useEndDate}
                                    />
                                  </div>
                                  {(errors.useStartDate || errors.useEndDate) && (
                                    <p className={styles.errorText}>
                                      {errors.useStartDate || errors.useEndDate}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {(
                          (isEditing) || (!isEditing && !saleStarted)
                        ) && (
                          <div className={styles.buttonGroupBottom}>
                            {!isEditing ? (
                              <>
                                <button className={styles.editBtn} onClick={handleEditStart}>
                                  수정
                                </button>
                                <button
                                  className={styles.deleteBtn}
                                  onClick={() => handleDelete(editForm.ticketId)}
                                >
                                  삭제
                                </button>
                              </>
                            ) : (
                              <>
                                <button className={styles.editBtn} onClick={handleSave}>
                                  저장
                                </button>
                                <button className={styles.cancelBtn} onClick={handleCancel}>
                                  취소
                                </button>
                              </>
                            )}
                          </div>
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

export default TicketTable;
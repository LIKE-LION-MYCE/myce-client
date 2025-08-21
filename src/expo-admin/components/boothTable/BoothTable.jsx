// BoothTable.jsx
import React, { useState } from 'react';
import styles from './BoothTable.module.css';
import ImageUpload from '../../../common/components/imageUpload/ImageUpload';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';

const fieldLabelMap = {
  name: '부스명',
  description: '부스 설명',
  boothNumber: '부스 위치',
  displayRank: '노출 순위',
  contactName: '담당자명',
  contactPhone: '담당자 연락처',
  contactEmail: '담당자 이메일',
};

const boothFields = ['name', 'description', 'boothNumber'];
const contactFields = ['contactName', 'contactPhone', 'contactEmail'];

function BoothTable({ data = [], onDelete, onUpdate, expoIsPremium, hasPermission = true }) {
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [errors, setErrors] = useState({}); // 인라인 에러 상태

  // 전화번호 자동 하이픈
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

  const clearAll = () => {
    setEditingId(null);
    setEditForm(null);
    setErrors({});
  };

  const handleRowClick = (row) => {
    if (expandedId === row.id) {
      setExpandedId(null);
      clearAll();
    } else {
      setExpandedId(row.id);
      clearAll();
    }
  };

  const handleEditClick = (e, row) => {
    e.stopPropagation();
    setEditingId(row.id);
    setEditForm({
      id: row.id,
      mainImageUrl: row.mainImageUrl || '',
      name: row.name || '',
      description: row.description || '',
      boothNumber: row.boothNumber || '',
      contactName: row.contactName || '',
      contactPhone: row.contactPhone || '',
      contactEmail: row.contactEmail || '',
      isPremium: !!row.isPremium,
      displayRank: row.displayRank ?? '',
    });
    setErrors({});
  };

  const handleChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setEditForm((prev) => {
      if (!prev) return prev;
      if (name === 'contactPhone') {
        const formatted = formatPhoneNumber(value);
        return { ...prev, contactPhone: formatted };
      }
      return { ...prev, [name]: value };
    });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePremiumToggle = (value) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isPremium: value,
        displayRank: value ? prev.displayRank || '' : '',
      };
    });
    setErrors((prev) => ({ ...prev, isPremium: '', displayRank: '' }));
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setEditForm((prev) => (prev ? { ...prev, mainImageUrl: imageUrl } : prev));
  };

  const handleImageUploadError = (error) => {
    console.error('이미지 업로드 실패:', error);
  };

  // 유효성 검사 (BoothSettingForm과 동일)
  const runValidation = () => {
    const e = {};
    const f = editForm || {};
    const isBlank = (v) => !v || String(v).trim() === '';

    if (isBlank(f.boothNumber)) e.boothNumber = '부스 위치(번호)는 필수입니다.';
    else if (f.boothNumber.length > 30) e.boothNumber = '부스 위치(번호)는 30자 이하여야 합니다.';

    if (isBlank(f.name)) e.name = '부스명은 필수입니다.';
    else if (f.name.length > 100) e.name = '부스명은 100자 이하여야 합니다.';

    if (isBlank(f.description)) e.description = '부스 설명은 필수입니다.';

    if (isBlank(f.contactName)) e.contactName = '담당자명은 필수입니다.';
    else if (f.contactName.length > 30) e.contactName = '담당자명은 30자 이하여야 합니다.';

    const phoneRe = /^\d{2,3}-\d{3,4}-\d{4}$/;
    if (isBlank(f.contactPhone)) e.contactPhone = '담당자 연락처는 필수입니다.';
    else if (!phoneRe.test(f.contactPhone)) e.contactPhone = '유효한 전화번호 형식이 아닙니다. (예: 010-1234-5678)';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isBlank(f.contactEmail)) e.contactEmail = '담당자 이메일은 필수입니다.';
    else if (!emailRe.test(f.contactEmail)) e.contactEmail = '유효한 이메일 형식이 아닙니다.';
    else if (f.contactEmail.length > 100) e.contactEmail = '담당자 이메일은 100자 이하여야 합니다.';

    if (expoIsPremium && f.isPremium) {
      if (isBlank(f.displayRank)) e.displayRank = '노출 순위를 선택해주세요.';
      else if (!/^\d+$/.test(String(f.displayRank))) e.displayRank = '노출 순위는 숫자여야 합니다.';
    }

    return e;
  };

  const handleSave = (e) => {
    e.stopPropagation();
    const v = runValidation();
    setErrors(v);
    if (Object.values(v).some(Boolean)) return;

    const payload = {
      ...editForm,
      isPremium: expoIsPremium ? !!editForm.isPremium : false,
      displayRank:
        expoIsPremium && editForm.isPremium && editForm.displayRank
          ? parseInt(editForm.displayRank, 10)
          : null,
    };
    onUpdate?.(payload);
    clearAll();
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    onDelete?.(id);
    setExpandedId(null);
    clearAll();
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    clearAll();
  };

  const columns = [
    { header: '부스명', key: 'name' },
    { header: '부스 위치', key: 'boothNumber' },
    { header: '노출 순위', key: 'displayRank' },
    { header: '담당자 연락처', key: 'contactPhone' },
    { header: '담당자 이메일', key: 'contactEmail' },
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
                      {col.key === 'displayRank'
                        ? row[col.key] === null || typeof row[col.key] === 'undefined'
                          ? ''
                          : row[col.key]
                        : row[col.key] ?? ''}
                    </td>
                  ))}
                </tr>

                {isExpanded && (
                  <tr className={styles.detailRow} onClick={(e) => e.stopPropagation()}>
                    <td colSpan={columns.length}>
                      <div className={styles.detailBox}>
                        {editingId === row.id && editForm ? (
                          <>
                            <div className={styles.topRow}>
                              <div className={styles.imageWrapper}>
                                <ImageUpload
                                  initialImageUrl={editForm.mainImageUrl}
                                  onUploadSuccess={handleImageUploadSuccess}
                                  onUploadError={handleImageUploadError}
                                />
                              </div>

                              <div className={styles.detailGrid}>
                                <div className={styles.column}>
                                  {boothFields.map((key) => (
                                    <div key={key} className={styles.detailItem}>
                                      <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>
                                      <input
                                        type="text"
                                        name={key}
                                        value={editForm[key] || ''}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                        // ★ placeholder: BoothSettingForm과 동일
                                        placeholder={
                                          key === 'name'
                                            ? '부스명 입력'
                                            : key === 'boothNumber'
                                            ? '예: A-01'
                                            : key === 'description'
                                            ? '부스 설명 입력'
                                            : ''
                                        }
                                      />
                                      {errors[key] && <p className={styles.errorText}>{errors[key]}</p>}
                                    </div>
                                  ))}

                                  {expoIsPremium && (
                                    <>
                                      <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>프리미엄 부스</div>
                                        <div className={styles.booleanGroup}>
                                          <ToggleSwitch
                                            checked={!!editForm.isPremium}
                                            onChange={handlePremiumToggle}
                                          />
                                          <span className={styles.hintText}>
                                            프리미엄이면 노출 순위를 선택하세요.
                                          </span>
                                        </div>
                                      </div>

                                      {editForm.isPremium && (
                                        <div className={styles.detailItem}>
                                          <div className={styles.detailLabel}>노출 순위</div>
                                          <select
                                            name="displayRank"
                                            value={editForm.displayRank || ''}
                                            onChange={handleChange}
                                            className={styles.inputField}
                                          >
                                            <option value="">순위 선택</option>
                                            <option value="1">1위</option>
                                            <option value="2">2위</option>
                                            <option value="3">3위</option>
                                          </select>
                                          {errors.displayRank && (
                                            <p className={styles.errorText}>{errors.displayRank}</p>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>

                                <div className={styles.column}>
                                  {contactFields.map((key) => (
                                    <div key={key} className={styles.detailItem}>
                                      <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>
                                      <input
                                        name={key}
                                        value={editForm[key] || ''}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                        inputMode={key === 'contactPhone' ? 'numeric' : undefined}
                                        type={key === 'contactEmail' ? 'email' : 'text'}
                                        // ★ placeholder: BoothSettingForm과 동일
                                        placeholder={
                                          key === 'contactName'
                                            ? '담당자명을 입력'
                                            : key === 'contactPhone'
                                            ? '예 : 010-1234-5678'
                                            : key === 'contactEmail'
                                            ? '예 : xample@company.com'
                                            : ''
                                        }
                                      />
                                      {errors[key] && <p className={styles.errorText}>{errors[key]}</p>}
                                    </div>
                                  ))}
                                </div>
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
                            <div className={styles.topRow}>
                              <div className={styles.imageWrapper}>
                                {row.mainImageUrl && (
                                  <img
                                    src={row.mainImageUrl}
                                    alt="부스 이미지"
                                    className={styles.detailImage}
                                  />
                                )}
                              </div>

                              <div className={styles.detailGrid}>
                                <div className={styles.column}>
                                  {boothFields.map((key) => (
                                    <div key={key} className={styles.detailItem}>
                                      <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>
                                      <div className={styles.valueText}>{row[key] || '-'}</div>
                                    </div>
                                  ))}

                                  {expoIsPremium && (
                                    <>
                                      <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>프리미엄 부스</div>
                                        <div className={styles.booleanGroup}>
                                          <ToggleSwitch checked={!!row.isPremium} onChange={() => {}} disabled />
                                        </div>
                                      </div>
                                      {row.isPremium && (
                                        <div className={styles.detailItem}>
                                          <div className={styles.detailLabel}>노출 순위</div>
                                          <div className={styles.valueText}>
                                            {row.displayRank ? `${row.displayRank}위` : '-'}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>

                                <div className={styles.column}>
                                  {contactFields.map((key) => (
                                    <div key={key} className={styles.detailItem}>
                                      <div className={styles.detailLabel}>{fieldLabelMap[key]}</div>
                                      <div className={styles.valueText}>{row[key] || '-'}</div>
                                    </div>
                                  ))}
                                </div>
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
                                <button className={styles.deleteBtn} onClick={(e) => handleDeleteClick(e, row.id)}>
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

export default BoothTable;
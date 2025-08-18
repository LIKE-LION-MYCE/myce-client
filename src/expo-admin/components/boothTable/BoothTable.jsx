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

  const handlePremiumToggle = (value) => {
    setEditForm((prev) => ({
      ...prev,
      isPremium: value,
      displayRank: value ? prev.displayRank : null,
    }));
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setEditForm((prev) => ({ ...prev, mainImageUrl: imageUrl }));
  };

  const handleImageUploadError = (error) => {
    console.error('이미지 업로드 실패:', error);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    const payload = {
      ...editForm,
      isPremium: expoIsPremium ? !!editForm.isPremium : false,
      displayRank:
        expoIsPremium && editForm.isPremium && editForm.displayRank
          ? parseInt(editForm.displayRank, 10)
          : null,
    };
    onUpdate?.(payload);
    setEditingId(null);
    setEditForm(null);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    onDelete?.(id);
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
                                      <div className={styles.detailLabel}>
                                        {fieldLabelMap[key]} <span className={styles.required}>*</span>
                                      </div>
                                      <input
                                        type="text"
                                        name={key}
                                        value={editForm[key] || ''}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                      />
                                    </div>
                                  ))}

                                  {expoIsPremium && (
                                    <>
                                      <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>프리미엄 부스</div>
                                        <ToggleSwitch
                                          checked={!!editForm.isPremium}
                                          onChange={handlePremiumToggle}
                                        />
                                      </div>

                                      {editForm.isPremium && (
                                        <div className={styles.detailItem}>
                                          <div className={styles.detailLabel}>
                                            노출 순위 <span className={styles.required}>*</span>
                                          </div>
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
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>

                                <div className={styles.column}>
                                  {contactFields.map((key) => (
                                    <div key={key} className={styles.detailItem}>
                                      <div className={styles.detailLabel}>
                                        {fieldLabelMap[key]} <span className={styles.required}>*</span>
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
                                  <img src={row.mainImageUrl} alt="부스 이미지" className={styles.detailImage} />
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
                                        <div className={styles.valueText}>{row.isPremium ? '예' : '아니오'}</div>
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
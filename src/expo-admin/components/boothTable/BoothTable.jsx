import React from 'react';
import { useState } from 'react';
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

const boothFields = [
  'name',
  'description', 
  'boothNumber',
];

const contactFields = [
  'contactName',
  'contactPhone',
  'contactEmail',
];

function BoothTable({ data = [], onDelete, onUpdate, expoIsPremium }) {
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

  const handleEditClick = (row) => {
    setEditingId(row.id);
    setEditForm(row);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setEditForm((prev) => ({ ...prev, mainImageUrl: imageUrl }));
  };

  const handleImageUploadError = (error) => {
    console.error('이미지 업로드 실패:', error);
  };


  const handleSave = () => {
    // 프리미엄 박람회가 아닌 경우 displayRank를 null로 설정
    const payload = {
      ...editForm,
      isPremium: expoIsPremium || false,
      displayRank: (expoIsPremium && editForm.displayRank) 
        ? parseInt(editForm.displayRank || '0', 10) 
        : null,
    };
    
    onUpdate(payload);
    // 수정 모드 종료 - 상세보기로 돌아감
    setEditingId(null);
    setEditForm(null);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    onDelete(id);
    setExpandedId(null);
    setEditForm(null);
  };

  const handleCancel = () => {
    // 원래 데이터로 복원하고 상세보기로 돌아감
    setEditingId(null);
    setEditForm(null);
  };

  const handleDetailCancel = () => {
    setExpandedId(null);
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
                <tr
                  className={styles.row}
                  onClick={() => handleRowClick(row)}
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
                </tr>

                {isExpanded && (
                  <tr key={`detail-${row.id}`} className={styles.detailRow}>
                    <td colSpan={columns.length}>
                      <div className={styles.detailBox}>
                        <button className={styles.closeBtn} onClick={handleDetailCancel}>
                          ×
                        </button>
                        {editingId === row.id && editForm ? (
                          <>
                            <div className={styles.topRow}>
                          {/* 썸네일 이미지 */}
                          <div className={styles.imageWrapper}>
                            <ImageUpload
                              initialImageUrl={editForm.mainImageUrl}
                              onUploadSuccess={handleImageUploadSuccess}
                              onUploadError={handleImageUploadError}
                            />
                          </div>
                        
                          <div className={styles.detailGrid}>
                            {/* 부스 정보 */}
                            <div className={styles.column}>
                            {boothFields.map((key) => (
                              <div key={key} className={styles.detailItem}>
                                <div className={styles.detailLabel}>
                                  {fieldLabelMap[key]}
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
                            
                            {/* 프리미엄 박람회인 경우에만 노출 순위 수정 가능 */}
                            {expoIsPremium && (
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>노출 순위</div>
                                <input
                                  type="number"
                                  name="displayRank"
                                  value={editForm.displayRank || ''}
                                  onChange={handleChange}
                                  placeholder="노출 순위 (1~100)"
                                  className={styles.inputField}
                                />
                              </div>
                            )}
                          </div>

                          {/* 담당자 정보 */}
                          <div className={styles.column}>
                            {contactFields.map((key) => (
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
                        </div>

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
                          // 읽기 전용 상세 뷰
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
                                      <div className={styles.detailLabel}>
                                        {fieldLabelMap[key]}
                                      </div>
                                      <div className={styles.detailValue}>
                                        {row[key] || '-'}
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {expoIsPremium && (
                                    <div className={styles.detailItem}>
                                      <div className={styles.detailLabel}>노출 순위</div>
                                      <div className={styles.detailValue}>
                                        {row.displayRank || '-'}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className={styles.column}>
                                  {contactFields.map((key) => (
                                    <div key={key} className={styles.detailItem}>
                                      <div className={styles.detailLabel}>
                                        {fieldLabelMap[key]}
                                      </div>
                                      <div className={styles.detailValue}>
                                        {row[key] || '-'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className={styles.buttonGroupBottom}>
                              <button className={styles.editBtn} onClick={() => handleEditClick(row)}>
                                수정
                              </button>
                              <button className={styles.deleteBtn} onClick={(e) => handleDeleteClick(e, row.id)}>
                                삭제
                              </button>
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


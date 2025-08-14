import React from 'react';
import { useState } from 'react';
import styles from './BoothTable.module.css';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';

const DEFAULT_IMAGE = 'https://via.placeholder.com/240x180?text=No+Image';

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
  'displayRank',
];

const contactFields = [
  'contactName',
  'contactPhone',
  'contactEmail',
];

function BoothTable({ data = [], onDelete, onUpdate }) {
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

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
    triggerToast();
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    onDelete(id);
    setExpandedId(null);
    setEditForm(null);
  };

  const handleCancel = () => {
    setExpandedId(null);
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
      {showToast && <ToastSuccess />}

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
                      {col.key === 'displayRank'
                        ? row[col.key] === null
                          ? ''
                          : row[col.key]
                        : row[col.key]}
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
                          {/* 부스 정보 */}
                          <div className={styles.column}>
                            {boothFields.map((key) => (
                              <div key={key} className={styles.detailItem}>
                                <div className={styles.detailLabel}>
                                  {fieldLabelMap[key]}
                                </div>
                                <input
                                  type={key === 'displayRank' ? 'number' : 'text'}
                                  name={key}
                                  value={editForm[key] || ''}
                                  onChange={handleChange}
                                  className={styles.inputField}
                                />
                              </div>
                            ))}
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

export default BoothTable;


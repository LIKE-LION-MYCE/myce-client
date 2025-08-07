import { useState } from 'react';
import styles from './BoothTable.module.css';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';

const fieldLabelMap = {
  boothLocation: '부스 위치',
  companyName: '회사명',
  description: '회사소개',
  ceo: '대표명',
  address: '주소',
  website: '웹사이트',
  phone: '담당자 전화번호',
  email: '담당자 이메일',
  priority: '부스 순위',
  isPremium: '프리미엄 상위 노출 신청 여부',
};

const fieldOrder = [
  'isPremium',
  'priority',
  'boothLocation',
  'companyName',
  'description',
  'ceo',
  'address',
  'website',
  'phone',
  'email',
];

const DEFAULT_IMAGE = 'https://via.placeholder.com/240x180?text=No+Image';

function BoothTable({ data = [], onEdit, onDelete, onUpdate }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const columns = [
    { header: 'No', key: 'no' },
    { header: '회사명', key: 'companyName' },
    { header: '부스 위치', key: 'boothLocation' },
    { header: '상위노출 순위', key: 'priority' },
    { header: '담당자 연락처', key: 'phone' },
    { header: '담당자 이메일', key: 'email' },
  ];

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
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleDeleteClick = (e, no) => {
    e.stopPropagation();
    onDelete(no);
    setShowToast(true);
  };

  return (
    <div className={styles.tableWrapper}>
      {showToast && <ToastSuccess/>}

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
            const imageSrc = row.imageUrl || DEFAULT_IMAGE;

            return (
              <>
                <tr
                  key={`row-${row.no}`}
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
                        onClick={(e) => handleDeleteClick(e, row.no)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>

                {isExpanded && editForm && (
                  <tr key={`detail-${row.no}`} className={styles.detailRow}>
                    <td colSpan={columns.length + 1}>
                      <div className={styles.detailBox}>
                        <div className={styles.imageWrapper}>
                          <img
                            src={imageSrc}
                            alt="부스 이미지"
                            className={styles.boothImage}
                          />
                        </div>

                        <div className={styles.detailContent}>
                          <div className={styles.leftColumn}>
                            {['boothLocation', 'isPremium', 'priority'].map((key) => {
                              const isPriority = key === 'priority';
                              const isDisabled =
                                isPriority &&
                                !(editForm.isPremium === true || editForm.isPremium === 'true');

                              return (
                                <div key={key} className={styles.detailItem}>
                                  <div className={styles.detailLabel}>
                                    {fieldLabelMap[key]}
                                  </div>
                                  {key === 'isPremium' ? (
                                    <ToggleSwitch
                                      checked={
                                        editForm[key] === true || editForm[key] === 'true'
                                      }
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          [key]: e.target.checked,
                                        }))
                                      }
                                    />
                                  ) : (
                                    <input
                                      name={key}
                                      value={editForm[key] || ''}
                                      onChange={handleChange}
                                      disabled={isDisabled}
                                      className={`${styles.inputField} ${
                                        isDisabled ? styles.disabledInput : ''
                                      }`}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className={styles.rightColumn}>
                            {[ 'companyName', 'description', 'ceo', 'address', 'website', 'phone', 'email' ].map((key) => (
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
                          <button className={styles.cancelBtn} onClick={() => {
                            setExpandedRow(null);
                            setEditForm(null);
                          }}>
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

export default BoothTable;
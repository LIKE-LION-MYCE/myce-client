const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR');
  };import React, { useEffect, useState } from 'react';
import styles from './RefundFeeSettingTable.module.css';
import { addRefundFee, getRefundFeeList, updateActivatuibRefundFee, updateRefundFeeSetting } from '../../../api/service/system/settings/refundfee/RefundFeeSettingService';

const RefundFeeSettingTable = ({ card, navigate }) => {
  const [refundFeeSettings, setRefundFeeSettings] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    standardType: '',
    standardDayCount: '',
    feeRate: '',
    validFrom: '',
    validUntil: ''
  });
  const [editData, setEditData] = useState({});

  const standardTypeOptions = [
    { value: 'AFTER_RESERVATION', label: '예매 후' },
    { value: 'BEFORE_EXPO_START', label: '관람 전' }
  ];

  useEffect(() => {
    getRefundFeeList(0)
    .then((res) => {
        const data = res.data;
        console.log(data);
        setRefundFeeSettings(data.refundFees);
    })
    .catch((err) => {
        console.log(`Fail to get refund fee settings. ${err}`);
    })
  }, [])

  const refreshTableData = () => {
    getRefundFeeList(0)
    .then((res) => {
        const data = res.data;
        console.log(data);
        setRefundFeeSettings(data.refundFees);
    })
    .catch((err) => {
        console.log(`Fail to get refund fee settings. ${err}`);
    })
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // API 호출 로직을 여기에 추가
    console.log('Form submitted:', formData);
    addRefundFee({...formData, validFrom: `${formData.validFrom}T00:00:00`, validUntil: `${formData.validUntil}T23:59:59`})
    .then(res => {
      console.log(`Success to save refund fee.`);
      const data = res.data;
      console.log(data);

      // 폼 초기화
      setFormData({ 
        name: '', 
        description: '', 
        standardType: '', 
        standardDayCount: '', 
        feeRate: '', 
        validFrom: '', 
        validUntil: '' 
      });
      
      // 리스트 새로고침
      refreshTableData();
    }).catch(err => {
      console.log(`Fail to save refund fee ${err}`);
      if(err.response.data?.message) {
        alert(err.response.data?.message);
      } else {
        alert('환불 요금제를 저장할 수 없습니다.');
      }
    })
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({ 
      name: '', 
      description: '', 
      standardType: '', 
      standardDayCount: '', 
      feeRate: '', 
      validFrom: '', 
      validUntil: '' 
    });
  };

  const toggleRowExpand = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
    
    // 행을 클릭하면 수정 중인 상태를 취소
    if (editingRow) {
      setEditingRow(null);
      setEditData({});
    }
  };

  const startEdit = (item) => {
    setEditingRow(item.id);
    setEditData({
      name: item.name,
      description: item.description,
      standardDayCount: item.standardDayCount,
      feeRate: item.feeRate,
      validFrom: formatDateForInput(item.validFrom),
      validUntil: formatDateForInput(item.validUntil)
    });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      // UTC 변환 대신 로컬 시간대 기준으로 포맷
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  const saveEdit = (id) => {
    console.log('Save edit:', { id, data: editData });
    
    updateRefundFeeSetting(id, {...editData, validFrom: `${editData.validFrom}T00:00:00`, validUntil: `${editData.validUntil}T23:59:59`})
    .then(res => {
      console.log('Success to update refund fee setting');
      refreshTableData();
      setEditingRow(null);
      setEditData({});
    })
    .catch(err => {
      console.log('Fail to update refund fee setting');
    })
    
    setEditingRow(null);
    setEditData({});
  };

  const handleToggleStatus = (id, currentStatus) => {
    const confirmed = window.confirm(
      `정말로 이 요금제의 활성화 상태를 ${currentStatus ? '비활성화' : '활성화'}로 변경하시겠습니까?`
    );
    
    if (confirmed) {
      updateActivatuibRefundFee(id, !currentStatus)
      .then(res => {
        console.log(`Success to update expo fee activation. id=${id} active=${!currentStatus} `);
        refreshTableData();
      })
      .catch(err => {
        console.log(`Fail to update expo fee activation. id=${id} active=${!currentStatus} `);
      })
    }
  };

  const handleEditChange = (field, value) => {
    console.log(`field: ${field}, value: ${value}`);
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const formatPercentage = (rate) => {
    return `${rate}%`;
  };

  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    // ISO 문자열이나 Date 객체를 datetime-local input 형태로 변환
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';
    
    // YYYY-MM-DDTHH:mm 형태로 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getStandardTypeLabel = (value) => {
    const option = standardTypeOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <main className={styles.container}>
      <div className={styles.headerBox}>
        <div className={styles.titleWithBack}>
          <button className={styles.backArrow} onClick={() => navigate(-1)}>
            ←
          </button>
          <h2 className={styles.templateTitle}>{card.title}</h2>
        </div>
        <p className={styles.pageDesc}>{card.desc}</p>
      </div>

      {/* 추가 폼 */}
      <div className={styles.addFormWrapper}>
        <form onSubmit={handleFormSubmit} className={styles.addForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>요금제명</label>
              <input 
                className={styles.formInput}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="요금제명을 입력하세요"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>기준 타입</label>
              <select 
                className={styles.formSelect}
                value={formData.standardType}
                onChange={(e) => handleInputChange('standardType', e.target.value)}
                required
              >
                <option value="">기준 타입을 선택하세요</option>
                {standardTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>기준 날짜(일)</label>
              <input 
                className={styles.formInput}
                type="number"
                value={formData.standardDayCount}
                onChange={(e) => handleInputChange('standardDayCount', e.target.value)}
                placeholder="기준 날짜를 입력하세요"
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>수수료율(%)</label>
              <input 
                className={styles.formInput}
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.feeRate}
                onChange={(e) => handleInputChange('feeRate', e.target.value)}
                placeholder="수수료율을 입력하세요 (예: 15.5)"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>이용 시작 날짜/시간</label>
              <input 
                className={styles.formInput}
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>이용 종료 날짜/시간</label>
              <input 
                className={styles.formInput}
                type="date"
                value={formData.validUntil}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
              <label className={styles.formLabel}>설명</label>
              <textarea 
                className={styles.formTextarea}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="설명을 입력하세요"
                rows="3"
                required
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>
              추가
            </button>
            <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
              초기화
            </button>
          </div>
        </form>
      </div>

      <section className={styles.noticeWrapper}>
        <div className={styles.warningBox}>
          <strong>⚠ 주의사항</strong>
          <ul>
            <li>설정 변경 시 즉시 적용됩니다</li>
            <li>기존 진행 중인 금액에는 영향을 주지 않습니다</li>
            <li>변경 내역은 시스템에 자동으로 기록됩니다</li>
          </ul>
        </div>
      </section>

      {/* 테이블 섹션 */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.th}>요금제명</th>
              <th className={styles.th}>기준 타입</th>
              <th className={styles.th}>기준 날짜</th>
              <th className={styles.th}>수수료율</th>
              <th className={styles.th}>이용 시작 날짜</th>
              <th className={styles.th}>종료 날짜</th>
              <th className={styles.th}>활성여부</th>
            </tr>
          </thead>
          <tbody>
            {refundFeeSettings.map((item) => (
              <React.Fragment key={item.id}>
                <tr 
                  className={`${styles.row} ${expandedRows.has(item.id) ? styles.expandedRowHeader : ''}`}
                  onClick={() => toggleRowExpand(item.id)}
                >
                  <td className={styles.td}>{item.name}</td>
                  <td className={styles.td}>{getStandardTypeLabel(item.standardType)}</td>
                  <td className={styles.td}>{item.standardDayCount}일</td>
                  <td className={styles.td}>{formatPercentage(item.feeRate)}</td>
                  <td className={styles.td}>{formatDateTime(item.validFrom)}</td>
                  <td className={styles.td}>{formatDateTime(item.validUntil)}</td>
                  <td className={styles.td}>
                    <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={() => handleToggleStatus(item.id, item.active)}
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                  </td>
                </tr>
                {expandedRows.has(item.id) && (
                  <tr className={styles.expandedRow}>
                    <td colSpan="7" className={styles.expandedContent}>
                      <div className={styles.detailsWrapper}>
{editingRow === item.id ? (
                          <div className={styles.detailsView}>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>요금제명</span>
                                <input 
                                  className={styles.editInput}
                                  value={editData.name || ''}
                                  onChange={(e) => handleEditChange('name', e.target.value)}
                                />
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>기준 타입</span>
                                <span className={styles.detailValue}>{getStandardTypeLabel(item.standardType)}</span>
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>기준 날짜</span>
                                <input 
                                  className={styles.editInput}
                                  type="number"
                                  value={editData.standardDayCount || ''}
                                  onChange={(e) => handleEditChange('standardDayCount', e.target.value)}
                                />
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>수수료율</span>
                                <input 
                                  className={styles.editInput}
                                  type="number"
                                  step="0.01"
                                  value={editData.feeRate || ''}
                                  onChange={(e) => handleEditChange('feeRate', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>이용 시작 날짜/시간</span>
                                <input 
                                  className={styles.editInput}
                                  type="date"
                                  value={editData.validFrom}
                                  onChange={(e) => handleEditChange('validFrom', e.target.value)}
                                />
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>이용 종료 날짜/시간</span>
                                <input 
                                  className={styles.editInput}
                                  type="date"
                                  value={editData.validUntil}
                                  onChange={(e) => handleEditChange('validUntil', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem} style={{ gridColumn: 'span 2' }}>
                                <span className={styles.detailLabel}>설명</span>
                                <span className={styles.detailValue}>{item.description}</span>
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>생성 날짜</span>
                                <span className={styles.detailValue}>{formatDateTime(item.createdAt)}</span>
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>수정 날짜</span>
                                <span className={styles.detailValue}>{formatDateTime(item.updatedAt)}</span>
                              </div>
                            </div>
                            
                            <div className={styles.detailActions}>
                              <button 
                                className={styles.saveBtn}
                                onClick={() => saveEdit(item.id)}
                              >
                                저장
                              </button>
                              <button 
                                className={styles.cancelEditBtn}
                                onClick={cancelEdit}
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.detailsView}>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>요금제명</span>
                                <span className={styles.detailValue}>{item.name}</span>
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>기준 타입</span>
                                <span className={styles.detailValue}>{getStandardTypeLabel(item.standardType)}</span>
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>기준 날짜</span>
                                <span className={styles.detailValue}>{item.standardDayCount}일</span>
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>수수료율</span>
                                <span className={styles.detailValue}>{formatPercentage(item.feeRate)}</span>
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>이용 시작 날짜/시간</span>
                                <span className={styles.detailValue}>{formatDateTime(item.validFrom)}</span>
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>이용 종료 날짜/시간</span>
                                <span className={styles.detailValue}>{formatDateTime(item.validUntil)}</span>
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem} style={{ gridColumn: 'span 2' }}>
                                <span className={styles.detailLabel}>설명</span>
                                <span className={styles.detailValue}>{item.description}</span>
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>생성 날짜</span>
                                <span className={styles.detailValue}>{formatDateTime(item.createdAt)}</span>
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>수정 날짜</span>
                                <span className={styles.detailValue}>{formatDateTime(item.updatedAt)}</span>
                              </div>
                            </div>
                            
                            <div className={styles.detailActions}>
                              <button 
                                className={styles.editBtn}
                                onClick={() => startEdit(item)}
                              >
                                수정
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RefundFeeSettingTable;
import React, { useEffect, useState } from 'react';
import styles from './AdFeeSettingTable.module.css';
import { addAdFeeSetting, getAdFeeSettingList, updateAcitvationAdFee } from '../../../api/service/system/settings/adfee/AdFeeSettingService';
import { fetchList } from '../../../api/service/platform-admin/setting/AdPositionSettingService';

const AdFeeSettingTable = ({ card, navigate }) => {
  const [adFeeSettings, setAddFeeSettings] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [formData, setFormData] = useState({
    positionId: '',
    name: '',
    feePerDay: '',
    isActive: false
  });

  useEffect(() => {
    getAdFeeSettingList(0)
    .then((res) => {
        const data = res.data;
        console.log(data);
        setAddFeeSettings(data.adFeeList);
    })
    .catch((err) => {
        console.log(`Fail to get ad fee settings. ${err}`);
    })

    fetchList(0)
    .then(res => {
        const data = res.data;
        console.log(data);
        setPositionOptions(data.content);
    })
    .catch(err => {
        console.log(`Fail to get ad position list.`);
    })
  }, [])

  const handleToggleStatus = (id, currentStatus) => {
    const confirmed = window.confirm(
      `정말로 이 광고의 활성화 상태를 ${currentStatus ? '비활성화' : '활성화'}로 변경하시겠습니까?`
    );
    
    if (confirmed) {
      updateAcitvationAdFee(id, !currentStatus)
      .then(res => {
        console.log(`Success to update ad fee activation. id=${id} active=${!currentStatus} `);
        refreshTableData();
      })
      .catch(err => {
        console.log(`Fail to update ad fee activation. id=${id} active=${!currentStatus} `);
      })
    }
  };

  const refreshTableData = () => {
    getAdFeeSettingList(0)
    .then((res) => {
        const data = res.data;
        console.log(data);
        setAddFeeSettings(data.adFeeList);
    })
    .catch((err) => {
        console.log(`Fail to get ad fee settings. ${err}`);
    })
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // API 호출 로직을 여기에 추가
    console.log('Form submitted:', formData);
    addAdFeeSetting({...formData})
    .then(res => {
      console.log(`Success to save new ad fee setting. ${res.status}`);
      refreshTableData();
    }).catch(err => {
      console.log(`Fail to save new fee setting. ${err}`);
    })
    
    // 폼 초기화
    setFormData({ position: '', name: '', feePerDay: '', isActive: false });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log(value);
    console.log(formData);
  };

  const handleCancel = () => {
    setFormData({ position: '', name: '', feePerDay: '', isActive: false });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
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
              <label className={styles.formLabel}>광고 위치</label>
              <select 
                className={styles.formSelect}
                value={formData.positionId}
                onChange={(e) => handleInputChange('positionId', e.target.value)}
                required
              >
                <option value="">광고 위치를 선택하세요</option>
                {positionOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>설정명</label>
              <input 
                className={styles.formInput}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="설정명을 입력하세요"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>하루 이용료(원)</label>
              <input 
                className={styles.formInput}
                type="number"
                value={formData.feePerDay}
                onChange={(e) => handleInputChange('feePerDay', e.target.value)}
                placeholder="금액을 입력하세요"
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
              <th className={styles.th}>광고 위치</th>
              <th className={styles.th}>설정명</th>
              <th className={styles.th}>하루 이용료</th>
              <th className={styles.th}>생성날짜</th>
              <th className={styles.th}>활성화 여부</th>
            </tr>
          </thead>
          <tbody>
            {adFeeSettings.map((item) => (
              <tr key={item.id} className={styles.row}>
                <td className={styles.td}>{item.position}</td>
                <td className={styles.td}>{item.name}</td>
                <td className={styles.td}>{formatCurrency(item.feePerDay)}원</td>
                <td className={styles.td}>{item.createdAt}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdFeeSettingTable;
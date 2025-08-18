import { useEffect, useState } from 'react';
import styles from './ExpoFeeSettingTable.module.css';
import { addExpoFee, getExpoFeeList, updateActivatuibExpoFee } from '../../../api/service/system/settings/expofee/ExpoFeeSettingService';

const ExpoFeeSettingTable = ({ card, navigate }) => {
  const [expoFeeSettings, setExpoFeeSettings] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    deposit: '',
    premiumDeposit: '',
    dailyUsageFee: '',
    settlementCommission: '',
    isActive: false
  });

  useEffect(() => {
    // API 호출로 데이터 가져오기
    getExpoFeeList(0)
    .then((res) => {
        const data = res.data;
        console.log(data);
        setExpoFeeSettings(data.expoFeeList);
    })
    .catch((err) => {
        console.log(`Fail to get expo fee settings. ${err}`);
    })
  }, [])

  const handleToggleStatus = (id, currentStatus) => {
    const confirmed = window.confirm(
      `정말로 이 요금제의 활성화 상태를 ${currentStatus ? '비활성화' : '활성화'}로 변경하시겠습니까?`
    );
    
    if (confirmed) {
      updateActivatuibExpoFee(id, !currentStatus)
      .then(res => {
        console.log(`Success to update expo fee activation. id=${id} active=${!currentStatus} `);
        refreshTableData();
      })
      .catch(err => {
        console.log(`Fail to update expo fee activation. id=${id} active=${!currentStatus} `);
      })
    }
  };

  const refreshTableData = () => {
    getExpoFeeList(0)
    .then((res) => {
        const data = res.data;
        console.log(data);
        setExpoFeeSettings(data.expoFeeList);
    })
    .catch((err) => {
        console.log(`Fail to get expo fee settings. ${err}`);
    })
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // API 호출 로직을 여기에 추가
    console.log('Form submitted:', formData);
    addExpoFee(formData)
    .then(res => {
      console.log(`Success to save new expo fee.`);
      refreshTableData();
    })
    .catch(err => {
      console.log(`Fail to save new expo fee. ${err}`);
    })
    
    // 폼 초기화
    setFormData({ 
      name: '', 
      deposit: '', 
      premiumDeposit: '', 
      dailyUsageFee: '', 
      settlementCommission: '', 
      isActive: false 
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({ 
      name: '', 
      deposit: '', 
      premiumDeposit: '', 
      dailyUsageFee: '', 
      settlementCommission: '', 
      active: false 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const formatPercentage = (rate) => {
    return `${rate}%`;
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
              <label className={styles.formLabel}>등록금(원)</label>
              <input 
                className={styles.formInput}
                type="number"
                value={formData.deposit}
                onChange={(e) => handleInputChange('deposit', e.target.value)}
                placeholder="등록금을 입력하세요"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>프리미엄 등록금(원)</label>
              <input 
                className={styles.formInput}
                type="number"
                value={formData.premiumDeposit}
                onChange={(e) => handleInputChange('premiumDeposit', e.target.value)}
                placeholder="프리미엄 등록금을 입력하세요"
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>일일 요금제(원)</label>
              <input 
                className={styles.formInput}
                type="number"
                value={formData.dailyUsageFee}
                onChange={(e) => handleInputChange('dailyUsageFee', e.target.value)}
                placeholder="일일 요금제를 입력하세요"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>정산률(%)</label>
              <input 
                className={styles.formInput}
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.settlementCommission}
                onChange={(e) => handleInputChange('settlementCommission', e.target.value)}
                placeholder="정산률을 입력하세요 (예: 15.5)"
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
              <th className={styles.th}>등록금</th>
              <th className={styles.th}>프리미엄 등록금</th>
              <th className={styles.th}>일일 요금제</th>
              <th className={styles.th}>정산률</th>
              <th className={styles.th}>활성화 여부</th>
            </tr>
          </thead>
          <tbody>
            {expoFeeSettings.map((item) => (
              <tr key={item.id} className={styles.row}>
                <td className={styles.td}>{item.name}</td>
                <td className={styles.td}>{formatCurrency(item.deposit)}원</td>
                <td className={styles.td}>{formatCurrency(item.premiumDeposit)}원</td>
                <td className={styles.td}>{formatCurrency(item.dailyUsageFee)}원</td>
                <td className={styles.td}>{formatPercentage(item.settlementCommission)}</td>
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

export default ExpoFeeSettingTable;
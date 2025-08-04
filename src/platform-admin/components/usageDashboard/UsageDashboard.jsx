import { useState } from 'react';
import styles from './UsageDashboard.module.css';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { FaFileExcel } from 'react-icons/fa';
import ToastSuccess from '../../../common/commponents/toastSuccess/ToastSuccess';

function UsageDashboard() {
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleExportClick = () => {
    console.log('엑셀로 저장됨!');
    triggerToast();
  };

  const summaryItems = [
    { label: '총 행사 수', value: '40,689', change: '+8.5%', trend: 'up' },
    { label: '총 예약 수', value: '1,622,000', change: '+1.3%', trend: 'up' },
    { label: '총 행사 신청', value: '10,534', change: '-4.3%', trend: 'down' },
    { label: '총 배너 신청', value: '2,381', change: '+1.8%', trend: 'up' },
  ];

  const chartTitles = ['총 행사', '총 예약', '총 행사 신청', '총 배너 신청'];

  return (
    <div className={styles.usageContainer}>
      <h2 className={styles.title}>이용량 조회</h2>

      <div className={styles.dateFilter}>
        <input type="date" defaultValue="2025-07-19" />
        <span>~</span>
        <input type="date" defaultValue="2025-07-19" />
      </div>

      <div className={styles.cardGroup}>
        {summaryItems.map((item, index) => (
          <div key={index} className={styles.card}>
            <p className={styles.cardLabel}>{item.label}</p>
            <p className={styles.cardValue}>{item.value}</p>
            <div className={styles.cardChange}>
              {item.trend === 'up' ? (
                <FiArrowUpRight className={styles.upIcon} />
              ) : (
                <FiArrowDownRight className={styles.downIcon} />
              )}
              <span>{item.change} 지난 기간 대비</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartHeader}>
        <h3>차트</h3>
        <div className={styles.buttons}>
          <button className={`${styles.actionBtn} ${styles.exportBtn}`} onClick={handleExportClick}>
            <FaFileExcel className={styles.icon} />
            엑셀로 저장
          </button>
        </div>
      </div>

      {/* 아래에 각각의 차트 섹션 추가 */}
      <div className={styles.chartSections}>
        {chartTitles.map((title, idx) => (
          <div key={idx} className={styles.chartBlock}>
            <p className={styles.chartTitle}>{title}</p>
            <div className={styles.chartPlaceholder}> {/* 여기에 차트 들어갈 자리 */} </div>
          </div>
        ))}
      </div>

      {showToast && <ToastSuccess />}
    </div>
  );
}

export default UsageDashboard;
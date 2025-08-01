import { useState } from 'react';
import styles from './RevenueDashboard.module.css';
import ChartImage from './SettlementChart.png';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { FaFileExport } from 'react-icons/fa';
import ToastSuccess from '../../../common/commponents/toastSuccess/ToastSuccess';

function RevenueDashboard() {
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleExportClick = () => {
    console.log('문서로 저장됨!');
    triggerToast();
  };

  const summaryItems = [
    { label: '총 정산 수', value: '40,689', change: '+5.8%', trend: 'up' },
    { label: '총 행사 정산금', value: '10,200,000원', change: '+1.3%', trend: 'up' },
    { label: '총 배너 정산금', value: '8,900,000원', change: '-4.3%', trend: 'down' },
    { label: '플랫폼 총 이득', value: '19,100,000원', change: '+1.8%', trend: 'up' },
  ];

  return (
    <div className={styles.revenueContainer}>
      <h2 className={styles.title}>수익 정산</h2>

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
        <h3>총 정산금 추이</h3>
        <div className={styles.buttons}>
          <button
            className={`${styles.actionBtn} ${styles.exportBtn}`}
            onClick={handleExportClick}
          >
            <FaFileExport className={styles.icon} />
            문서로 저장
          </button>
        </div>
      </div>

      <img src={ChartImage} alt="총 정산금 추이 그래프" className={styles.chartImage} />

      {showToast && <ToastSuccess />}
    </div>
  );
}

export default RevenueDashboard;
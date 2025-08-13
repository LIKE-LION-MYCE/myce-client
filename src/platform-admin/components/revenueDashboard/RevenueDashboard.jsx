import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './RevenueDashboard.module.css';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { FaFileExport } from 'react-icons/fa';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';

// Chart.js의 필수 구성 요소를 등록합니다.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  // 일주일 단위 더미 데이터
  const chartData = {
    labels: ['6월 13일', '6월 14일', '6월 15일', '6월 16일', '6월 17일', '6월 18일', '6월 19일'],
    datasets: [
      {
        label: '총 정산금',
        data: [1500000, 1650000, 1800000, 1750000, 1900000, 2050000, 2100000],
        borderColor: '#5B86E5',
        backgroundColor: 'rgba(91, 134, 229, 0.5)',
        tension: 0.4, // 부드러운 곡선
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('ko-KR').format(value) + '원';
          },
        },
      },
    },
  };

  return (
    <div className={styles.revenueContainer}>
      <h2 className={styles.title}>수익 정산</h2>

      <form className={styles.dateFilter}>
        <input type="date" defaultValue="2025-06-13" />
        <span>~</span>
        <input type="date" defaultValue="2025-06-19" />
        <button type="submit" className={styles.actionBtn} >적용</button>
      </form>

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

      <div className={styles.chartWrapper}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {showToast && <ToastSuccess />}
    </div>
  );
}

export default RevenueDashboard;
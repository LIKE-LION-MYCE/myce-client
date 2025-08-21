import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './RevenueDashboard.module.css';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import Spinner from '../../../common/components/spinner/Spinner';
import { getRevenue } from '../../../api/service/platform-admin/dashboard/DashboardService';

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

// 날짜 포맷 함수는 이제 더 이상 필요하지 않습니다.
// 백엔드에서 포맷팅된 라벨을 직접 받습니다.

function RevenueDashboard() {
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState('weekly');
  const [summaryItems, setSummaryItems] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRevenue(activeTab);

        const { summaryItems, chartData } = response.data;
        console.log(response.data);

        setSummaryItems(summaryItems);

        setChartData({
          labels: chartData.labels,
          datasets: [{
            label: '총 정산금', // 직접 라벨을 지정
            data: chartData.data, // 백엔드에서 받은 데이터 배열을 그대로 사용
            borderColor: '#5B86E5',
            backgroundColor: 'rgba(91, 134, 229, 0.5)',
            tension: 0.4,
            fill: true,
          }],
        });

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        triggerToast();
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeTab]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
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
          callback: function (value) {
            return new Intl.NumberFormat('ko-KR').format(value) + '원';
          },
        },
      },
    },
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.revenueContainer} style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className={styles.revenueContainer}>
      <h2 className={styles.title}>수익 정산</h2>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'daily' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          일일
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'weekly' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          일주일
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'monthly' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          한달
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === '6months' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('6months')}
        >
          6개월
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'yearly' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('yearly')}
        >
          1년
        </button>
      </div>

      <div className={styles.cardGroup}>
        {summaryItems.map((item, index) => (
          <div key={index} className={styles.card}>
            <p className={styles.cardLabel}>{item.label}</p>
            <p className={styles.cardValue}>{item.value.toLocaleString()}</p>
            <div className={styles.cardChange}>
              {item.trending ? (
                <FiArrowUpRight className={styles.upIcon} />
              ) : (
                <FiArrowDownRight className={styles.downIcon} />
              )}
              <span>{item.change.toFixed(2) || 0}% 지난 기간 대비</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartHeader}>
        <h3>총 정산금 추이</h3>
      </div>

      <div className={styles.chartWrapper}>
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>

      {showToast && <ToastFail />}
    </div>
  );
}

export default RevenueDashboard;
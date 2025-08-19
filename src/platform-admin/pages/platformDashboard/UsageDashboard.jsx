import { useEffect, useState } from 'react';
import styles from './UsageDashboard.module.css';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import Spinner from '../../../common/components/spinner/Spinner';
import { getUsage } from '../../../api/service/platform-admin/dashboard/DashboardService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// chart.js의 필수 요소들을 등록합니다.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// DTO의 HashMap 키와 화면에 표시될 제목을 매핑합니다.
const CHART_MAPPING = {
  'expo': '총 행사',
  'reservation': '총 예약',
  'ad': '총 배너 신청',
};

function UsageDashboard() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryItems, setSummaryItems] = useState([]);
  const [chartData, setChartData] = useState({}); // 차트 데이터를 저장할 상태

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUsage(activeTab);
        setSummaryItems(response.data.summaryItems); // DTO 변경에 따라 summaryItems 상태 업데이트
        setChartData(response.data.chartData); // DTO 변경에 따라 chartData 상태 업데이트
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeTab]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.revenueContainer} style={{ color: 'red' }}>{error}</div>;
  }

  // Chart 컴포넌트 렌더링에 사용할 공통 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 이 옵션을 추가
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const renderCharts = () => {
    // chartData가 비어있거나, key-value 쌍이 없는 경우 null 반환
    if (!chartData || Object.keys(chartData).length === 0) {
      return null;
    }

    return Object.keys(CHART_MAPPING).map((key) => {
      const data = chartData[key];
      if (!data) return null; // 해당 키g에 대한 데이터가 없으면 렌더링하지 않음

      const chartComponentData = {
        labels: data.labels,
        datasets: [
          {
            label: CHART_MAPPING[key], // 여기에 라벨을 추가합니다.
            data: data.data,
            borderColor: '#5B86E5', // 원하는 색상으로 변경
            backgroundColor: 'rgba(91, 134, 229, 0.5)',
            tension: 0.4,
            fill: true,
          },
        ],
      };

      return (
        <div key={key} className={styles.chartBlock}>
          <p className={styles.chartTitle}>{CHART_MAPPING[key]}</p>
          <div className={styles.chartPlaceholder}>
            <Line options={chartOptions} data={chartComponentData} />
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.usageContainer}>
      <h2 className={styles.title}>이용량 조회</h2>


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
              <span>{item.change.toFixed(2)}% 지난 기간 대비</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartHeader}>
        <h3>차트</h3>
      </div>

      <div className={styles.chartSections}>
        {renderCharts()}
      </div>

      {showToast && <ToastFail />}
    </div>
  );
}

export default UsageDashboard;
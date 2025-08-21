import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { FiRefreshCw } from 'react-icons/fi';
import DashboardService from '../../../api/service/expo-admin/dashboard/DashboardService';
import DashboardTable from '../../components/dashboardTable/DashboardTable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const { expoId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 날짜 선택 관련 상태
  const [expoDateRange, setExpoDateRange] = useState([null, null]);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [customWeeklyData, setCustomWeeklyData] = useState(null);
  const [isCustomDateMode, setIsCustomDateMode] = useState(false);

  // 시간대별 입장인원 날짜 선택 관련 상태
  const [selectedCheckinDate, setSelectedCheckinDate] = useState('');
  const [customHourlyData, setCustomHourlyData] = useState(null);
  const [isCustomCheckinMode, setIsCustomCheckinMode] = useState(false);

  // 캐시 삭제 버튼 표시 여부 (필요시 true로 변경)
  const [showClearCacheBtn, setShowClearCacheBtn] = useState(false);

  const columns = [
    { key: 'ticketType', header: '티켓이름' },
    { key: 'totalQuantity', header: '전체수량' },
    { key: 'soldCount', header: '판매수량' },
    { key: 'remainingCount', header: '남은수량' },
    { key: 'unitPrice', header: '단가' },
    { key: 'totalRevenue', header: '총판매금액' },
  ];

  useEffect(() => {
    if (expoId) {
      loadDashboardData();
    }
  }, [expoId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getExpoDashboard(expoId);
      setDashboardData(data);

      if (data.expoDisplayDateRange) {
        setExpoDateRange(data.expoDisplayDateRange);

        const expoStart = new Date(data.expoDisplayDateRange[0]);
        const expoEnd = new Date(data.expoDisplayDateRange[1]);
        const today = new Date();

        let endDate = today;
        let startDate = new Date(today);
        startDate.setDate(endDate.getDate() - 6);

        if (endDate > expoEnd) {
          endDate = expoEnd;
          startDate = new Date(expoEnd);
          startDate.setDate(expoEnd.getDate() - 6);
        }

        if (startDate < expoStart) {
          startDate = expoStart;
          if (expoEnd <= startDate) {
            endDate = expoEnd;
          }
        }

        setSelectedStartDate(startDate.toISOString().split('T')[0]);
        setSelectedEndDate(endDate.toISOString().split('T')[0]);

        const checkinDate = today > expoEnd ? expoEnd : today;
        setSelectedCheckinDate(checkinDate.toISOString().split('T')[0]);
      }

      setError(null);
    } catch (err) {
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomWeeklyData = async () => {
    if (!selectedStartDate || !selectedEndDate) {
      alert('시작일과 종료일을 모두 선택해주세요.');
      return;
    }
    try {
      const response = await DashboardService.getWeeklyReservationsByDateRange(
        expoId,
        selectedStartDate,
        selectedEndDate
      );
      setCustomWeeklyData(response.dailyReservations);
      setIsCustomDateMode(true);
    } catch (err) {
      alert('선택한 날짜 범위의 데이터를 불러오는데 실패했습니다.');
      console.error('Custom weekly data loading error:', err);
    }
  };

  const resetToDefaultWeekly = () => {
    setIsCustomDateMode(false);
    setCustomWeeklyData(null);
  };

  const loadCustomHourlyData = async () => {
    if (!selectedCheckinDate) {
      alert('날짜를 선택해주세요.');
      return;
    }
    try {
      const hourlyData = await DashboardService.getHourlyCheckinsByDate(expoId, selectedCheckinDate);
      setCustomHourlyData(hourlyData);
      setIsCustomCheckinMode(true);
    } catch (err) {
      alert('선택한 날짜의 시간대별 입장 데이터를 불러오는데 실패했습니다.');
      console.error('Custom hourly data loading error:', err);
    }
  };

  const resetToDefaultHourly = () => {
    setIsCustomCheckinMode(false);
    setCustomHourlyData(null);
  };

  const handleRefresh = async (type) => {
    try {
      switch (type) {
        case 'reservation':
          await DashboardService.refreshReservationCache(expoId);
          break;
        case 'checkin':
          await DashboardService.refreshCheckinCache(expoId);
          break;
        case 'payment':
          await DashboardService.refreshPaymentCache(expoId);
          break;
        case 'all':
          await DashboardService.refreshAllCache(expoId);
          break;
        default:
          break;
      }
      await loadDashboardData();
    } catch (err) {
      console.error('Cache refresh error:', err);
    }
  };

  const handleCacheClear = async () => {
    if (!window.confirm('모든 캐시를 완전히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    try {
      await DashboardService.clearAllCache(expoId);
      await loadDashboardData();
      setShowClearCacheBtn(false);
      alert('캐시가 완전히 삭제되었습니다.');
    } catch (err) {
      console.error('Cache clear error:', err);
      alert('캐시 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loading}>대시보드 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.error}>
          {error}
          <button onClick={loadDashboardData} className={styles.retryBtn}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const { reservationStats, checkinStats, paymentStats } = dashboardData || {};

  const tableData =
    paymentStats?.ticketSalesDetail?.map((ticket) => ({
      ticketType: ticket.ticketType,
      totalQuantity: ticket.totalQuantity?.toLocaleString(),
      soldCount: ticket.soldCount?.toLocaleString(),
      remainingCount: ticket.remainingCount?.toLocaleString(),
      unitPrice: `₩${ticket.unitPrice?.toLocaleString()}`,
      totalRevenue: `₩${ticket.totalRevenue?.toLocaleString()}`,
    })) || [];

  const summaryRow = {
    ticketType: '합계',
    totalQuantity: tableData
      .reduce((sum, item) => sum + parseInt(item.totalQuantity?.replace(/,/g, '') || 0), 0)
      .toLocaleString(),
    soldCount: tableData
      .reduce((sum, item) => sum + parseInt(item.soldCount?.replace(/,/g, '') || 0), 0)
      .toLocaleString(),
    remainingCount: tableData
      .reduce((sum, item) => sum + parseInt(item.remainingCount?.replace(/,/g, '') || 0), 0)
      .toLocaleString(),
    unitPrice: '',
    totalRevenue: `₩${paymentStats?.totalRevenue?.toLocaleString() || 0}`,
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* 사용 안내 공지 */}
      <div className={styles.noticeInfo}>
        <p className={styles.noticeText}>💡 차트나 그래프에 마우스 커서를 올리시면 상세한 수치를 확인하실 수 있습니다.</p>
        <p className={styles.noticeText}>📊 새로고침 버튼을 통해 최신 데이터로 업데이트할 수 있습니다.</p>
      </div>

      {/* 전체 새로고침 */}
      <div className={styles.globalActions}>
        <button
          onClick={() => handleRefresh('all')}
          className={`${styles.actionBtn} ${styles.btnPrimary}`}
        >
          <FiRefreshCw className={styles.refreshIcon} />
          전체 새로고침
        </button>
        {showClearCacheBtn && (
          <button onClick={handleCacheClear} className={`${styles.actionBtn} ${styles.btnGhost}`}>
            🗑️ 캐시 완전 삭제
          </button>
        )}
      </div>

      {/* 예매 현황 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>예매 현황</h4>
        </div>

        <div className={styles.cardGroup}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>누적 판매 개수</p>
            <p className={styles.cardValue}>{reservationStats?.totalReservations?.toLocaleString() || 0}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>오늘 판매 개수</p>
            <p className={styles.cardValue}>{reservationStats?.todayReservations?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* 날짜별 판매 현황 */}
        <div className={styles.fullWidthChart}>
          <div className={styles.chartHeader}>
            <h5 className={styles.chartTitle}>날짜별 판매 현황</h5>
            <div className={styles.dateControls}>
              {expoDateRange[0] && (
                <>
                  <input
                    type="date"
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                    min={expoDateRange[0]}
                    max={expoDateRange[1]}
                    className={styles.dateInput}
                  />
                  <span>~</span>
                  <input
                    type="date"
                    value={selectedEndDate}
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                    min={selectedStartDate || expoDateRange[0]}
                    max={expoDateRange[1]}
                    className={styles.dateInput}
                  />
                  <button
                    onClick={loadCustomWeeklyData}
                    className={`${styles.actionBtn} ${styles.btnPrimary} ${styles.btnSm}`}
                  >
                    조회
                  </button>
                  {isCustomDateMode && (
                    <button
                      onClick={resetToDefaultWeekly}
                      className={`${styles.actionBtn} ${styles.btnGhost} ${styles.btnSm}`}
                    >
                      기본값
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.chartWrapper}>
            {(() => {
              const chartData = customWeeklyData || reservationStats?.weeklyReservations || [];
              const hasValidData = chartData && chartData.length > 0;

              if (!hasValidData) {
                return <div className={styles.noDataMessage}>표시할 데이터가 없습니다.</div>;
              }

              const labels = customWeeklyData
                ? customWeeklyData.map((day) => {
                    const date = new Date(day.date);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  })
                : chartData.map((day) => day.dayOfWeek);

              const dataValues = customWeeklyData
                ? customWeeklyData.map((day) => day.reservationCount || 0)
                : chartData.map((day) => day.reservationCount || 0);

              return (
                <Line
                  key={`chart-${isCustomDateMode ? 'custom' : 'default'}-${chartData.length}`}
                  data={{
                    labels,
                    datasets: [
                      {
                        label: '판매 수',
                        data: dataValues,
                        borderColor: '#8884d8',
                        backgroundColor: 'rgba(136, 132, 216, 0.1)',
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: '#8884d8',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                          title: function (context) {
                            return customWeeklyData
                              ? `${customWeeklyData[context[0].dataIndex]?.date || ''}`
                              : context[0].label;
                          },
                        },
                      },
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 1 } },
                      x: { grid: { display: false } },
                    },
                    interaction: { mode: 'nearest', axis: 'x', intersect: false },
                  }}
                  height={250}
                />
              );
            })()}
          </div>
        </div>
      </div>

      {/* 예매자 현황 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>예매자 현황</h4>
        </div>

        <div className={styles.chartGrid}>
          <div className={styles.chartContainer}>
            <h5 className={styles.chartTitle}>성별 통계</h5>
            <div className={styles.chartWrapper}>
              <Pie
                data={{
                  labels: ['남성', '여성'],
                  datasets: [
                    {
                      data: [
                        reservationStats?.genderStats?.maleCount || 0,
                        reservationStats?.genderStats?.femaleCount || 0,
                      ],
                      backgroundColor: ['#0088FE', '#00C49F'],
                      borderWidth: 2,
                      borderColor: '#fff',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = total ? ((context.raw / total) * 100).toFixed(1) : 0;
                          return `${context.label}: ${context.raw}명 (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
                height={200}
              />
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h5 className={styles.chartTitle}>연령대별 통계</h5>
            <div className={styles.chartWrapper}>
              <Bar
                data={{
                  labels: reservationStats?.ageGroupStats?.ageGroups?.map((age) => age.ageRange) || [],
                  datasets: [
                    {
                      label: '구매 수',
                      data: reservationStats?.ageGroupStats?.ageGroups?.map((age) => age.count) || [],
                      backgroundColor: '#8884d8',
                      borderColor: '#6366f1',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
                height={200}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 입장 현황 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>입장 현황</h4>
        </div>

        <div className={styles.checkinContainer}>
          <div className={styles.checkinHeader}>
            <h3>박람회 체크인 진행률</h3>
          </div>
          <div className={styles.checkinStats}>
            <div>
              <h2>{checkinStats?.qrCheckinSuccess?.toLocaleString() || 0}</h2>
              <p className={styles.checkinSub}>QR 체크인 성공</p>
            </div>
            <div>
              <h2>{checkinStats?.reservedTickets?.toLocaleString() || 0}</h2>
              <p className={styles.checkinSub}>누적 판매 개수</p>
            </div>
          </div>
          <div className={styles.checkinRate}>
            <h1>{checkinStats?.checkinProgress?.toFixed(1) || 0}%</h1>
            <p className={styles.checkinSub}>체크인 진행율</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${checkinStats?.checkinProgress || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className={styles.fullWidthChart}>
          <div className={styles.chartTitleRow}>
            <h5 className={styles.chartTitle}>시간대별 입장 현황</h5>
            <div className={styles.dateControls}>
              <input
                type="date"
                value={selectedCheckinDate}
                min={expoDateRange[0]}
                max={expoDateRange[1]}
                onChange={(e) => setSelectedCheckinDate(e.target.value)}
                className={styles.dateInput}
              />
              <button
                onClick={loadCustomHourlyData}
                className={`${styles.actionBtn} ${styles.btnPrimary} ${styles.btnSm}`}
              >
                조회
              </button>
              {isCustomCheckinMode && (
                <button
                  onClick={resetToDefaultHourly}
                  className={`${styles.actionBtn} ${styles.btnGhost} ${styles.btnSm}`}
                >
                  오늘로 복귀
                </button>
              )}
            </div>
          </div>

          <div className={styles.chartWrapper}>
            {(() => {
              const currentHourlyData = isCustomCheckinMode
                ? customHourlyData
                : checkinStats?.hourlyCheckins;

              if (!currentHourlyData || currentHourlyData.length === 0) {
                return (
                  <div className={styles.noDataMessage}>
                    선택한 날짜에 대한 시간대별 입장 데이터가 없습니다.
                  </div>
                );
              }

              return (
                <Line
                  key={`hourly-${isCustomCheckinMode ? selectedCheckinDate : 'default'}`}
                  data={{
                    labels: currentHourlyData.map((hour) => hour.timeRange) || [],
                    datasets: [
                      {
                        label: '입장 수',
                        data: currentHourlyData.map((hour) => hour.checkinCount) || [],
                        borderColor: '#00C49F',
                        backgroundColor: 'rgba(0, 196, 159, 0.1)',
                        tension: 0.3,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } },
                  }}
                  height={250}
                />
              );
            })()}
          </div>
        </div>
      </div>

      {/* 결제 현황 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>결제 현황</h4>
        </div>

        <div className={styles.cardGroup}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>결제 완료</p>
            <p className={styles.cardValue}>{paymentStats?.completedPayments?.toLocaleString() || 0}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>결제 대기</p>
            <p className={styles.cardValue}>{paymentStats?.pendingPayments?.toLocaleString() || 0}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>환불</p>
            <p className={styles.cardValue}>{paymentStats?.refundedPayments?.toLocaleString() || 0}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>오늘 수익</p>
            <p className={styles.cardValue}>₩{paymentStats?.todayRevenue?.toLocaleString() || 0}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>총 수익</p>
            <p className={styles.cardValue}>₩{paymentStats?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <h4 className={styles.sectionTitle}>티켓 현황</h4>
          <DashboardTable columns={columns} data={tableData} summaryRow={summaryRow} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
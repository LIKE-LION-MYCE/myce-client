import React, { useState, useEffect, useRef } from 'react';
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

  const columns = [
    { key: 'ticketType', header: '티켓명' },
    { key: 'soldCount', header: '판매수량' },
    { key: 'unitPrice', header: '단가' },
    { key: 'totalRevenue', header: '총 판매금액' },
  ];

  // 차트 색상 설정
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    if (expoId) {
      loadDashboardData();
      loadExpoDateRange();
    }
  }, [expoId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getExpoDashboard(expoId);
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExpoDateRange = async () => {
    try {
      const dateRange = await DashboardService.getExpoDisplayDateRange(expoId);
      setExpoDateRange(dateRange);
      
      // 박람회 표시 기간 내에서 최근 7일을 기본값으로 설정
      const expoStart = new Date(dateRange[0]);
      const expoEnd = new Date(dateRange[1]);
      const today = new Date();
      
      // 최근 7일 계산 (종료일부터 역산)
      let endDate = today;
      let startDate = new Date(today);
      startDate.setDate(endDate.getDate() - 6);
      
      // 박람회 표시 기간을 벗어나는 경우 조정
      if (endDate > expoEnd) {
        endDate = expoEnd;
        startDate = new Date(expoEnd);
        startDate.setDate(expoEnd.getDate() - 6);
      }
      
      if (startDate < expoStart) {
        startDate = expoStart;
        // 박람회 기간이 7일보다 짧은 경우는 전체 기간으로 설정
        if (expoEnd <= startDate) {
          endDate = expoEnd;
        }
      }
      
      const validStartDate = startDate;
      const validEndDate = endDate;
      
      setSelectedStartDate(validStartDate.toISOString().split('T')[0]);
      setSelectedEndDate(validEndDate.toISOString().split('T')[0]);
    } catch (err) {
      console.error('박람회 기간 조회 실패:', err);
    }
  };

  const loadCustomWeeklyData = async () => {
    if (!selectedStartDate || !selectedEndDate) {
      alert('시작일과 종료일을 모두 선택해주세요.');
      return;
    }
    
    try {
      const customData = await DashboardService.getWeeklyReservationsByDateRange(
        expoId, 
        selectedStartDate, 
        selectedEndDate
      );
      setCustomWeeklyData(customData);
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
      }
      // 캐시 갱신 후 데이터 다시 로드
      await loadDashboardData();
    } catch (err) {
      console.error('Cache refresh error:', err);
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

  // 테이블 데이터 변환
  const tableData = paymentStats?.ticketSalesDetail?.map(ticket => ({
    ticketType: ticket.ticketType,
    soldCount: ticket.soldCount?.toLocaleString(),
    unitPrice: `₩${ticket.unitPrice?.toLocaleString()}`,
    totalRevenue: `₩${ticket.totalRevenue?.toLocaleString()}`
  })) || [];

  const summaryRow = {
    ticketType: '합계',
    soldCount: tableData.reduce((sum, item) => sum + parseInt(item.soldCount?.replace(/,/g, '') || 0), 0).toLocaleString(),
    unitPrice: '',
    totalRevenue: `₩${paymentStats?.totalRevenue?.toLocaleString() || 0}`
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* 사용 안내 공지 */}
      <div className={styles.noticeInfo}>
        <p className={styles.noticeText}>
          💡 차트나 그래프에 마우스 커서를 올리시면 상세한 수치를 확인하실 수 있습니다.
        </p>
        <p className={styles.noticeText}>
          📊 새로고침 버튼을 통해 최신 데이터로 업데이트할 수 있습니다.
        </p>
      </div>

      {/* 전체 새로고침 버튼 */}
      <div className={styles.globalActions}>
        <button 
          onClick={() => handleRefresh('all')} 
          className={styles.refreshAllBtn}
        >
          <FiRefreshCw className={styles.refreshIcon} />
          전체 새로고침
        </button>
      </div>

      {/* 예약 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>예약</h4>
          <button 
            onClick={() => handleRefresh('reservation')} 
            className={styles.refreshBtn}
          >
            <FiRefreshCw className={styles.refreshIcon} />
            새로고침
          </button>
        </div>
        <div className={styles.cardGroup}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>누적 예약자</p>
            <p className={styles.cardValue}>
              {reservationStats?.totalReservations?.toLocaleString() || 0}
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>오늘 예약자</p>
            <p className={styles.cardValue}>
              {reservationStats?.todayReservations?.toLocaleString() || 0}
            </p>
          </div>
        </div>
        
        <div className={styles.chartGrid}>
          {/* 성별 통계 파이 차트 */}
          <div className={styles.chartContainer}>
            <h5 className={styles.chartTitle}>성별 예약 현황</h5>
            <div className={styles.chartWrapper}>
              <Pie
                data={{
                  labels: ['남성', '여성'],
                  datasets: [{
                    data: [
                      reservationStats?.genderStats?.maleCount || 0,
                      reservationStats?.genderStats?.femaleCount || 0
                    ],
                    backgroundColor: [
                      '#0088FE',
                      '#00C49F'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((context.raw / total) * 100).toFixed(1);
                          return `${context.label}: ${context.raw}명 (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
                height={200}
              />
            </div>
          </div>

          {/* 연령대 통계 바 차트 */}
          <div className={styles.chartContainer}>
            <h5 className={styles.chartTitle}>연령대별 예약 현황</h5>
            <div className={styles.chartWrapper}>
              <Bar
                data={{
                  labels: reservationStats?.ageGroupStats?.ageGroups?.map(age => age.ageRange) || [],
                  datasets: [{
                    label: '예약 수',
                    data: reservationStats?.ageGroupStats?.ageGroups?.map(age => age.count) || [],
                    backgroundColor: '#8884d8',
                    borderColor: '#6366f1',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
                height={200}
              />
            </div>
          </div>
        </div>

        {/* 주간 예약 현황 라인 차트 */}
        <div className={styles.fullWidthChart}>
          <div className={styles.chartHeader}>
            <h5 className={styles.chartTitle}>
              {isCustomDateMode ? '선택 기간 예약 현황' : '일주일 예약 현황'}
            </h5>
            
            {/* 날짜 선택 컨트롤 */}
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
                    className={styles.dateApplyBtn}
                  >
                    조회
                  </button>
                  {isCustomDateMode && (
                    <button
                      onClick={resetToDefaultWeekly}
                      className={styles.dateResetBtn}
                    >
                      기본값
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className={styles.chartWrapper}>
            <Line
              data={{
                labels: (isCustomDateMode && customWeeklyData 
                  ? customWeeklyData?.map(day => `${day.date.split('-')[1]}/${day.date.split('-')[2]} (${day.dayOfWeek})`) 
                  : reservationStats?.weeklyReservations?.map(day => day.dayOfWeek)) || [],
                datasets: [{
                  label: '예약 수',
                  data: (isCustomDateMode && customWeeklyData 
                    ? customWeeklyData?.map(day => day.reservationCount)
                    : reservationStats?.weeklyReservations?.map(day => day.reservationCount)) || [],
                  borderColor: '#8884d8',
                  backgroundColor: 'rgba(136, 132, 216, 0.1)',
                  tension: 0.3,
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
              height={250}
            />
          </div>
        </div>
      </div>

      {/* 입장 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>입장</h4>
          <button 
            onClick={() => handleRefresh('checkin')} 
            className={styles.refreshBtn}
          >
            <FiRefreshCw className={styles.refreshIcon} />
            새로고침
          </button>
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
              <p className={styles.checkinSub}>예약 티켓 수</p>
            </div>
          </div>
          <div className={styles.checkinRate}>
            <h1>{checkinStats?.checkinProgress?.toFixed(1) || 0}%</h1>
            <p className={styles.checkinSub}>체크인 진행율</p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${checkinStats?.checkinProgress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 시간대별 입장 현황 라인 차트 */}
        <div className={styles.fullWidthChart}>
          <h5 className={styles.chartTitle}>시간대별 입장 현황</h5>
          <div className={styles.chartWrapper}>
            <Line
              data={{
                labels: checkinStats?.hourlyCheckins?.map(hour => hour.timeRange) || [],
                datasets: [{
                  label: '입장 수',
                  data: checkinStats?.hourlyCheckins?.map(hour => hour.checkinCount) || [],
                  borderColor: '#00C49F',
                  backgroundColor: 'rgba(0, 196, 159, 0.1)',
                  tension: 0.3,
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
              height={250}
            />
          </div>
        </div>
      </div>

      {/* 결제 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>결제</h4>
          <button 
            onClick={() => handleRefresh('payment')} 
            className={styles.refreshBtn}
          >
            <FiRefreshCw className={styles.refreshIcon} />
            새로고침
          </button>
        </div>
        
        <div className={styles.cardGroup}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>결제 완료</p>
            <p className={styles.cardValue}>
              {paymentStats?.completedPayments?.toLocaleString() || 0}
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>결제 대기</p>
            <p className={styles.cardValue}>
              {paymentStats?.pendingPayments?.toLocaleString() || 0}
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>취소/환불</p>
            <p className={styles.cardValue}>
              {((paymentStats?.canceledPayments || 0) + (paymentStats?.refundedPayments || 0)).toLocaleString()}
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>오늘 수익</p>
            <p className={styles.cardValue}>
              ₩{paymentStats?.todayRevenue?.toLocaleString() || 0}
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>총 수익</p>
            <p className={styles.cardValue}>
              ₩{paymentStats?.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* 티켓 판매 상세 테이블 */}
        <div className={styles.tableContainer}>
          <h5 className={styles.tableTitle}>티켓 종류별 판매 현황</h5>
          <DashboardTable 
            columns={columns} 
            data={tableData} 
            summaryRow={summaryRow} 
          />
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
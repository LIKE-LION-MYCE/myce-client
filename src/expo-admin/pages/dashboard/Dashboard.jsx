import styles from './Dashboard.module.css';
import { FiRefreshCw } from 'react-icons/fi';
import AgeGraph from './AgeGraph.png';
import GenderGraph from './GenderGraph.png';
import TimeEntranceGraph from './TimeEntranceGraph.png';
import DateEntranceGraph from './DateEntranceGraph.png';
import DashboardTable from '../../components/dashboardTable/DashboardTable';

function Dashboard() {
  const columns = [
    { key: 'ticketName', header: '티켓명' },
    { key: 'quantity', header: '총 티켓수량' },
    { key: 'soldQuantity', header: '실제 판매수량'},
    { key: 'type', header: '티켓타입' },
    { key: 'total', header: '총 판매금액' },
  ];

  const data = [
    {
      ticketName: '2025 서울 스마트 모빌리티 엑스포 1일권',
      quantity: 200,
      soldQuantity : 100,
      type: '얼리버드',
      total: '₩2,340,000',
    },
    {
      ticketName: '2025 서울 스마트 모빌리티 엑스포 1일권',
      quantity: 200,
      soldQuantity : 120,
      type: '얼리버드',
      total: '₩2,340,000',
    },
    {
      ticketName: '2025 서울 스마트 모빌리티 엑스포 1일권',
      quantity: 200,
      soldQuantity : 150,
      type: '얼리버드',
      total: '₩2,340,000',
    },
  ];

  const summaryRow = {
  quantity: 600,          
  soldQuantity: 370,      
  type: '',              
  total: '₩10,827,000'
};

  return (
    <div className={styles.dashboardContainer}>
      {/* 예약 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>예약</h4>
        <div className={styles.cardGroup}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>누적 예약자</p>
            <p className={styles.cardValue}>7,265</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>오늘 예약자</p>
            <p className={styles.cardValue}>3,671</p>
          </div>
        </div>
        <div className={styles.chartGrid}>
          <img src={GenderGraph} alt="성별 예약 현황" className={styles.chartImage} />
          <img src={AgeGraph} alt="연령 예약 현황" className={styles.chartImage} />
        </div>
        <img src={DateEntranceGraph} alt="날짜별 예약 현황" className={styles.fullWidthImage} />
      </div>

      {/* 입장 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>입장</h4>
        <div className={styles.checkinContainer}>
          <div className={styles.checkinHeader}>
            <h3>박람회 체크인 진행률</h3>
            <button className={styles.refreshBtn}>
              <FiRefreshCw className={styles.refreshIcon} />
              새로고침
            </button>
          </div>
          <div className={styles.checkinStats}>
            <div>
              <h2>156</h2>
              <p className={styles.checkinSub}>실제 입장수</p>
            </div>
            <div>
              <h2>200</h2>
              <p className={styles.checkinSub}>예약 티켓 수</p>
            </div>
          </div>
          <div className={styles.checkinRate}>
            <h1>78%</h1>
            <p className={styles.checkinSub}>체크인 진행율</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
          </div>
        </div>
        <img src={TimeEntranceGraph} alt="시간대별 입장" className={styles.fullWidthImage} />
      </div>

      {/* 결제 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>결제</h4>
        <div className={styles.cardGroup}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>결제 완료</p>
            <p className={styles.cardValue}>7,265</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>입금 대기</p>
            <p className={styles.cardValue}>3,671</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>취소/환불</p>
            <p className={styles.cardValue}>1</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>수익</p>
            <p className={styles.cardValue}>1</p>
          </div>
        </div>
        {/* 표 */}
        <DashboardTable columns={columns} data={data} summaryRow={summaryRow} />
      </div>
    </div>
  );
}

export default Dashboard;
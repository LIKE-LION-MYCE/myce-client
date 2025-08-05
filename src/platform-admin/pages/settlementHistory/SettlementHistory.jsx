import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FaDownload } from 'react-icons/fa'; // 🔄 바뀐 부분
import styles from './SettlementHistory.module.css';

import Tab from '../../../common/components/tab/Tab';
import SettlementHistoryTable from '../../components/settlementHistoryTable/SettlementHistoryTable';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';

function SettlementHistory() {
  const [currentTab, setCurrentTab] = useState('결제 완료');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchText, setSearchText] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleExcelDownload = () => {
    console.log('엑셀 다운로드 실행');
    triggerToast();
  };

  const pageSize = 10;

const allData = [
  {
    id: 1,
    title: '2025 귀농귀촌 체험 박람회',
    type: '박람회',
    settlementPeriod: '2025.07.01 ~ 2025.07.31',
    applicationDate: '2025.06.15',
    registrationFee: '1,500,000',
    ticketFee: '500,000',
    totalRevenue: '2,000,000',
    status: '종료',
  },
  {
    id: 2,
    title: '2025 촌캉스 라이프스타일 페어',
    type: '배너',
    settlementPeriod: '2025.07.15 ~ 2025.07.30',
    applicationDate: '2025.07.01',
    registrationFee: '1,000,000',
    ticketFee: '300,000',
    totalRevenue: '1,300,000',
    status: '진행중',
  },
  {
    id: 3,
    title: '전국 귀농 박람회 2025',
    type: '박람회',
    settlementPeriod: '2025.06.01 ~ 2025.06.30',
    applicationDate: '2025.05.20',
    registrationFee: '1,200,000',
    ticketFee: '400,000',
    totalRevenue: '1,600,000',
    status: '종료',
  },
  {
    id: 4,
    title: '시골 체험 박람회',
    type: '배너',
    settlementPeriod: '2025.08.01 ~ 2025.08.15',
    applicationDate: '2025.07.28',
    registrationFee: '1,100,000',
    ticketFee: '200,000',
    totalRevenue: '1,300,000',
    status: '진행중',
  },
  {
    id: 5,
    title: '청년 귀촌 캠프 in 전남',
    type: '박람회',
    settlementPeriod: '2025.05.01 ~ 2025.05.31',
    applicationDate: '2025.04.10',
    registrationFee: '1,300,000',
    ticketFee: '350,000',
    totalRevenue: '1,650,000',
    status: '종료',
  },
  {
    id: 6,
    title: '로컬 일상 페스티벌',
    type: '배너',
    settlementPeriod: '2025.06.20 ~ 2025.07.10',
    applicationDate: '2025.06.05',
    registrationFee: '1,250,000',
    ticketFee: '600,000',
    totalRevenue: '1,850,000',
    status: '종료',
  },
  {
    id: 7,
    title: '전국 청년 귀촌 박람회',
    type: '박람회',
    settlementPeriod: '2025.07.10 ~ 2025.07.20',
    applicationDate: '2025.06.25',
    registrationFee: '1,600,000',
    ticketFee: '400,000',
    totalRevenue: '2,000,000',
    status: '진행중',
  },
  {
    id: 8,
    title: '작은 도시 살기 캠페인',
    type: '배너',
    settlementPeriod: '2025.08.01 ~ 2025.08.31',
    applicationDate: '2025.07.15',
    registrationFee: '1,400,000',
    ticketFee: '500,000',
    totalRevenue: '1,900,000',
    status: '진행중',
  },
  {
    id: 9,
    title: '귀농귀촌 미래포럼',
    type: '박람회',
    settlementPeriod: '2025.06.10 ~ 2025.06.25',
    applicationDate: '2025.05.30',
    registrationFee: '1,350,000',
    ticketFee: '450,000',
    totalRevenue: '1,800,000',
    status: '종료',
  },
];


  const pageInfo = {
    content: allData,
    totalPages: 1,
    number: currentPage,
    size: pageSize,
    totalElements: 0,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.paymentContainer}>
      <Tab
        tabs={['전체', '박람회', '배너']}
        currentTab={currentTab}
        onChange={(tab) => setCurrentTab(tab)}
      />

      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(0);
              }}
              placeholder="예약 번호 검색"
              className={styles.input}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(0);
              }}
              className={styles.select}
            >
              <option value="desc">최신순</option>
              <option value="asc">오래된순</option>
            </select>
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.actionBtn} ${styles.qrBtn}`} // 필요 시 클래스명 바꿔도 돼
            onClick={handleExcelDownload}
          >
            <FaDownload className={styles.icon} />
            엑셀 추출
          </button>
        </div>
      </div>

      <SettlementHistoryTable data={pageInfo.content} />
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />

      {showToast && <ToastSuccess />}
    </div>
  );
}

export default SettlementHistory;
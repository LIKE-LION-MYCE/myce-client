import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './BannerApplications.module.css';

import Tab from '../../../common/components/tab/Tab';
import BannerApplicationTable from '../../components/bannerApplicationTable/BannerApplicationTable';
import Pagination from '../../../common/components/pagination/Pagination';

const bannerStatusMap = {
  PENDING_APPROVAL: '승인 대기',
  WAITING_PAYMENT: '결제 대기',
  ENDED: '게시 종료',
  REJECTED: '승인 거절',
};

function BannerApplications() {
  const [currentTab, setCurrentTab] = useState('결제 완료');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchText, setSearchText] = useState('');

  const pageSize = 10;

  const allData = [
    {
      id: 1,
      username: 'hj1234',
      name: '황지현',
      bannerName: '2025 귀농귀촌 박람회',
      bannerType: '사이드 배너',
      email: 'hj1234@naver.com',
      phone: '010-1234-5678',
      createdAt: '2025-08-01',
      status: 'PENDING_APPROVAL',
    },
    {
      id: 2,
      username: 'jiwoo',
      name: '김지우',
      bannerName: '전국 촌캉스 박람회',
      bannerType: '상단 배너',
      email: 'jiwoo@naver.com',
      phone: '010-3333-4444',
      createdAt: '2025-07-25',
      status: 'WAITING_PAYMENT',
    },
    {
      id: 3,
      username: 'minsoo',
      name: '최민수',
      bannerName: '2025 로컬 청년 페스타',
      bannerType: '하단 배너',
      email: 'minsoo@naver.com',
      phone: '010-7777-8888',
      createdAt: '2025-07-20',
      status: 'REJECTED',
    },
    {
      id: 4,
      username: 'junho',
      name: '박준호',
      bannerName: '청년창업 박람회',
      bannerType: '상단 배너',
      email: 'junho@naver.com',
      phone: '010-5555-6666',
      createdAt: '2025-07-15',
      status: 'ENDED',
    },
  ];

  const pageInfo = {
    content: allData,
    totalPages: 1,
    number: currentPage,
    size: pageSize,
    totalElements: allData.length,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.paymentContainer}>
      <Tab
        tabs={['승인 대기', '결제 대기', '승인 거절', '게시 종료']}
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
              placeholder="검색"
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
      </div>

      <BannerApplicationTable data={pageInfo.content} statusMap={bannerStatusMap} />
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
    </div>
  );
}

export default BannerApplications;
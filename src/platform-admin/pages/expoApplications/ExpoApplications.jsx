import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './ExpoApplications.module.css';

import Tab from '../../../common/components/tab/Tab';
import ExpoApplicationTable from '../../components/expoApplicationTable/ExpoApplicationTable';
import Pagination from '../../../common/components/pagination/Pagination';

function ExpoApplications() {
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
      gender: '여성',
      birth: '1995-01-01',
      expoName: '2025 귀농귀촌 박람회',
      email: 'hj1234@naver.com',
      phone: '010-1234-5678',
      createdAt: '2025-08-01',
      status: 'PENDING',
      adminCodes: ['HJ12A', 'XX34B', 'CD56C', 'RE78D', 'PL90E'],
    },
    {
      id: 2,
      username: 'jiwoo',
      name: '김지우',
      gender: '여성',
      birth: '1992-03-15',
      expoName: '전국 촌캉스 박람회',
      email: 'jiwoo@naver.com',
      phone: '010-3333-4444',
      createdAt: '2025-07-25',
      status: 'APPROVED',
      adminCodes: ['JW11X', 'OP22Y', 'GH33Z', 'LK44A', 'QZ55B'],
    },
    {
      id: 3,
      username: 'minsoo',
      name: '최민수',
      gender: '남성',
      birth: '1990-12-31',
      expoName: '2025 로컬 청년 페스타',
      email: 'minsoo@naver.com',
      phone: '010-7777-8888',
      createdAt: '2025-07-20',
      status: 'REJECTED',
      adminCodes: ['MS98Q', 'YU76W', 'BN65E', 'TR54D', 'EZ43R'],
    },
    {
      id: 4,
      username: 'minsoo',
      name: '최민수',
      gender: '남성',
      birth: '1990-12-31',
      expoName: '2025 로컬 청년 페스타',
      email: 'minsoo@naver.com',
      phone: '010-7777-8888',
      createdAt: '2025-07-20',
      status: 'CANCELED',
      adminCodes: ['MS98Q', 'YU76W', 'BN65E', 'TR54D', 'EZ43R'],
    },
    {
      id: 5,
      username: 'minsoo',
      name: '최민수',
      gender: '남성',
      birth: '1990-12-31',
      expoName: '2025 로컬 청년 페스타',
      email: 'minsoo@naver.com',
      phone: '010-7777-8888',
      createdAt: '2025-07-20',
      status: 'SETTLE_PENDING',
      adminCodes: ['MS98Q', 'YU76W', 'BN65E', 'TR54D', 'EZ43R'],
    },
    {
      id: 6,
      username: 'minsoo',
      name: '최민수',
      gender: '남성',
      birth: '1990-12-31',
      expoName: '2025 로컬 청년 페스타',
      email: 'minsoo@naver.com',
      phone: '010-7777-8888',
      createdAt: '2025-07-20',
      status: 'SETTLED',
      adminCodes: ['MS98Q', 'YU76W', 'BN65E', 'TR54D', 'EZ43R'],
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
        tabs={['승인 대기', '승인 완료', '승인 거절', '취소 완료','정산 대기','정산 완료']}
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
      </div>

      <ExpoApplicationTable data={pageInfo.content} />
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
    </div>
  );
}

export default ExpoApplications;

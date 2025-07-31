import styles from './Payments.module.css';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Tab from '../../../common/commponents/tab/Tab';
import PaymentTable from '../../components/paymentTable/PaymentTable';
import Pagination from '../../../common/commponents/pagination/Pagination';

function Payments() {
  const [currentTab, setCurrentTab] = useState('결제 완료'); // 필터링은 아직 미사용
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc'); // 최신순 기본
  const [searchText, setSearchText] = useState('');   // 예약번호 검색어

  const pageSize = 10;

  const columns = [
  { key: 'reservationNumber', header: '예약 번호' },
  { key: 'name', header: '이름' },
  { key: 'id', header: '아이디' },
  { key: 'gender', header: '성별' },
  { key: 'phone', header: '전화번호' },
  { key: 'email', header: '이메일' },
  { key: 'quantity', header: '수량' },
  { key: 'totalPrice', header: '총 결제 금액' },
  { key: 'paymentStatus', header: '결제 상태' },
];
  const allData = [
    {
      reservationNumber: '59217342',
      name: '황지현',
      id: 'hj1234',
      gender: '여',
      phone: '010-1234-5678',
      email: 'hj1234@naver.com',
      quantity: 5,
      totalPrice: '150,000원',
      paymentStatus: '결제 완료',
      createdAt: '2025-08-01T14:23:45',
    },
    {
      reservationNumber: '59217343',
      name: '김지우',
      id: 'jiwoo',
      gender: '여',
      phone: '010-3333-4444',
      email: 'jiwoo@naver.com',
      quantity: 3,
      totalPrice: '90,000원',
      paymentStatus: '결제 대기',
      createdAt: '2025-07-25T09:12:00',
    },
    {
      reservationNumber: '59217344',
      name: '최민수',
      id: 'minsoo',
      gender: '남',
      phone: '010-7777-8888',
      email: 'minsoo@naver.com',
      quantity: 1,
      totalPrice: '30,000원',
      paymentStatus: '결제 취소',
      createdAt: '2025-07-20T15:00:00',
    },
  ];

  const pageInfo = {
    content: allData, 
    totalPages: 0,
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
        tabs={['결제 완료', '결제 대기', '결제 취소']}
        currentTab={currentTab}
        onChange={(tab) => setCurrentTab(tab)}
      />

      {/*검색 & 정렬 */}
      <div className={styles.topControls}>
        <div className={styles.filters}>
          {/* 예약번호 검색 */}
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

          {/* 정렬 기준 */}
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

      <PaymentTable columns={columns} data={pageInfo.content} />
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
    </div>
  );
}

export default Payments;
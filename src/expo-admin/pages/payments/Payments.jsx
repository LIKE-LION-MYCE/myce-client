import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';
import styles from './Payments.module.css';

import Tab from '../../../common/commponents/tab/Tab';
import PaymentTable from '../../components/paymentTable/PaymentTable';
import Pagination from '../../../common/commponents/pagination/Pagination';
import ToastSuccess from '../../../common/commponents/toastSuccess/ToastSuccess';

function Payments() {
  const [currentTab, setCurrentTab] = useState('결제 완료');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchText, setSearchText] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleReissueQR = () => {
    console.log('QR 재발급');
    triggerToast();
  };

  const pageSize = 10;

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
      paymentStatus: '결제 완료',
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
        tabs={['결제 완료', '결제 취소']}
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
            className={`${styles.actionBtn} ${styles.qrBtn}`}
            onClick={handleReissueQR}
          >
            <FaQrcode className={styles.icon} />
            QR 재발급
          </button>
        </div>
      </div>

      <PaymentTable data={pageInfo.content} />
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />

      {showToast && <ToastSuccess />}
    </div>
  );
}

export default Payments;
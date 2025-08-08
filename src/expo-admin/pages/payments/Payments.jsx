import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import styles from './Payments.module.css';
import Tab from '../../../common/components/tab/Tab';
import PaymentTable from '../../components/paymentTable/PaymentTable';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { getExpoAdminPayment } from '../../../api/service/expo-admin/payment/PaymentService';

const tabLabels = ['전체', '예약 확정', '결제 대기', '예약 취소'];

const tabToEnumMap = {
  '전체': null,
  '예약 확정': 'CONFIRMED',
  '결제 대기': 'CONFIRMED_PENDING',
  '예약 취소': 'CANCELLED'
};

function Payments() {
  const { expoId } = useParams();

  const [searchType, setSearchType] = useState('phone');
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentTab, setCurrentTab] = useState('전체');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10); // 고정이라면 굳이 setPageSize 필요 없음

  const [pageInfo, setPageInfo] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    size: 0,
    totalElements: 0
  });

  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 5000);
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const statusParam = tabToEnumMap[currentTab];
        const res = await getExpoAdminPayment(
          expoId,
          currentPage,
          pageSize,
          sortOrder,
          statusParam ?? undefined
        );
        setPageInfo(res);
      } catch (error) {
        triggerToastFail(error.message);
      }
    };

    fetchPaymentData();
  }, [expoId, currentPage, pageSize, sortOrder, currentTab]);

  const handleTabChange = (index) => {
    const selectedTab = tabLabels[index];
    setCurrentTab(selectedTab);
    setCurrentPage(0); // 탭 바꾸면 첫 페이지로 초기화
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredData = pageInfo.content.filter((item) => {
    return (
      searchText.trim() === '' ||
      item[searchType]?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className={styles.paymentContainer}>
      <Tab
        tabs={tabLabels}
        onTabChange={handleTabChange}
      />

      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className={styles.select}
            >
              <option value="name">이름</option>
              <option value="phone">전화번호</option>
            </select>
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(0);
              }}
              className={styles.input}
              placeholder="검색어 입력"
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

      <PaymentTable data={filteredData} />

      <Pagination
        pageInfo={pageInfo}
        onPageChange={handlePageChange}
      />

      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default Payments;
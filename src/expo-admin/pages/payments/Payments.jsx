import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import styles from './Payments.module.css';
import Tab from '../../../common/components/tab/Tab';
import PaymentTable from '../../components/paymentTable/PaymentTable';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { getExpoAdminPayment } from '../../../api/service/expo-admin/payment/PaymentService';

function Payments() {
  const {expoId} = useParams();

  const [searchType, setSearchType] = useState('phone');
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentTab, setCurrentTab] = useState('전체');
  const [currentPage, setCurrentPage] = useState(0);

  const [data, setData] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const pageSize = 10;

  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 5000);
  };

  const fetchPaymentData = async () => {
    try {
      const res = await getExpoAdminPayment(expoId);
      setData(res); // API는 리스트 반환 형태
    } catch (error) {
      triggerToastFail(error.message);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  // 필터링 (탭 & 검색 적용 가능, 아직 UI만 구성됨)
  const filteredData = data.filter((item) => {
    const matchTab =
      currentTab === '전체' || item.reservationStatus === currentTab;

    const matchSearch =
      searchText.trim() === '' ||
      item[searchType]?.toLowerCase().includes(searchText.toLowerCase());

    return matchTab && matchSearch;
  });

  // 정렬
  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortOrder === 'asc') return dateA - dateB;
    if (sortOrder === 'desc') return dateB - dateA;
    if (sortOrder === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      return b.createdAt.slice(0, 10) === today ? -1 : 1;
    }

    return 0;
  });

  const startIndex = currentPage * pageSize;
  const pagedData = sortedData.slice(startIndex, startIndex + pageSize);

  const pageInfo = {
    content: pagedData,
    totalPages: Math.ceil(sortedData.length / pageSize),
    number: currentPage,
    size: pageSize,
    totalElements: sortedData.length,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.paymentContainer}>
      <Tab
        tabs={['전체', '예약 확정', '결제 대기', '예약 취소']}
        currentTab={currentTab}
        onChange={(tab) => {
          setCurrentTab(tab);
          setCurrentPage(0);
        }}
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
              <option value="today">오늘</option>
            </select>
          </div>
        </div>
      </div>

      <PaymentTable data={pageInfo.content} />
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />

      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default Payments;
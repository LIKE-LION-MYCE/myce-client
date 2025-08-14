import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import styles from './Payments.module.css';
import Tab from '../../../common/components/tab/Tab';
import PaymentTable from '../../components/paymentTable/PaymentTable';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { getExpoAdminPayment, getPaymentDetail } from '../../../api/service/expo-admin/payment/PaymentService';

const tabLabels = ['전체', '예약 확정', '결제 대기', '예약 취소'];

const tabToEnumMap = {
  전체: null,
  '예약 확정': 'CONFIRMED',
  '결제 대기': 'CONFIRMED_PENDING',
  '예약 취소': 'CANCELLED',
};

function Payments() {
  const { expoId } = useParams();

  // 검색/필터 상태
  const [searchType, setSearchType] = useState('phone'); // 'phone' | 'name'
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [currentTab, setCurrentTab] = useState('전체');

  // 페이지 상태 (size는 서버 기본값 사용)
  const [currentPage, setCurrentPage] = useState(0);

  // 서버 응답 페이지 정보
  const [pageInfo, setPageInfo] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    size: 0,
    totalElements: 0,
  });

  // 토스트
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 5000);
  };

  // 상세 조회 (reservationId로 조회)
  const fetchPaymentDetail = useCallback(async (reservationId) => {
    try {
      const res = await getPaymentDetail(expoId, reservationId);
      return Array.isArray(res) ? { reservers: res } : res;
    } catch (error) {
      triggerToastFail(error.message);
      throw error;
    }
  }, [expoId]);

  // 목록 조회
  useEffect(() => {
    (async () => {
      try {
        const statusParam = tabToEnumMap[currentTab];
        const trimmed = searchText.trim();
        const nameParam = searchType === 'name' ? (trimmed || null) : null;
        const phoneParam = searchType === 'phone' ? (trimmed || null) : null;

        const res = await getExpoAdminPayment(
          expoId,
          currentPage, // page만 전달
          sortOrder,
          statusParam ?? undefined,
          nameParam,
          phoneParam
        );

        setPageInfo({
          content: res.content ?? [],
          totalPages: res.page?.totalPages ?? 0,
          number: res.page?.number ?? 0,
          size: res.page?.size ?? 0,
          totalElements: res.page?.totalElements ?? 0,
        });
      } catch (error) {
        triggerToastFail(error.message);
      }
    })();
  }, [expoId, currentPage, sortOrder, currentTab, searchText, searchType]);

  // 탭 변경
  const handleTabChange = (index) => {
    const selectedTab = tabLabels[index];
    setCurrentTab(selectedTab);
    setCurrentPage(0);
  };

  // 페이지 변경
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className={styles.paymentContainer}>
      <Tab tabs={tabLabels} onTabChange={handleTabChange} />

      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setCurrentPage(0);
              }}
              className={styles.select}
            >
              <option value="phone">전화번호</option>
              <option value="name">이름</option>
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

      <PaymentTable data={pageInfo.content} fetchDetail={fetchPaymentDetail} />
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />

      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default Payments;
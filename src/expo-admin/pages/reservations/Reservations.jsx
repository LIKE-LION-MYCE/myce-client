import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { FaEnvelope, FaDownload, FaQrcode } from 'react-icons/fa';
import styles from './Reservations.module.css';
import Tab from '../../../common/components/tab/Tab';
import ReservationTable from '../../components/reservationTable/ReservationTable';
import Pagination from '../../../common/components/pagination/Pagination';
import EmailModal from '../../components/emailModal/EmailModal';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import { getMyExpoReservation } from '../../../api/service/expo-admin/reservation/ReservationService';
import { getExpoTicketNames } from '../../../api/service/expo-admin/reservation/ReservationService';

const tabLabels = ['전체', '입장 전', '입장 완료'];

function Reservations() {
  const { expoId } = useParams();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [currentTab, setCurrentTab] = useState('전체');
  const [searchType, setSearchType] = useState('phone');
  const [searchText, setSearchText] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketOptions, setTicketOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [pageInfo, setPageInfo] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    size: 0,
    totalElements: 0,
  });

  useEffect(() => {
    const fetchTicketNames = async () => {
      try {
      const names = await getExpoTicketNames(expoId);
      const sorted = (names ?? []).slice().sort((a, b) => a.localeCompare(b, 'ko-KR', { sensitivity: 'base' }));
      setTicketOptions(sorted);
      } catch (error) {
        triggerToastFail(error.message);
      }
    };
    fetchTicketNames();
  }, [expoId]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const entranceStatusParam = currentTab === '전체' ? undefined : currentTab;
        const trimmed = searchText.trim();
        const nameParam =
          searchType === 'name' ? (trimmed || undefined) : undefined;
        const phoneParam =
          searchType === 'phone' ? (trimmed || undefined) : undefined;
        const codeParam =
          searchType === 'reservationCode' ? (trimmed || undefined) : undefined;
        const ticketParam = ticketName || undefined;

        const res = await getMyExpoReservation(
          expoId,
          currentPage,
          pageSize,
          entranceStatusParam,
          nameParam,
          phoneParam,
          codeParam,
          ticketParam
        );

      setPageInfo({
      content: res.content ?? [],
      totalPages: res.page?.totalPages ?? 0,
      number: res.page?.number ?? 0,
      size: res.page?.size ?? pageSize,
      totalElements: res.page?.totalElements ?? 0,
      });

      } catch (error) {
        triggerToastFail(error.message);
      }
    };

    fetchReservations();
  }, [expoId, currentPage, pageSize, currentTab, searchText, searchType, ticketName]);

  //이메일 전송
  const handleSendEmail = (formData) => {
    console.log(
      '전송할 폼 데이터:',
      formData.get('subject'),
      formData.get('body'),
      formData.get('attachment')
    );
    setShowEmailModal(false);
    triggerSuccessToast();
  };

  //엑셀 다운로드
  const handleExcelDownload = () => {
    triggerSuccessToast();
  };

  //QR 재발급
  const handleReissueQR = () => {
    triggerSuccessToast();
  };

  //페이지 핸들링
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //탭 핸들링
  const handleTabChange = (index) => {
    const selectedTab = tabLabels[index];
    setCurrentTab(selectedTab);
    setCurrentPage(0);
  };

  //성공 토스트 팝업
  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  //실패 토스트 팝업
  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  return (
    <div className={styles.reservationsWrapper}>
      <Tab
        tabs={tabLabels}
        onTabChange={handleTabChange}
      />

      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchText('');
                setCurrentPage(0);
              }}
              className={styles.select}
            >
              <option value="phone">전화번호</option>
              <option value="reservationCode">예매번호</option>
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
              value={ticketName}
              onChange={(e) => {
                setTicketName(e.target.value);
                setCurrentPage(0);
              }}
              className={styles.select}
            >
              <option value="">티켓 분류</option>
              {ticketOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.actionBtn} ${styles.emailBtn}`}
            onClick={() => setShowEmailModal(true)}
          >
            <FaEnvelope className={styles.icon} />
            이메일 전송
          </button>
          <button
            className={`${styles.actionBtn} ${styles.excelBtn}`}
            onClick={handleExcelDownload}
          >
            <FaDownload className={styles.icon} />
            엑셀 추출
          </button>
          <button
            className={`${styles.actionBtn} ${styles.qrBtn}`}
            onClick={handleReissueQR}
          >
            <FaQrcode className={styles.icon} />
            QR 재발급
          </button>
        </div>
      </div>

      <ReservationTable data={pageInfo.content} />

      <Pagination
        pageInfo={pageInfo}
        onPageChange={handlePageChange}
      />

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        selectedCount={3}
        onSend={handleSendEmail}
      />

      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default Reservations;
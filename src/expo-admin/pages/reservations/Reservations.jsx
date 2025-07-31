import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FaEnvelope, FaDownload } from 'react-icons/fa';
import styles from './Reservations.module.css';
import Tab from '../../../common/commponents/tab/Tab';
import ReservationTable from '../../components/reservationTable/ReservationTable';
import Pagination from '../../../common/commponents/pagination/Pagination';
import EmailModal from '../../components/emailModal/EmailModal'; 

function Reservations() {
  const [searchType, setSearchType] = useState('phone');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false); 
  const [currentTab, setCurrentTab] = useState('입장 전');

  const [pageInfo, setPageInfo] = useState({
    content: [
      {
        reservationNumber: '59217342',
        name: '황지현',
        gender: '여',
        ismember : '아니오',
        id : null,
        phone: '010-1234-5678',
        email: 'hj1234@naver.com',
        ticketName: '2025 서울 스마트 모빌리티 엑스포 2일권',
        checkinDateTime: '2025-09-10 10:23:14',
        checkinStatus: '입장 완료',
      },
      {
        reservationNumber: '59217343',
        name: '김지우',
        gender: '여',
        ismember : '예',
        id : 'jiwoopokectmonjjoa@gmail.com',
        phone: '010-3333-4444',
        email: 'kimjiwoo@gmail.com',
        ticketName: '2025 서울 스마트 모빌리티 엑스포 1일권',
        checkinDateTime: '',
        checkinStatus: '입장 전',
      }
    ],
    totalPages: 2,
    totalElements: 12,
    size: 10,
    number: 0,
  });

  const handlePageChange = (page) => {
    console.log(`${page + 1} 페이지 요청`);
    setPageInfo((prev) => ({
      ...prev,
      number: page,
      content: prev.content,
    }));
  };

  const columns = [
    { key: 'reservationNumber', header: '예약 번호' },
    { key: 'name', header: '이름' },
    { key: 'gender', header: '성별' },
    { key: 'phone', header: '전화번호' },
    { key: 'email', header: '이메일' },
    { key: 'ticketName', header: '티켓명' },
    { key: 'checkinDateTime', header: '입장 일시' },
    { key: 'checkinStatus', header: '입장 여부' },
  ];

  const handleSendEmail = (formData) => {
    console.log('전송할 폼 데이터:', formData.get('subject'), formData.get('body'), formData.get('attachment'));
    setShowEmailModal(false);
  };

  return (
    <div className={styles.reservationsWrapper}>
      {/* 탭 */}
      <Tab
        tabs={['입장 전', '입장 완료']}
        currentTab={currentTab}
        onChange={setCurrentTab}
      />

      {/* 상단 검색 및 필터링 & 이메일/엑셀 추출 버튼*/}
      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className={styles.select}
            >
              <option value="phone">전화번호</option>
              <option value="reservationNumber">예매번호</option>
              {/* <option value={styles.dropdownMenu} value="name">이름</option> */}
              <option value="name">이름</option>
              
            </select>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={styles.input}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.select}
            >
              <option value="">티켓 분류</option>
              <option value="입장 완료">2025 서울 스마트 모빌리티 엑스포 1일권</option>
              <option value="입장 전">2025 서울 스마트 모빌리티 엑스포 2일권</option>
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
          <button className={`${styles.actionBtn} ${styles.excelBtn}`}>
            <FaDownload className={styles.icon} />
            엑셀 추출
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <ReservationTable columns={columns} data={pageInfo.content} />

      {/*페이징 */}
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />

      {/* 이메일 전송 모달 */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        selectedCount={3} // 실제 선택된 사용자 수로 변경 할 것
        onSend={handleSendEmail}
      />
    </div>
  );
}

export default Reservations;
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa'; // QR 코드 아이콘 추가
import styles from './RoleAdmins.module.css';
import RoleAdminTable from '../../components/roleAdminTable/RoleAdminTable';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess'; // ToastSuccess 컴포넌트 추가

function RoleAdmins() {
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showToast, setShowToast] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    content: [
      {
        id: 1,
        username: 'admin_hong',
        name: '홍길동',
        gender: '남성',
        birth: '1990-03-15',
        expoName: '2025 귀농귀촌 박람회',
        email: 'hong@example.com',
        phone: '010-1234-5678',
        createdAt: '2025-07-20',
        status: 'APPROVED',
        adminCodes: ['HK93A', 'LK12B', 'MT78Z', 'DS39P', 'XL51K'],
      },
      {
        id: 2,
        username: 'lee_admin',
        name: '이서윤',
        gender: '여성',
        birth: '1988-08-22',
        expoName: '전국 촌캉스 박람회',
        email: 'seoyoon@example.com',
        phone: '010-8765-4321',
        createdAt: '2025-06-10',
        status: 'PENDING_APPROVAL',
        adminCodes: ['LS55Q', 'WU44N', 'PY22M', 'XA89T', 'QN70C'],
      },
      {
        id: 3,
        username: 'kimjiho',
        name: '김지호',
        gender: '남성',
        birth: '1993-12-05',
        expoName: '2025 로컬 청년 페스타',
        email: 'jiho.kim@example.com',
        phone: '010-5555-1212',
        createdAt: '2025-08-01',
        status: 'WAITING_PAYMENT',
        adminCodes: ['KJ12B', 'NM34R', 'TC78E', 'AD91X', 'RP63D'],
      },
      {
        id: 4,
        username: 'choi_mina',
        name: '최민아',
        gender: '여성',
        birth: '1991-11-30',
        expoName: '귀농귀촌 미래 포럼',
        email: 'mina@example.com',
        phone: '010-2222-8888',
        createdAt: '2025-07-28',
        status: 'CANCELED',
        adminCodes: ['CM40L', 'UX15B', 'ND94V', 'BR80Z', 'VE72J'],
      },
      {
        id: 5,
        username: 'park_admin',
        name: '박지성',
        gender: '남성',
        birth: '1985-01-09',
        expoName: '2025 로컬 일상 페스티벌',
        email: 'jspark@example.com',
        phone: '010-0000-0000',
        createdAt: '2025-07-01',
        status: 'REJECTED',
        adminCodes: ['PJ89Q', 'SM11A', 'KH67Y', 'EL32W', 'ZD06K'],
      },
    ],
    totalPages: 1,
    totalElements: 5,
    size: 10,
    number: 0,
  });

  const handlePageChange = (page) => {
    setPageInfo((prev) => ({
      ...prev,
      number: page,
    }));
  };

  const handleReissueAdminCode = () => {
    console.log('관리자 코드 발급');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500); // 2.5초 뒤에 토스트 메시지 숨기기
  };

  return (
    <div className={styles.emailsWrapper}>
      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="아이디, 신청자, 박람회명 검색"
              className={styles.input}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={styles.select}
            >
              <option value="desc">최신순</option>
              <option value="asc">오래된순</option>
            </select>
          </div>
        </div>

        {/* 관리자 코드 발급 버튼 */}
        <button
          className={`${styles.actionBtn} ${styles.codeBtn}`}
          onClick={handleReissueAdminCode}
        >
          <FaQrcode className={styles.icon} />
          관리자 코드 발급
        </button>
      </div>

      {/* 테이블 */}
      <RoleAdminTable data={pageInfo.content} />

      {/* 페이징 */}
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />

      {/* 토스트 메시지 */}
      {showToast && <ToastSuccess message="관리자 코드가 발급되었습니다!" />}
    </div>
  );
}

export default RoleAdmins;
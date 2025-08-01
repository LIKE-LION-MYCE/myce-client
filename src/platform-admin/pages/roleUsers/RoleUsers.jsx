import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './RoleUsers.module.css';
import RoleUserTable from '../../components/roleUserTable/RoleUserTable';
import Pagination from '../../../common/commponents/pagination/Pagination';

function RoleUsers() {
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageInfo, setPageInfo] = useState({
    content: [
      {
        id: 1,
        username: 'user_hong',
        name: '홍길동',
        gender: '남성',
        birth: '1990-03-15',
        email: 'hong@example.com',
        phone: '010-1234-5678',
        createdAt: '2025-07-20 09:15:30',
        mileage: 3200,
        isActive: true,
      },
      {
        id: 2,
        username: 'lee_sy',
        name: '이서윤',
        gender: '여성',
        birth: '1992-08-10',
        email: 'seoyoon@example.com',
        phone: '010-8888-4444',
        createdAt: '2025-06-25 14:10:45',
        mileage: 15000,
        isActive: false,
      },
      {
        id: 3,
        username: 'kimjiho93',
        name: '김지호',
        gender: '남성',
        birth: '1993-12-05',
        email: 'jiho.kim@example.com',
        phone: '010-5555-1212',
        createdAt: '2025-08-01 17:45:00',
        mileage: 750,
        isActive: true,
      },
      {
        id: 4,
        username: 'minachoi',
        name: '최민아',
        gender: '여성',
        birth: '1989-04-18',
        email: 'mina@example.com',
        phone: '010-7777-9999',
        createdAt: '2025-07-28 11:00:00',
        mileage: 0,
        isActive: false,
      },
      {
        id: 5,
        username: 'jspark85',
        name: '박지성',
        gender: '남성',
        birth: '1985-01-09',
        email: 'jspark@example.com',
        phone: '010-0000-0000',
        createdAt: '2025-07-01 08:00:00',
        mileage: 4800,
        isActive: true,
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

  return (
    <div className={styles.emailsWrapper}>
      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="아이디, 이름 검색"
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
      </div>

      {/* 테이블 */}
      <RoleUserTable data={pageInfo.content} />

      {/* 페이징 */}
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
    </div>
  );
}

export default RoleUsers;
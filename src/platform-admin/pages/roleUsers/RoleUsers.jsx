import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './RoleUsers.module.css';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import RoleUserTable from '../../components/roleUserTable/RoleUserTable';
import Pagination from '../../../common/components/pagination/Pagination';
import { fetchMemberData, fetchFilteredData } from '../../../api/service/platform-admin/member/PlatformMemberService';

function RoleUsers() {

  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageInfo, setPageInfo] = useState([]);

  const fetchMembers= async () => {
    try {
      let resData;

      const isFiltered = searchText;

      if (isFiltered) {
        resData = await fetchFilteredData({
          page: currentPage,
          latestFirst: sortOrder === 'desc',
          keyword: searchText || '',
        });
      } else {
        resData = await fetchMemberData({
          page: currentPage,
          latestFirst: sortOrder === 'desc',
        });
      }
      console.log(resData);
      setPageInfo(resData);
    } catch (error) {
      console.error(error);
      triggerToastFail('데이터를 불러오지 못했습니다.');
    }
  }

  useEffect(() => {
    fetchMembers();
  }, [sortOrder, searchText, currentPage]);


  const handlePageChange = (page) => {
    console.log("페이지 변경,", page) ;
    setCurrentPage(page);
  };

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    console.log('setFailMessage');
    setTimeout(() => setShowFailToast(false), 3000);
  }

  return (
    <div className={styles.emailsWrapper}>
      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value)
                setCurrentPage(0);
              }}
              placeholder="아이디, 이름 검색"
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

      {/* 테이블 */}
      <RoleUserTable data={pageInfo.content} />

      {/* 페이징 */}
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default RoleUsers;
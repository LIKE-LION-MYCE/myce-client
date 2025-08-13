import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './ExpoCurrent.module.css';

import CurrentExpoTable from '../../components/currentExpoTable/CurrentExpoTable';
import Pagination from '../../../common/components/pagination/Pagination';
import { fetchCurrentExpos } from '../../../api/service/platform-admin/expo/ExpoService';

function ExpoCurrent() {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchText, setSearchText] = useState('');
  const [expoData, setExpoData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  // 박람회 운영관리 상태 매핑 (결제 후 ~ 완료)
  const operationStatuses = {
    '': '전체',
    'PENDING_PUBLISH': '게시 대기',
    'PUBLISHED': '게시중',
    'PENDING_CANCEL': '취소 대기',
    'PUBLISH_ENDED': '게시 종료',
    'SETTLEMENT_REQUESTED': '정산 요청',
    'COMPLETED': '종료됨',
    'CANCELLED': '취소 완료'
  };

  // 현재 박람회 데이터 로드
  const loadCurrentExpos = async () => {
    try {
      setLoading(true);
      console.log('상태 필터링 디버그:', { selectedStatus, sortOrder, searchText }); // 디버깅용
      const response = await fetchCurrentExpos({
        page: currentPage,
        pageSize,
        latestFirst: sortOrder === 'desc',
        status: selectedStatus || undefined,
        keyword: searchText
      });
      setExpoData(response);
    } catch (error) {
      console.error('현재 박람회 목록 조회 실패:', error);
      setExpoData({ content: [], totalPages: 0, totalElements: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentExpos();
  }, [selectedStatus, currentPage, sortOrder, searchText]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageInfo = {
    content: expoData.content,
    totalPages: expoData.totalPages,
    number: currentPage,
    size: pageSize,
    totalElements: expoData.totalElements,
  };

  return (
    <div className={styles.paymentContainer}>
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
              placeholder="박람회명 검색"
              className={styles.input}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(0);
              }}
              className={styles.select}
            >
              {Object.entries(operationStatuses).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
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

      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <CurrentExpoTable data={pageInfo.content} />
      )}
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
    </div>
  );
}

export default ExpoCurrent;

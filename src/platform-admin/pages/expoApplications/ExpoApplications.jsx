import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './ExpoApplications.module.css';

import ExpoApplicationTable from '../../components/expoApplicationTable/ExpoApplicationTable';
import Pagination from '../../../common/components/pagination/Pagination';
import { fetchAllExpos, fetchFilteredExpos } from '../../../api/service/platform-admin/expo/ExpoService';

function ExpoApplications() {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchText, setSearchText] = useState('');
  const [expos, setExpos] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  // 박람회 신청관리 상태 매핑 (결제 전 단계)
  const applicationStatuses = {
    '': '전체',
    'PENDING_APPROVAL': '승인 대기',
    'REJECTED': '승인 거절',
    'PENDING_PAYMENT': '결제 대기'
  };

  // 박람회 목록 데이터 로드
  const loadExpos = async () => {
    try {
      setLoading(true);
      const latestFirst = sortOrder === 'desc';
      
      console.log('상태 필터링 디버그:', { selectedStatus, latestFirst });
      
      let response;
      if (searchText.trim()) {
        // 검색어가 있을 때 필터링 API 사용
        response = await fetchFilteredExpos({
          page: currentPage,
          pageSize,
          latestFirst,
          keyword: searchText.trim(),
          status: selectedStatus || undefined
        });
      } else {
        // 검색어가 없을 때 전체 조회 API 사용
        response = await fetchAllExpos({
          page: currentPage,
          pageSize,
          latestFirst,
          status: selectedStatus || undefined
        });
      }
      
      setExpos(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('박람회 목록 조회 실패:', error);
      setExpos([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 의존성 변경 시 재로드
  useEffect(() => {
    loadExpos();
  }, [selectedStatus, currentPage, sortOrder, searchText]);

  const pageInfo = {
    content: expos,
    totalPages,
    number: currentPage,
    size: pageSize,
    totalElements: expos.length,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
              {Object.entries(applicationStatuses).map(([value, label]) => (
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          데이터를 불러오는 중...
        </div>
      ) : (
        <>
          <ExpoApplicationTable data={pageInfo.content} />
          <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}

export default ExpoApplications;

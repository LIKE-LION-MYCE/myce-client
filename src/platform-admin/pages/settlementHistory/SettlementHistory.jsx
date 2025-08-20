import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FaDownload } from 'react-icons/fa';
import styles from './SettlementHistory.module.css';

import Tab from '../../../common/components/tab/Tab';
import SettlementHistoryTable from '../../components/settlementHistoryTable/SettlementHistoryTable';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { fetchAllPaymentInfo, fetchFilteredPaymentInfo, callExcelDownload } from '../../../api/service/platform-admin/settlement-history/SettlementHistoryService';

const typeMap = [null, 'EXPO', 'AD'];

function SettlementHistory() {
  const [pageInfo, setPageInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchText, setSearchText] = useState('');
  const [currentTab, setCurrentTab] = useState('전체');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2500);
  };

  const triggerFailToast = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  const fetchSettlementData = async () => {
    try {
      let resData;
      const isFiltered = searchText || startDate || endDate || currentTab !== '전체';

      if (isFiltered) {
        resData = await fetchFilteredPaymentInfo({
          page: currentPage,
          latestFirst: sortOrder === 'desc',
          keyword: searchText,
          type: typeMap[currentTab],
          startDate,
          endDate,
        });
      } else {
        resData = await fetchAllPaymentInfo({
          page: currentPage,
          latestFirst: sortOrder === 'desc',
        });
      }

      setPageInfo({
        ...resData,
        number: currentPage,
      });
    } catch (err) {
      console.error(err);
      triggerFailToast('데이터를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchSettlementData();
  }, [currentPage, sortOrder, searchText, currentTab, startDate, endDate]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExcelDownload = async (e) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await callExcelDownload({
        keyword: searchText,
        type: typeMap[currentTab],
        startDate,
        endDate,
      });
      const contentDisposition = response.headers['content-disposition'];
      let fileName = '플랫폼_정산_내역_.xlsx';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = decodeURIComponent(fileNameMatch[1]);
        }
      }
      const url = window.URL.createObjectURL(new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      triggerSuccessToast();
    } catch (e) {
      triggerFailToast(e.message || '다운로드에 실패했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <Tab
        tabs={['전체', '박람회', '광고']}
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setCurrentPage(0);
        }}
      />

      <div className={styles.topControls}>
        <div className={styles.filters}>
          {/* 검색 */}
          <div className={styles.filterGroup}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(0);
              }}
              placeholder="제목 검색"
              className={styles.input}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          {/* 정렬 */}
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

        {/* 날짜 범위 + 엑셀 버튼 */}
        <form onSubmit={handleExcelDownload} className={styles.buttons}>
          <div className={styles.filterGroup}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <span className={styles.rangeSep}>~</span>

          <div className={styles.filterGroup}>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <button
            type="submit"
            className={`${styles.actionBtn} ${styles.qrBtn}`}
            disabled={isDownloading}
            title={isDownloading ? '다운로드 중...' : undefined}
          >
            <FaDownload className={styles.icon} />
            엑셀 추출
          </button>
        </form>
      </div>

      {pageInfo && (
        <>
          <SettlementHistoryTable data={pageInfo.content} />
          <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
        </>
      )}

      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default SettlementHistory;
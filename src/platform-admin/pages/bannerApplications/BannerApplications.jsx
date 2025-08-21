import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './BannerApplications.module.css';
import Tab from '../../../common/components/tab/Tab';
import BannerApplicationTable from '../../components/bannerApplicationTable/BannerApplicationTable';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastFail from "../../../common/components/toastFail/ToastFail";
import { fetchAllBanners, fetchFilteredBanners } from '../../../api/service/platform-admin/banner/BannerService';

const bannerStatusMap = {
  ALL: '전체',
  PENDING_APPROVAL: '승인 대기',
  PENDING_PAYMENT: '결제 대기',
  REJECTED: '승인 거절',
};

function BannerApplications() {
  const [pageInfo, setPageInfo] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');

  const [searchText, setSearchText] = useState('');
  const [currentTab, setCurrentTab] = useState('전체');

  const [isFilterMode, setIsFilterMode] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');


  const fetchBannerData = async () => {
    try {
      let resData;

      if (isFilterMode) {
        resData = await fetchFilteredBanners({
          page: currentPage,
          latestFirst: sortOrder === 'desc',
          keyword: searchText || '',
          status: convertTabToStatus(currentTab),
          isApply: true
        });
      } else {
        resData = await fetchAllBanners({
          page: currentPage,
          latestFirst: sortOrder === 'desc',
          isApply: true
        });
      }

      setPageInfo({
        ...resData,
        number: currentPage,
      });
    } catch (err) {
      console.error(err);
      triggerToastFail('데이터를 불러오지 못했습니다.');
    }
  };


  useEffect(() => {
    fetchBannerData();
  }, [isFilterMode, currentPage, sortOrder, searchText, currentTab]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    console.log('setFailMessage');
    setTimeout(() => setShowFailToast(false), 3000);
  }

  const convertTabToStatus = (tab) => {
    console.log(`convertTabToStatus: ${tab}`);
    switch (tab) {
      case 1:
        return 'PENDING_APPROVAL';
      case 2:
        return 'PENDING_PAYMENT';
      case 3:
        return 'REJECTED';
      default:
        return '';
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <Tab
        tabs={Object.values(bannerStatusMap)}
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setCurrentPage(0);
          if (tab === '전체') {
            setIsFilterMode(false);
          } else {s=
            setIsFilterMode(true);
          }
        }}
      />

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
              placeholder="검색"
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

      {pageInfo && (
        <>
          <BannerApplicationTable
            data={pageInfo.content}
            statusMap={bannerStatusMap}
          />
          <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
        </>
      )}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default BannerApplications;
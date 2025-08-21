import React, { useState, useEffect } from 'react';
import Pagination from '../../../common/components/pagination/Pagination';
import styles from './AdPositionList.module.css';
import { FaCheckCircle } from 'react-icons/fa';
import BannerLocationTable from '../../components/bannerLocationTable/BannerLocationTable';
import { fetchList } from '../../../api/service/platform-admin/setting/AdPositionSettingService';
import AdPositionNew from '../settingAdPositionDetail/AdPositionNew';

const columns = [
  { header: 'ID', key: 'id' },
  { header: '배너 이름', key: 'name' },
  { header: '생성일자', key: 'createdAt' },
  { header: '수정일자', key: 'updatedAt' },
  { header: '상태', key: 'status' },
];

const AdPositionList = () => {
  const [pageInfo, setPageInfo] = useState({
    content: [],
    number: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [openNew, setOpenNew] = useState(false);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getList = async () => {
    try {
      const res = await fetchList(currentPage);
      setPageInfo({
        ...res.data,
        number: res.data.page,
      });
    } catch (err) {
      console.error('fetch failed : ', err);
      setPageInfo({
        content: [],
        number: 0,
        totalPages: 0,
        totalElements: 0,
      });
    }
  };

  useEffect(() => {
    getList();
  }, [currentPage]);

  return (
    <div className={styles.operatorContainer}>
      <div className={styles.section}>
        <div className={styles.titleRow}>
          <h4 className={styles.sectionTitle}>광고 타입 설정</h4>
          <button className={styles.addBtn} onClick={() => setOpenNew(true)}>
            <FaCheckCircle className={styles.addIcon} /> 광고 등록
          </button>
        </div>

        <BannerLocationTable columns={columns} data={pageInfo.content} />
        <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
      </div>

      <AdPositionNew
        open={openNew}
        onClose={() => setOpenNew(false)}
        onCreated={getList}
      />
    </div>
  );
};

export default AdPositionList;
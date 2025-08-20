import React, { useState, useEffect } from 'react';
import Pagination from '../../../common/components/pagination/Pagination';
import styles from './AdPositionList.module.css';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import BannerLocationTable from '../../components/bannerLocationTable/BannerLocationTable';
import { fetchList } from '../../../api/service/platform-admin/setting/AdPositionSettingService';

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getList = async () => {
    try {
      const res = await fetchList(currentPage);
      setPageInfo({
        ...res.data,
        number: res.data.page, // 서버의 page 값을 number로 매핑
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
          <h4 className={styles.sectionTitle}>배너 타입 설정</h4>

          {/* 제목 옆 회색 필 버튼 (티켓 등록 버튼과 동일 스타일) */}
          <Link to="/platform/admin/adPosition/new">
            <button className={styles.addBtn}>
              <FaCheckCircle className={styles.addIcon} /> 배너 등록
            </button>
          </Link>
        </div>

        <BannerLocationTable columns={columns} data={pageInfo.content} />

        <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default AdPositionList;
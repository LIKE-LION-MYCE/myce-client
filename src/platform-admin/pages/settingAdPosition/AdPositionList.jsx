import React, { useState, useEffect } from 'react';
import Pagination from '../../../common/components/pagination/Pagination';
import styles from './AdPositionList.module.css';
import { Link } from 'react-router-dom';
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
      console.log("fetch res : ", res);
      setPageInfo({
          ...res.data,
          number: res.data.page // 'page' 값을 'number'로 할당
      });
    } catch (err) {
      console.error("fetch failed : ", err);
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
    console.log("currentPage : ",currentPage);
  }, [currentPage]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>배너 타입 설정</h1>
        <Link to="/platform/admin/adPosition/new">
          <button className={styles.addButton}>새 템플릿 생성</button>
        </Link>
      </div>

      <BannerLocationTable columns={columns} data={pageInfo.content} />

      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
    </div>
  );
};

export default AdPositionList;

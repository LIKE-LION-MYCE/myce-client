import React, { useState } from 'react';
import Pagination from '../../../common/commponents/pagination/Pagination'; // 페이지네이션 컴포넌트
import styles from './BannerLocation.module.css'; // CSS 모듈
import { Link } from 'react-router-dom'; // 라우팅을 위한 Link 컴포넌트
import BannerLocationTable from '../../components/bannerLocationTable/BannerLocationTable';

// 더미 데이터 (테이블에 필요한)
const columns = [
  { header: 'ID', key: 'id' },
  { header: '배너 이름', key: 'name' },
  { header: '생성일자', key: 'createdAt' },
  { header: '수정일자', key: 'updatedAt' },
  { header: '상태', key: 'status' },
];

const initialData = [
  { id: 1, name: '배너 A', createdAt: '2023-01-01', updatedAt: '2023-01-02', status: '활성' },
  { id: 2, name: '배너 B', createdAt: '2023-02-01', updatedAt: '2023-02-02', status: '비활성' },
  { id: 3, name: '배너 C', createdAt: '2023-03-01', updatedAt: '2023-03-02', status: '활성' },
  // 추가적인 더미 데이터들...
];

const BannerLocation = () => {
  const [pageInfo, setPageInfo] = useState({
    totalPages: 10,
    number: 0, // 현재 페이지
  });

  const handlePageChange = (newPage) => {
    setPageInfo({ ...pageInfo, number: newPage });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>배너 타입 설정</h1>
        <Link to="/new">
         <button className={styles.addButton}>새 템플릿 생성</button>
        </Link>
      </div>

      <BannerLocationTable columns={columns} data={initialData} />

      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
    </div>
  );
};

export default BannerLocation;

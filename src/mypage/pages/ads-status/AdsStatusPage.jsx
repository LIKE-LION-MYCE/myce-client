import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAdvertisements } from '../../../api/service/user/memberApi';
import styles from "./AdsStatusPage.module.css";

// 상태 라벨 및 스타일 맵
const STATUS_MAP = {
  PENDING_APPROVAL: { label: "승인대기", className: "pending" },
  PENDING_PAYMENT: { label: "결제대기", className: "waiting" },
  PUBLISHED: { label: "게시중", className: "active" },
  REJECTED: { label: "거절됨", className: "canceled" },
  CANCELLED: { label: "취소됨", className: "canceled" },
  COMPLETED: { label: "게시완료", className: "finished" },
};

const ITEMS_PER_PAGE = 10;

// 상태별 스타일 클래스
const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING_APPROVAL':
    case 'PENDING_PAYMENT':
      return styles.statusPending;
    case 'PUBLISHED':
      return styles.statusActive;
    case 'COMPLETED':
      return styles.statusCompleted;
    case 'REJECTED':
    case 'CANCELLED':
      return styles.statusRejected;
    default:
      return styles.statusDefault;
  }
};

// 상태 라벨 매핑
const getStatusLabel = (status) => {
  return STATUS_MAP[status]?.label || status;
};

// 날짜 포맷팅
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR');
};

function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || { label: status, className: "" };
  return (
    <span className={`${styles.statusBadge} ${styles[info.className]}`}>
      {info.label}
    </span>
  );
}

function AdsTable({ data, onRowClick }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>제목</th>
            <th>광고 위치</th>
            <th>게시 기간</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ad) => (
            <tr
              key={ad.advertisementId}
              className={styles.clickableRow}
              tabIndex={0}
              onClick={() => onRowClick(ad)}
              style={{ cursor: "pointer" }}
              aria-label={`${ad.title} 상세로 이동`}
            >
              <td>{ad.title}</td>
              <td>{ad.adPositionName}</td>
              <td>{formatDate(ad.displayStartDate)} ~ {formatDate(ad.displayEndDate)}</td>
              <td>
                <StatusBadge status={ad.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        이전
      </button>
      
      <div className={styles.pageNumbers}>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const startPage = Math.max(0, currentPage - 2);
          const pageNumber = startPage + i;
          
          if (pageNumber >= totalPages) return null;
          
          return (
            <button
              key={pageNumber}
              className={`${styles.pageNumber} ${
                pageNumber === currentPage ? styles.active : ''
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber + 1}
            </button>
          );
        })}
      </div>
      
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        다음
      </button>
    </div>
  );
}

const AdsStatusPage = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // 광고 데이터 불러오기
  const fetchAdvertisements = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyAdvertisements(page, ITEMS_PER_PAGE);
      const { content, totalPages, totalElements, number } = response.data;
      
      setAdvertisements(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setCurrentPage(number);
    } catch (err) {
      console.error('광고 목록 조회 실패:', err);
      setError('광고 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      fetchAdvertisements(page);
    }
  };

  // 광고 상세 페이지로 이동
  const handleRowClick = (advertisement) => {
    navigate(`/mypage/ads-status/${advertisement.advertisementId}`);
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>내 광고 현황</h2>
        <div className={styles.summary}>
          총 {totalElements}개의 광고
        </div>
      </div>

      {advertisements.length === 0 ? (
        <div className={styles.emptyState}>
          <p>등록된 광고가 없습니다.</p>
        </div>
      ) : (
        <>
          <AdsTable data={advertisements} onRowClick={handleRowClick} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default AdsStatusPage;

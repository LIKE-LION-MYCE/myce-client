import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAdvertisements } from '../../../api/service/user/memberApi';
import styles from "./AdsStatusPage.module.css";
import settingStyles from "../../../expo-admin/pages/setting/Setting.module.css";

// 상태 라벨 및 스타일 맵
const STATUS_MAP = {
  PENDING_APPROVAL: { label: "승인 대기", className: "badgePENDING_APPROVAL" },
  PENDING_PAYMENT: { label: "결제 대기", className: "badgePENDING_PAYMENT" },
  PENDING_PUBLISH: { label: "게시 대기", className: "badgePENDING_PUBLISH" },
  PENDING_CANCEL: { label: "취소 대기", className: "badgePENDING_CANCEL" },
  PUBLISHED: { label: "게시 중", className: "badgePUBLISHED" },
  REJECTED: { label: "승인 거절", className: "badgeREJECTED" },
  CANCELLED: { label: "취소 완료", className: "badgeCANCELLED" },
  COMPLETED: { label: "종료됨", className: "badgeCOMPLETED" },
};

const ITEMS_PER_PAGE = 5;
const PAGE_BTN_COUNT = 5;

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
    <span className={`${settingStyles.badge} ${settingStyles[info.className]} ${styles.statusBadge}`}>
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


const AdsStatusPage = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // 광고 데이터 불러오기
  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyAdvertisements(currentPage - 1, ITEMS_PER_PAGE);
      const { content, totalPages, totalElements } = response.data;
      
      setAdvertisements(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
    } catch (err) {
      console.error('광고 목록 조회 실패:', err);
      setError('광고 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, [currentPage]);

  // 페이지네이션 렌더링
  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    const pages = [];

    // 이전 버튼
    if (currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => setCurrentPage(currentPage - 1)} className={styles.pageBtn}>
          이전
        </button>
      );
    }

    // 페이지 번호들 (현재 페이지 기준 ±2)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`${styles.pageBtn} ${i === currentPage ? styles.active : ''}`}
        >
          {i}
        </button>
      );
    }

    // 다음 버튼
    if (currentPage < totalPages) {
      pages.push(
        <button key="next" onClick={() => setCurrentPage(currentPage + 1)} className={styles.pageBtn}>
          다음
        </button>
      );
    }

    return pages;
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
          {/* 페이지네이션 버튼 영역 */}
          <div className={styles.pagination}>
            {renderPaginationButtons()}
          </div>
        </>
      )}
    </div>
  );
};

export default AdsStatusPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdsStatusPage.module.css";

// 광고 상태 라벨 및 스타일 맵
const STATUS_MAP = {
  PENDING: { label: "승인 대기", className: "pending" },
  WAITING: { label: "결제 대기중", className: "waiting" },
  ACTIVE: { label: "게시중", className: "active" },
  CANCELED: { label: "취소됨", className: "canceled" },
  FINISHED: { label: "종료됨", className: "finished" },
};

// 더미 광고 데이터
const ads = [
  {
    id: 1,
    title: "제7회 불교박람회 배너A",
    applicant: "홍길동",
    period: "????.??.?? ~ ????.??.??",
    type: "배너A",
    status: "PENDING",
  },
  {
    id: 2,
    title: "제7회 불교박람회 배너A",
    applicant: "홍길동",
    period: "????.??.?? ~ ????.??.??",
    type: "배너A",
    status: "WAITING",
  },
  {
    id: 3,
    title: "제7회 불교박람회 배너A",
    applicant: "홍길동",
    period: "????.??.?? ~ ????.??.??",
    type: "배너A",
    status: "ACTIVE",
  },
  {
    id: 4,
    title: "제7회 불교박람회 배너A",
    applicant: "홍길동",
    period: "????.??.?? ~ ????.??.??",
    type: "배너A",
    status: "ACTIVE",
  },
  {
    id: 5,
    title: "제7회 불교박람회 배너A",
    applicant: "홍길동",
    period: "????.??.?? ~ ????.??.??",
    type: "배너A",
    status: "CANCELED",
  },
  {
    id: 6,
    title: "제7회 불교박람회 배너A",
    applicant: "홍길동",
    period: "????.??.?? ~ ????.??.??",
    type: "배너A",
    status: "CANCELED",
  },
  {
    id: 7,
    title: "제7회 불교박람회 배너A",
    applicant: "홍길동",
    period: "????.??.?? ~ ????.??.??",
    type: "배너A",
    status: "FINISHED",
  },
  {
    id: 8,
    title: "제7회 불교박람회 배너A",
    applicant: "홍길동",
    period: "????.??.?? ~ ????.??.??",
    type: "배너A",
    status: "FINISHED",
  },
];

// 페이지네이션 상수
const ITEMS_PER_PAGE = 8;
const PAGE_BTN_COUNT = 5;

// 상태 뱃지 컴포넌트
function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || { label: status, className: "" };
  return (
    <span className={`${styles.statusBadge} ${styles[info.className]}`}>
      {info.label}
    </span>
  );
}

// 테이블 컴포넌트
function AdsTable({ data, onRowClick }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>제목</th>
            <th>신청자</th>
            <th>게시 기간</th>
            <th>배너 타입</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ad) => (
            <tr
              key={ad.id}
              className={styles.clickableRow}
              tabIndex={0}
              onClick={() => onRowClick(ad.id)}
              style={{ cursor: "pointer" }}
              aria-label={`${ad.title} 상세로 이동`}
            >
              <td>{ad.title}</td>
              <td>{ad.applicant}</td>
              <td>{ad.period}</td>
              <td>{ad.type}</td>
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

// 페이지네이션 컴포넌트
function Pagination({ currentPage, totalPages, onPageChange }) {
  const currentRange = Math.floor((currentPage - 1) / PAGE_BTN_COUNT);
  const startPage = currentRange * PAGE_BTN_COUNT + 1;
  const endPage = Math.min(startPage + PAGE_BTN_COUNT - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.pagination}>
      {/* 이전 범위 */}
      <button
        onClick={() => onPageChange(startPage - 1)}
        disabled={startPage === 1}
        className={styles.pageBtn}
      >
        &laquo;
      </button>
      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageBtn}
      >
        이전
      </button>
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`${styles.pageBtn} ${
            num === currentPage ? styles.active : ""
          }`}
        >
          {num}
        </button>
      ))}
      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageBtn}
      >
        다음
      </button>
      {/* 다음 범위 */}
      <button
        onClick={() => onPageChange(endPage + 1)}
        disabled={endPage === totalPages}
        className={styles.pageBtn}
      >
        &raquo;
      </button>
    </div>
  );
}

// 메인 컴포넌트
const AdsStatusPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageAds, setPageAds] = useState([]);
  const totalPages = Math.ceil(ads.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    setPageAds(ads.slice(startIdx, startIdx + ITEMS_PER_PAGE));
  }, [currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>광고 현황</h2>
      <AdsTable data={pageAds} onRowClick={(id) => navigate(`/ads/${id}`)} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdsStatusPage;

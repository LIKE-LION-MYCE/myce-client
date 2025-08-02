import React, { useState, useEffect } from "react";
import styles from "./MyPaymentPage.module.css";
import { Link } from "react-router-dom";

// 더미 전체 데이터 (백엔드에서 받아올 형태와 유사)
const allDummyPayments = [
  {
    id: "P001",
    date: "2024-01-15",
    expo: "2024 서울 모터쇼",
    amount: 25000,
    status: "DONE",
  },
  {
    id: "P002",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P003",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P004",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P005",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P006",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P008",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P009",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P010",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P011",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P012",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P013",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
  {
    id: "P014",
    date: "2024-01-10",
    expo: "디지털 헬스케어 박람회",
    amount: 15000,
    status: "CANCELED",
  },
];

const ITEMS_PER_PAGE = 8; // 한 페이지 당 표시할 개수
const PAGE_BTN_COUNT = 5; // 페이지네이션에 한 번에 표시할 페이지 버튼 개수

function PaymentStatusBadge({ status }) {
  return (
    <span className={status === "DONE" ? styles.done : styles.canceled}>
      {status === "DONE" ? "결제 완료" : "취소 완료"}
    </span>
  );
}

function PaymentHistoryTable({ data }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>결제 번호</th>
          <th>날짜</th>
          <th>박람회</th>
          <th>금액</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.date}</td>
            <td>
              <Link to={`/reservation/${row.id}`} className={styles.expoLink}>
                {row.expo}
              </Link>
            </td>
            <td>
              <b>{row.amount.toLocaleString()}원</b>
            </td>
            <td>
              <PaymentStatusBadge status={row.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  // 현재 페이지가 속한 버튼 그룹의 시작, 끝 페이지 계산
  const currentRange = Math.floor((currentPage - 1) / PAGE_BTN_COUNT);
  const startPage = currentRange * PAGE_BTN_COUNT + 1;
  const endPage = Math.min(startPage + PAGE_BTN_COUNT - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.pagination}>
      {/* 이전 범위로 이동 */}
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

      {/* 페이지 번호 버튼들 */}
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

      {/* 다음 범위로 이동 */}
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

const MyPaymentPage = () => {
  const [payments, setPayments] = useState([]); // 현재 페이지 데이터
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allDummyPayments.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageData = allDummyPayments.slice(
      startIdx,
      startIdx + ITEMS_PER_PAGE
    );
    setPayments(pageData);
  }, [currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>결제 내역</h2>
      <PaymentHistoryTable data={payments} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MyPaymentPage;

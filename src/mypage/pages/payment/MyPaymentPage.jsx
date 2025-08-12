import React, { useState, useEffect } from "react";
import styles from "./MyPaymentPage.module.css";
import { Link } from "react-router-dom";
import { getPaymentHistory } from "../../../api/service/user/memberApi";

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
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, [currentPage]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPaymentHistory(currentPage - 1, ITEMS_PER_PAGE);
      const { content, totalPages: total } = response.data;
      
      // API 응답 구조에 맞게 데이터 변환
      const transformedData = content.map(payment => {
        let formattedDate = 'N/A';
        if (payment.paymentDate) {
          try {
            const date = new Date(payment.paymentDate);
            formattedDate = isNaN(date.getTime()) ? 'N/A' : date.toISOString().split('T')[0];
          } catch (error) {
            console.warn('날짜 변환 실패:', payment.paymentDate, error);
          }
        }

        return {
          id: payment.paymentNumber || payment.id || 'N/A',
          date: formattedDate,
          expo: payment.expoTitle || payment.title || 'N/A',
          amount: payment.totalAmount || payment.amount || 0,
          status: payment.status === 'SUCCESS' ? 'DONE' : 'CANCELED'
        };
      });
      
      setPayments(transformedData);
      setTotalPages(total);
    } catch (err) {
      console.error('결제 내역 조회 실패:', err);
      setError('결제 내역을 불러오는데 실패했습니다.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.pageTitle}>결제 내역</h2>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.pageTitle}>결제 내역</h2>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>결제 내역</h2>
      {payments.length > 0 ? (
        <>
          <PaymentHistoryTable data={payments} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className={styles.noData}>결제 내역이 없습니다.</div>
      )}
    </div>
  );
};

export default MyPaymentPage;

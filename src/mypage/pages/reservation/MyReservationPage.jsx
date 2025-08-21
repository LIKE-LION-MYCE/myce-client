import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./MyReservationPage.module.css";
import { getReservedExpos } from "../../../api/service/user/memberApi";

function ReservationCard({ reservation }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 예약 상태를 번역으로 변환하는 함수
  const getStatusLabel = (status) => {
    const statusMap = {
      'CANCELLED': '예약 취소',
      'CONFIRMED_PENDING': '결제 대기',
      'CONFIRMED': '예약 확정'
    };
    return statusMap[status] || status;
  };

  // 예약 상태에 따른 CSS 클래스 반환
  const getStatusClass = (status) => {
    const statusClassMap = {
      'CANCELLED': styles.statusCancelled,
      'CONFIRMED_PENDING': styles.statusPending,
      'CONFIRMED': styles.statusConfirmed
    };
    return statusClassMap[status] || styles.statusDefault;
  };

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <h3>{reservation.title}</h3>
          <span className={`${styles.statusBadge} ${getStatusClass(reservation.reservationStatus)}`}>
            {getStatusLabel(reservation.reservationStatus)}
          </span>
        </div>
        <p>{t('reservation.reservationNumber')}: {reservation.reservationCode}</p>
        <div className={styles.detailRow}>
          <div>
            <strong>{t('reservation.ticketName')}</strong>
            <p>{reservation.ticketName}</p>
          </div>
          <div>
            <strong>{t('reservation.ticketCount')}</strong>
            <p>{reservation.ticketCount}{t('reservation.ticketUnit')}</p>
          </div>
          <div>
            <strong>{t('reservation.reservationDate')}</strong>
            <p>{new Date(reservation.createdAt).toLocaleDateString('ko-KR')}</p>
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate(`./${reservation.reservationId}`)}
          >
            {t('reservation.reservationDetail')}
          </button>
        </div>
      </div>
      <img
        src={reservation.thumbnailUrl || '/default-expo-image.jpg'}
        alt={reservation.title + " 포스터"}
        className={styles.poster}
      />
      
    </div>
  );
}

const MyReservationPage = () => {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchReservedExpos();
  }, [currentPage]);

  const fetchReservedExpos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReservedExpos(currentPage, 10, "createdAt,desc");
      
      setReservations(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
      setTotalElements(response.data?.totalElements || 0);
    } catch (err) {
      console.error('예매 내역 조회 실패:', err);
      setError(t('reservation.loadError'));
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    // 이전 버튼
    if (currentPage > 0) {
      pages.push(
        <button 
          key="prev" 
          className={styles.pageBtn} 
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {t('reservation.previous')}
        </button>
      );
    }

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageBtn} ${i === currentPage ? styles.active : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }

    // 다음 버튼
    if (currentPage < totalPages - 1) {
      pages.push(
        <button 
          key="next" 
          className={styles.pageBtn} 
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {t('reservation.next')}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        {pages}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h2 className={styles.pageTitle}>{t('reservation.title')}</h2>
          <div className={styles.loading}>{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h2 className={styles.pageTitle}>{t('reservation.title')}</h2>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>{t('reservation.title')}</h2>
        {reservations.length > 0 ? (
          <>
            <div className={styles.list}>
              {reservations.map((reservation) => (
                <ReservationCard 
                  key={reservation.reservationId} 
                  reservation={reservation}
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <div className={styles.noData}>{t('reservation.noData')}</div>
        )}
      </div>
    </div>
  );
};

export default MyReservationPage;
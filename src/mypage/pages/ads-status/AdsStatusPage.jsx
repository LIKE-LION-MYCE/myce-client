import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getMyAdvertisements } from '../../../api/service/user/memberApi';
import styles from "./AdsStatusPage.module.css";
import settingStyles from "../../../expo-admin/pages/setting/Setting.module.css";

const ITEMS_PER_PAGE = 5;
const PAGE_BTN_COUNT = 5;

const AdsStatusPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const STATUS_MAP = {
    PENDING_APPROVAL: { label: t('mypageGeneral.adsStatus.status.PENDING_APPROVAL'), className: "badgePENDING_APPROVAL" },
    PENDING_PAYMENT: { label: t('mypageGeneral.adsStatus.status.PENDING_PAYMENT'), className: "badgePENDING_PAYMENT" },
    PENDING_PUBLISH: { label: t('mypageGeneral.adsStatus.status.PENDING_PUBLISH'), className: "badgePENDING_PUBLISH" },
    PENDING_CANCEL: { label: t('mypageGeneral.adsStatus.status.PENDING_CANCEL'), className: "badgePENDING_CANCEL" },
    PUBLISHED: { label: t('mypageGeneral.adsStatus.status.PUBLISHED'), className: "badgePUBLISHED" },
    REJECTED: { label: t('mypageGeneral.adsStatus.status.REJECTED'), className: "badgeREJECTED" },
    CANCELLED: { label: t('mypageGeneral.adsStatus.status.CANCELLED'), className: "badgeCANCELLED" },
    COMPLETED: { label: t('mypageGeneral.adsStatus.status.COMPLETED'), className: "badgeCOMPLETED" },
  };

  const getStatusLabel = (status) => {
    return STATUS_MAP[status]?.label || status;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(i18n.language);
  };

  function StatusBadge({ status }) {
    const info = STATUS_MAP[status] || { label: status, className: "" };
    return (
      <span className={`${settingStyles.badge} ${settingStyles[info.className]} ${styles.statusBadge}`}>
        {info.label}
      </span>
    );
  }

  function AdsTable({ data, onRowClick, currentPage }) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>{t('mypageGeneral.adsStatus.table.title')}</th>
              <th>신청일</th>
              <th>게시 기간</th>
              <th>게시 장소</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ad, index) => (
              <tr
                key={ad.advertisementId}
                className={styles.clickableRow}
                tabIndex={0}
                onClick={() => onRowClick(ad)}
                style={{ cursor: "pointer" }}
                aria-label={t('mypageGeneral.adsStatus.aria.goToDetail', { title: ad.title })}
              >
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td>{ad.title}</td>
                <td>{formatDate(ad.createdAt || ad.displayStartDate)}</td>
                <td>{formatDate(ad.displayStartDate)} ~ {formatDate(ad.displayEndDate)}</td>
                <td>{ad.adPositionName}</td>
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

  const [advertisements, setAdvertisements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setError(t('mypageGeneral.adsStatus.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, [currentPage]);

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    const pages = [];

    if (currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => setCurrentPage(currentPage - 1)} className={styles.pageBtn}>
          {t('mypageGeneral.adsStatus.pagination.prev')}
        </button>
      );
    }

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

    if (currentPage < totalPages) {
      pages.push(
        <button key="next" onClick={() => setCurrentPage(currentPage + 1)} className={styles.pageBtn}>
          {t('mypageGeneral.adsStatus.pagination.next')}
        </button>
      );
    }

    return pages;
  };

  const handleRowClick = (advertisement) => {
    navigate(`/mypage/ads-status/${advertisement.advertisementId}`);
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>{t('common.loading')}</div>
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
      <h2 className={styles.pageTitle}>{t('mypageGeneral.adsStatus.title')}</h2>

      {advertisements.length === 0 ? (
        <div className={styles.emptyState}>
          <p>{t('mypageGeneral.adsStatus.noAds')}</p>
        </div>
      ) : (
        <>
          <AdsTable data={advertisements} onRowClick={handleRowClick} currentPage={currentPage} />
          <div className={styles.pagination}>
            {renderPaginationButtons()}
          </div>
        </>
      )}
    </div>
  );
};

export default AdsStatusPage;
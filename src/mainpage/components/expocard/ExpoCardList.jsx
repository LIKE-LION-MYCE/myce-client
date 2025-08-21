import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./ExpoCardList.module.css";
import { FiBookmark, FiBookmark as FiBookmarkFill } from "react-icons/fi";
import {
  saveFavorite,
  deleteFavorite,
} from "../../../api/service/user/FavoriteService";
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
// 메인 i18n.js에서 모든 리소스를 병합하므로 별도 import 불필요

export default function ExpoCardList({
  expos,
  error,
  onBookmarkActionComplete,
}) {
  const { t } = useTranslation();
  const [internalExpos, setInternalExpos] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (expos) {
      setInternalExpos(
        expos.map((expo) => ({ ...expo, isBookmark: expo.bookmark || false }))
      );
    }
  }, [expos]);

  const showSuccessMessage = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showFailMessage = (message) => {
    setToastMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  const handleBookmarkToggle = async (e, expoId) => {
    e.stopPropagation();
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      showFailMessage(t("homepage.expoCard.bookmark.loginRequired", "로그인이 필요한 서비스입니다"));
      return;
    }

    const currentExpo = internalExpos.find((expo) => expo.expoId === expoId);
    if (!currentExpo) return;

    try {
      let newIsBookmarkStatus;
      if (currentExpo.isBookmark) {
        newIsBookmarkStatus = await deleteFavorite(expoId);
      } else {
        newIsBookmarkStatus = await saveFavorite(expoId);
      }

      setInternalExpos((prevExpos) =>
        prevExpos.map((expo) =>
          expo.expoId === expoId
            ? { ...expo, isBookmark: newIsBookmarkStatus }
            : expo
        )
      );

      // Show success message
      if (newIsBookmarkStatus) {
        showSuccessMessage(t("homepage.expoCard.bookmark.added", "북마크에 추가되었습니다"));
      } else {
        showSuccessMessage(t("homepage.expoCard.bookmark.removed", "북마크에서 제거되었습니다"));
      }

      if (onBookmarkActionComplete) {
        onBookmarkActionComplete();
      }
    } catch (apiError) {
      console.error("Error toggling bookmark:", apiError);
      showFailMessage(t("homepage.expoCard.bookmark.error", "북마크 기능 처리 중 오류가 발생했습니다."));
    }
  };

  const handleCardClick = (expoId) => {
    navigate(`/detail/${expoId}`);
  };

  const toDotDate = (input) => {
    if (!input) return "";
    if (typeof input === "string") {
      const d = input.slice(0, 10);
      return d.replace(/-/g, ".");
    }
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  

  if (error) {
    return <div className={styles.error}>{t("homepage.errors.expos", "박람회를 불러오는데 실패했습니다")}: {error.message}</div>;
  }

  if (!internalExpos || internalExpos.length === 0) {
    return <div className={styles.noResults}>{t("homepage.common.noResults", "박람회가 없습니다.")}</div>;
  }

  return (
    <>
    <div className={styles.grid}>
      {internalExpos.map((expo) => (
        <div
          key={expo.expoId}
          className={styles.card}
          onClick={() => handleCardClick(expo.expoId)}
        >
          <img
            src={expo.thumbnailUrl}
            alt={expo.title}
            className={styles.thumbnail}
          />
          <div className={styles.overlay}>
            <p className={styles.remain}>
              {t("homepage.expoCard.remainingTickets", "남은 티켓 수량")} : {expo.remainingQuantity}{t("homepage.expoCard.ticketUnit", "개")}
            </p>
            <h3 className={styles.title}>{expo.title}</h3>
            <p className={styles.location}>
              {expo.location} {expo.locationDetail}
            </p>
            <p className={styles.date}>
              {toDotDate(expo.startDate)} ~ {toDotDate(expo.endDate)}
            </p>
          </div>
          <button
            className={styles.bookmark}
            onClick={(e) => handleBookmarkToggle(e, expo.expoId)}
            aria-label={t("homepage.expoCard.bookmark.toggle", "즐겨찾기 토글")}
          >
            {expo.isBookmark ? (
              <FiBookmarkFill size={20} fill="white" />
            ) : (
              <FiBookmark size={20} />
            )}
          </button>
        </div>
      ))}
    </div>
    {showSuccessToast && (
      <ToastSuccess message={toastMessage} onClose={() => setShowSuccessToast(false)} />
    )}
    {showFailToast && (
      <ToastFail message={toastMessage} onClose={() => setShowFailToast(false)} />
    )}
    </>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./GuestMainPageHeader.module.css";
import LanguageSelector from "../../../common/components/language/LanguageSelector";
import { useExpoData } from "../../../hooks/useExpoData";

const GuestMainPageHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { expos, setFilters } = useExpoData();

  // 현재 경로에 따라 activeMenu 설정
  useEffect(() => {
    const menuItems = [
      { name: t("nav.home"), path: "/" },
      { name: t("nav.expoList"), path: "/expo-list" },
      { name: t("nav.expoApply"), path: "/expo-apply" },
      { name: t("nav.adApply"), path: "/ad-apply" },
    ];

    const currentMenuItem = menuItems.find(item => item.path === location.pathname);
    setActiveMenu(currentMenuItem ? currentMenuItem.name : null);
  }, [location.pathname, t]);

  useEffect(() => {
    const handleDocumentClick = () => {
      setShowSearchResults(false);
    };

    if (showSearchResults) {
      document.addEventListener("click", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [showSearchResults]);

  const menuItems = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.expoList"), path: "/expo-list" },
    { name: t("nav.expoApply"), path: "/expo-apply" },
    { name: t("nav.adApply"), path: "/ad-apply" },
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.name);
    navigate(item.path);
  };

  const goToHome = () => {
    console.log("홈으로 이동");
    setActiveMenu(null);
    navigate("/");
  };

  const goToLogin = () => {
    console.log("로그인 페이지로 이동");
    navigate("/login");
  };

  const goToJoin = () => {
    console.log("회원가입 페이지로 이동");
    navigate("/signUp");
  };

  const goToStudy = () => {
    console.log("예매 확인 페이지로 이동");
    navigate("/guest-reservation");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      const filtered = expos.filter(
        (expo) =>
          expo.title.toLowerCase().includes(query.toLowerCase()) ||
          expo.location.toLowerCase().includes(query.toLowerCase()) ||
          (expo.categories &&
            expo.categories.some((cat) =>
              cat.toLowerCase().includes(query.toLowerCase())
            ))
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/expo-list?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (expo) => {
    navigate(`/detail/${expo.expoId || expo.id}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  return (
    <header className={styles.header}>
      {/* 상단 줄: 로고, 검색, 언어 선택 */}
      <div className={styles.topRow}>
        <div className={styles.leftGroup}>
          <div className={styles.topLeft} onClick={goToHome}>
            <img src="/myce_logo.png" alt="MYCE" className={styles.logo} />
          </div>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`${styles.navButton} ${activeMenu === item.name ? styles.active : ""
                }`}
              onClick={() => handleMenuClick(item)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div
          className={`${styles.searchContainer} ${showSearchResults && searchResults.length > 0
            ? styles.withDropdown
            : ""
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder={t("nav.searchPlaceholder")}
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
            />
            <button type="submit" className={styles.searchButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          {showSearchResults && searchResults.length > 0 && (
            <div className={styles.searchResultsDropdown}>
              {searchResults.slice(0, 5).map((expo) => (
                <div
                  key={expo.expoId || expo.id}
                  className={styles.searchResultItem}
                  onClick={() => handleSearchResultClick(expo)}
                >
                  <div className={styles.searchResultImage}>
                    <img
                      src={expo.thumbnailUrl || "/default-expo-image.jpg"}
                      alt={expo.title}
                      onError={(e) => {
                        e.target.src = "/default-expo-image.jpg";
                      }}
                    />
                  </div>
                  <div className={styles.searchResultContent}>
                    <div className={styles.searchResultTitle}>{expo.title}</div>
                    <div className={styles.searchResultLocation}>
                      {expo.location}
                    </div>
                    <div className={styles.searchResultDate}>
                      {expo.startDate &&
                        expo.endDate &&
                        `${new Date(expo.startDate).toLocaleDateString(
                          "ko-KR"
                        )} ~ ${new Date(expo.endDate).toLocaleDateString(
                          "ko-KR"
                        )}`}
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.length > 5 && (
                <div
                  className={styles.searchResultMore}
                  onClick={() =>
                    handleSearchSubmit({ preventDefault: () => { } })
                  }
                >
                  더 많은 결과 보기
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.rightActions}>
          <button className={styles.actionButton} onClick={goToLogin}>
            <svg
              className={styles.actionIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className={styles.actionText}>{t("nav.login")}</span>
          </button>
          <button className={styles.actionButton} onClick={goToJoin}>
            <svg
              className={styles.actionIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className={styles.actionText}>{t("nav.join")}</span>
          </button>
          <button className={styles.actionButton} onClick={goToStudy}>
            <svg
              className={styles.actionIcon}
              width="20"
              height="20"
              viewBox="0 0 512 512"
              fill="none"
              stroke="currentColor"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M366.05,146a46.7,46.7,0,0,1-2.42-63.42,3.87,3.87,0,0,0-.22-5.26L319.28,33.14a3.89,3.89,0,0,0-5.5,0l-70.34,70.34a23.62,23.62,0,0,0-5.71,9.24h0a23.66,23.66,0,0,1-14.95,15h0a23.7,23.7,0,0,0-9.25,5.71L33.14,313.78a3.89,3.89,0,0,0,0,5.5l44.13,44.13a3.87,3.87,0,0,0,5.26.22,46.69,46.69,0,0,1,65.84,65.84,3.87,3.87,0,0,0,.22,5.26l44.13,44.13a3.89,3.89,0,0,0,5.5,0l180.4-180.39a23.7,23.7,0,0,0,5.71-9.25h0a23.66,23.66,0,0,1,14.95-15h0a23.62,23.62,0,0,0,9.24-5.71l70.34-70.34a3.89,3.89,0,0,0,0-5.5l-44.13-44.13a3.87,3.87,0,0,0-5.26-.22A46.7,46.7,0,0,1,366.05,146Z" />
              <line x1="250.5" y1="140.44" x2="233.99" y2="123.93" />
              <line x1="294.52" y1="184.46" x2="283.51" y2="173.46" />
              <line x1="338.54" y1="228.49" x2="327.54" y2="217.48" />
              <line x1="388.07" y1="278.01" x2="371.56" y2="261.5" />
            </svg>
            <span className={styles.actionText}>
              {t("nav.reservationCheck")}
            </span>
          </button>
            <LanguageSelector />
        </div>
      </div>


    </header>
  );
};

export default GuestMainPageHeader;
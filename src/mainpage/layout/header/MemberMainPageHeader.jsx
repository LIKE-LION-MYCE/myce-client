import React, { useState, useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation 추가
import { useTranslation } from "react-i18next";
import styles from "./MemberMainPageHeader.module.css";
import NotificationButton from "../../components/notification/NotificationButton";
import LanguageSelector from "../../../common/components/language/LanguageSelector";
import { logout } from "../../../api/service/auth/AuthService";
import { getUserInfoFromToken } from "../../../api/utils/jwtUtils";
import { useExpoData } from "../../../hooks/useExpoData";

const MemberMainPageHeader = ({ notification }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { expos, setFilters } = useExpoData();

  // 사용자 권한 확인
  const token = localStorage.getItem("access_token");
  const userInfo = getUserInfoFromToken(token);
  const isPlatformAdmin = userInfo?.role === "PLATFORM_ADMIN";

  // 현재 경로에 따라 activeMenu 설정
  useEffect(() => {
    const menuItems = [
      { name: t("nav.home"), path: "/" },
      { name: t("nav.expoList"), path: "/expo-list" },
      { name: t("nav.expoApply"), path: "/expo-apply" },
      { name: t("nav.adApply"), path: "/ad-apply" },
      ...(isPlatformAdmin
        ? [
          {
            name: t("nav.platformAdmin"),
            path: "/platform/admin/dashboard/revenue",
          },
        ]
        : []),
    ];

    const currentMenuItem = menuItems.find(item => item.path === location.pathname);
    setActiveMenu(currentMenuItem ? currentMenuItem.name : null);
  }, [location.pathname, t, isPlatformAdmin]);

  // 외부 클릭 시 검색 결과 닫기
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
    ...(isPlatformAdmin
      ? [
        {
          name: t("nav.platformAdmin"),
          path: "/platform/admin/dashboard/revenue",
        },
      ]
      : []),
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.name);
    navigate(item.path); // 클릭된 메뉴의 path로 페이지 이동
  };

  const handleLogoClick = () => {
    setActiveMenu(null); // 메인 페이지로 이동 시 메뉴 활성화 상태 해제
    navigate("/"); // 메인 페이지로 이동
  };

  const handleMypageClick = () => {
    navigate("/mypage"); // 마이페이지 버튼 클릭 시 /mypage로 이동
  };

  // 검색 기능
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      // 검색어가 있을 때 필터링된 결과 표시
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
      // 검색 결과 페이지로 이동하면서 검색어 전달
      navigate(`/expo-list?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (expo) => {
    navigate(`/detail/${expo.expoId || expo.id}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleClickOutside = () => {
    setShowSearchResults(false);
  };

  const handleLogoutClick = () => {
    console.log("로그아웃 시도!");

    logout()
      .then((res) => {
        localStorage.removeItem("access_token");
        if (window.location.pathname.startsWith("/mypage")) {
          navigate("/");
        } else {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log("로그아웃에 실패했습니다.", err);
        alert("로그아웃에 실패했습니다.");
      });
  };

  return (
    <header className={styles.header}>
      {/* 상단 줄 */}
      <div className={styles.topRow}>
        {/* 로고, 메뉴, 검색창을 포함하는 왼쪽 그룹 */}
        <div className={styles.leftGroup}>
          <div className={styles.topLeft} onClick={handleLogoClick}>
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

        {/* 로그아웃, 마이페이지, 알림, 언어 선택을 포함하는 오른쪽 그룹 */}
        <div className={styles.rightGroup}>
          <button className={styles.actionButton} onClick={handleLogoutClick}>
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
            <span className={styles.actionText}>{t("nav.logout")}</span>
          </button>
          <button className={styles.actionButton} onClick={handleMypageClick}>
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
            <span className={styles.actionText}>{t("nav.mypage")}</span>
          </button>

          <NotificationButton notification={notification} />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default MemberMainPageHeader;

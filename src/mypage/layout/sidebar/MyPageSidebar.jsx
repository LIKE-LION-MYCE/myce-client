import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getMyInfo } from "../../../api/service/user/memberApi";
import { getGradeImagePath } from "../../../utils/gradeImageMapper";
import styles from "./MyPageSidebar.module.css";

const MyPageSidebar = () => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState({
    name: "로딩 중...",
    loginId: "",
    gradeDescription: "로딩 중...",
    gradeImageUrl: "",
    mileage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getMyInfo();
        const data = response.data;
        console.log('MyPageSidebar - 받은 데이터:', data);
        setUserInfo({
          name: data.name || "사용자",
          loginId: data.loginId || "",
          gradeDescription: data.gradeDescription || "일반 회원",
          gradeImageUrl: data.gradeImageUrl || "",
          mileage: data.mileage || 0
        });
        console.log('MyPageSidebar - 설정된 userInfo:', {
          name: data.name || "사용자",
          loginId: data.loginId || "",
          gradeDescription: data.gradeDescription || "일반 회원",
          gradeImageUrl: data.gradeImageUrl || "",
          mileage: data.mileage || 0
        });
        console.log('생성된 이미지 경로:', getGradeImagePath(data.gradeImageUrl));
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        setUserInfo({
          name: "사용자",
          loginId: "",
          gradeDescription: "일반 회원",
          gradeImageUrl: "",
          mileage: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileSection}>
        <img
          src={userInfo.gradeImageUrl ? `/images/grades/${userInfo.gradeImageUrl}` : '/images/grades/BRONZE.png'}
          alt="등급 이미지"
          className={styles.profileImg}
          onError={(e) => {
            console.log('이미지 로드 실패:', e.target.src);
            console.log('gradeImageUrl:', userInfo.gradeImageUrl);
            console.log('gradeDescription:', userInfo.gradeDescription);
            // 이미지 로드 실패 시 기본 아이콘으로 대체
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className={styles.profileIcon}
          style={{ display: 'none' }}
        >
          {userInfo.name.charAt(0).toUpperCase()}
        </div>
        <h3 className={styles.userName}>{userInfo.name}</h3>
        <p className={styles.loginId}>@{userInfo.loginId}</p>
        <p className={styles.grade}>{userInfo.gradeDescription}</p>
        <p className={styles.mileage}>
          <img src="/images/icons/mileage.png" alt="마일리지" className={styles.mileageIcon} />
          {t('mypageGeneral.mileage')} : {(userInfo.mileage || 0).toLocaleString()} point
        </p>
      </div>
      <nav className={styles.menu}>
        <ul>
          <li>
            <NavLink
              to="/mypage/info"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {t('mypageGeneral.userInfo')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mypage/reservation"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {t('mypageGeneral.reservation')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mypage/saved-expo"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {t('mypageGeneral.savedExpo')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mypage/system-settings"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {t('mypageGeneral.systemSettings')}
            </NavLink>
          </li>
        </ul>
        <div className={styles.sectionLabel}>{t('mypageGeneral.advertiserMenu')}</div>
        <ul>
          <li>
            <NavLink
              to="/mypage/ads-status"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {t('mypageGeneral.adStatusMenu')}
            </NavLink>
          </li>
        </ul>
        <div className={styles.sectionLabel}>{t('mypageGeneral.expoAdminMenu')}</div>
        <ul>
          <li>
            <NavLink
              to="/mypage/expo-status"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {t('mypageGeneral.expoStatusMenu')}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default MyPageSidebar;

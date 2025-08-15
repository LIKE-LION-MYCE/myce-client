import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getMyInfo } from "../../../api/service/user/memberApi";
import styles from "./MyPageSidebar.module.css";

const MyPageSidebar = () => {
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
        setUserInfo({
          name: data.name || "사용자",
          loginId: data.loginId || "",
          gradeDescription: data.gradeDescription || "일반 회원",
          gradeImageUrl: data.gradeImageUrl || "",
          mileage: data.mileage || 0
        });
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
        {userInfo.gradeImageUrl ? (
          <img
            src={userInfo.gradeImageUrl}
            alt="등급 이미지"
            className={styles.profileImg}
          />
        ) : (
          <div className={styles.profileIcon}>
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h3 className={styles.userName}>{userInfo.name}</h3>
        <p className={styles.loginId}>@{userInfo.loginId}</p>
        <p className={styles.grade}>{userInfo.gradeDescription}</p>
        <p className={styles.mileage}>
          <img src="/images/icons/mileage.png" alt="마일리지" className={styles.mileageIcon} />
          마일리지 : {userInfo.mileage.toLocaleString()} point
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
              회원 정보
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mypage/payment"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              결제 내역
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mypage/reservation"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              예매 내역
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mypage/saved-expo"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              찜한 박람회
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mypage/setting"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              시스템 설정
            </NavLink>
          </li>
        </ul>
        <div className={styles.sectionLabel}>광고주 메뉴</div>
        <ul>
          <li>
            <NavLink
              to="/mypage/ads-status"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              광고 현황
            </NavLink>
          </li>
        </ul>
        <div className={styles.sectionLabel}>박람회 관리자 메뉴</div>
        <ul>
          <li>
            <NavLink
              to="/mypage/expo-status"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              박람회 신청 현황
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default MyPageSidebar;

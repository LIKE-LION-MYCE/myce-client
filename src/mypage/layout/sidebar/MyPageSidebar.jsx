import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./MyPageSidebar.module.css";

const MyPageSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileSection}>
        <img
          src="/default-profile.png"
          alt="프로필"
          className={styles.profileImg}
        />
        <h3 className={styles.userName}>홍길동</h3>
        <p className={styles.grade}>초보 찍찍이</p>
        <p className={styles.mileage}>🪙 마일리지 : 100000 point</p>
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

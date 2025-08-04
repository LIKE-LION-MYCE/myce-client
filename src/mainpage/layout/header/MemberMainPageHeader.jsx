import React, { useState } from 'react';
import { IoNotifications } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import styles from './MemberMainPageHeader.module.css';

const MemberMainPageHeader = () => {
  const [activeMenu, setActiveMenu] = useState('박람회 목록');
  const navigate = useNavigate(); // useNavigate 훅 사용

  const menuItems = [
    { name: '박람회 목록', path: '/expo-list' },
    { name: '박람회 신청', path: '/expo-apply' },
    { name: '광고 신청', path: '/ad-apply' }
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.name);
    navigate(item.path); // 클릭된 메뉴의 path로 페이지 이동
  };

  const handleLogoClick = () => {
    setActiveMenu(null); // 메인 페이지로 이동 시 메뉴 활성화 상태 해제
    navigate('/'); // 메인 페이지로 이동
  };

  const handleMypageClick = () => {
    navigate('/mypage'); // 마이페이지 버튼 클릭 시 /mypage로 이동
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        {/* 로고 클릭 시 메인 페이지로 이동하는 핸들러 추가 */}
        <div className={styles.logo} onClick={handleLogoClick}>
          <img src="/myce_logo.png" alt="MYCE" className={styles.logoImage} />
        </div>
      </div>

      {/* Menu Section */}
      <div className={styles.menuSection}>
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`${styles.menuItem} ${activeMenu === item.name ? styles.active : ''}`}
            onClick={() => handleMenuClick(item)} // 수정된 핸들러 사용
          >
            <span className={styles.menuText}>{item.name}</span>
            <div className={styles.menuUnderline}></div>
          </button>
        ))}
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <div className={styles.notificationWrapper}>
          <IoNotifications className={styles.notificationIcon} size={20} />
          <div className={styles.notificationBadge}>2</div>
        </div>
        
        <button className={styles.logoutBtn}>로그아웃</button>
        <button className={styles.mypageBtn} onClick={handleMypageClick}>마이페이지</button>
      </div>
    </nav>
  );
};

export default MemberMainPageHeader;

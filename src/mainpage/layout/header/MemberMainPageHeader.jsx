import React, { useState, useEffect } from 'react';
import { IoNotifications } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import { useTranslation } from 'react-i18next';
import styles from './MemberMainPageHeader.module.css';
import NotificationButton from '../../components/notification/NotificationButton';
import LanguageSelector from '../../../common/components/language/LanguageSelector';
import { logout } from '../../../api/service/auth/AuthService';
import { useNotification } from '../../../context/NotificationContext';
import { getUserInfoFromToken } from '../../../api/utils/jwtUtils';

const MemberMainPageHeader = ({notification}) => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState(t('nav.expoList'));
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 사용자 권한 확인
  const token = localStorage.getItem('access_token');
  const userInfo = getUserInfoFromToken(token);
  const isPlatformAdmin = userInfo?.role === 'PLATFORM_ADMIN';

  // 언어 변경 시 activeMenu 업데이트
  useEffect(() => {
    if (!activeMenu || activeMenu === '박람회 목록') {
      setActiveMenu(t('nav.expoList'));
    }
  }, [t]);

  const menuItems = [
    { name: t('nav.expoList'), path: '/expo-list' },
    { name: t('nav.expoApply'), path: '/expo-apply' },
    { name: t('nav.adApply'), path: '/ad-apply' },
    ...(isPlatformAdmin ? [{ name: t('nav.platformAdmin'), path: '/platform/admin/dashboard/revenue' }] : [])
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

  const handleLogoutClick = () => {
    console.log('로그아웃 시도!');

    logout()
    .then(res => {
      localStorage.removeItem("access_token");
      if(window.location.pathname.startsWith("/mypage")) {
        navigate('/');
      } else {
        window.location.reload();
      }
    })
    .catch(err => {
      console.log("로그아웃에 실패했습니다.", err);
      alert("로그아웃에 실패했습니다.");
    });
  }

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
        <LanguageSelector />
        <NotificationButton notification = {notification}/>

        <button className={styles.logoutBtn} onClick={handleLogoutClick}>{t('nav.logout')}</button>
        <button className={styles.mypageBtn} onClick={handleMypageClick}>{t('nav.mypage')}</button>
      </div>
    </nav>
  );
};

export default MemberMainPageHeader;

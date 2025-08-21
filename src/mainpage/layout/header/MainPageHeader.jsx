import React, { useEffect, useState } from 'react';
import MemberMainPageHeader from './MemberMainPageHeader'; // 이름이 변경된 컴포넌트 임포트
import GuestMainPageHeader from './GuestMainPageHeader';

const MainPageHeader = ({notification}) => {
  // 로그인 상태를 관리하는 useState 훅을 사용합니다. 임시로 boolean값줘서 로그인 상태 바꾸기
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    // 초기 상태 확인
    checkAuth();

    // storage 이벤트 리스너 (다른 탭에서 변경 시 감지)
    window.addEventListener('storage', checkAuth);
    
    // 같은 탭에서 변경 감지를 위한 커스텀 이벤트
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  // 로그인 상태에 따라 다른 헤더 컴포넌트를 조건부 렌더링합니다.
  return (
    <>
      {isLoggedIn ? (
        <MemberMainPageHeader
        onLogout={handleLogout}
        notification = {notification} /> // 이름이 변경된 컴포넌트 사용
      ) : (
        <GuestMainPageHeader onLogin={handleLogin} />
      )}
    </>
  );
};

export default MainPageHeader;

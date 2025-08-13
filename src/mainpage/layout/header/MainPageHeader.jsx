import React, { useEffect, useState } from 'react';
import MemberMainPageHeader from './MemberMainPageHeader'; // 이름이 변경된 컴포넌트 임포트
import GuestMainPageHeader from './GuestMainPageHeader';

const MainPageHeader = () => {
  // 로그인 상태를 관리하는 useState 훅을 사용합니다. 임시로 boolean값줘서 로그인 상태 바꾸기
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if(localStorage.getItem("access_token")) {
      setIsLoggedIn(true);
    }
  });

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  // 로그인 상태에 따라 다른 헤더 컴포넌트를 조건부 렌더링합니다.
  return (
    <>
      {isLoggedIn ? (
        <MemberMainPageHeader onLogout={handleLogout} /> // 이름이 변경된 컴포넌트 사용
      ) : (
        <GuestMainPageHeader onLogin={handleLogin} />
      )}
    </>
  );
};

export default MainPageHeader;

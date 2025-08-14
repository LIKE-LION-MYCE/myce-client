import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { IoChevronForward } from 'react-icons/io5';
import styles from './ExpoAdminInfoBox.module.css';
import { getMyExpoInfo } from '../../../api/service/expo-admin/setting/ExpoInfoService';
import { getMyBusinessProfile } from '../../../api/service/expo-admin/operation/operationService';

function ExpoAdminInfoBox() {
  const { expoId } = useParams();
  const navigate = useNavigate();
  const [expoInfo, setExpoInfo] = useState({ title: '박람회 정보 로딩 중...' });
  const [companyLogo, setCompanyLogo] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('ExpoAdminInfoBox - expoId:', expoId);
      if (!expoId) return;

      try {
        // 로그인 타입 확인
        const token = localStorage.getItem('access_token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.loginType !== 'ADMIN_CODE');
        }

        // 박람회 정보 가져오기
        console.log('박람회 정보 API 호출 시작...');
        const expo = await getMyExpoInfo(expoId);
        console.log('박람회 정보 응답:', expo);
        setExpoInfo(expo);

        // 회사 로고 가져오기
        console.log('회사 프로필 API 호출 시작...');
        const businessProfile = await getMyBusinessProfile(expoId);
        console.log('회사 프로필 응답:', businessProfile);
        setCompanyLogo(businessProfile.logoUrl || '');
      } catch (error) {
        console.error('ExpoAdminInfoBox 데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, [expoId]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMyPageClick = () => {
    setIsDropdownOpen(false);
    navigate('/mypage');
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className={styles.expoInfoBoxContainer} ref={dropdownRef}>
      <div className={styles.expoInfoBox} onClick={handleProfileClick}>
        <img
          src={companyLogo || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzLjk5OTkgMTQuNjg2MyAxMy45OTk5IDE4QzEzLjk5OTkgMjEuMzEzNyAxNi42ODYzIDI0IDIwIDI0QzIzLjMxMzcgMjQgMjYgMjEuMzEzNyAyNiAxOEMyNiAxNC42ODYzIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0yMCAyNkMxNS41ODE3IDI2IDEyIDI5LjU4MTcgMTIgMzRIMjhDMjggMjkuNTgxNyAyNC40MTgzIDI2IDIwIDI2WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K"}
          alt="Company Logo"
          className={styles.expoImage}
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzLjk5OTkgMTQuNjg2MyAxMy45OTk5IDE4QzEzLjk5OTkgMjEuMzEzNyAxNi42ODYzIDI0IDIwIDI0QzIzLjMxMzcgMjQgMjYgMjEuMzEzNyAyNiAxOEMyNiAxNC42ODYzIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0yMCAyNkMxNS41ODE3IDI2IDEyIDI5LjU4MTcgMTIgMzRIMjhDMjggMjkuNTgxNyAyNC40MTgzIDI2IDIwIDI2WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K";
          }}
        />
        <span className={styles.expoName}>{expoInfo.title}</span>
        <IoChevronForward className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.dropdownArrowOpen : ''}`} />
      </div>
      
      {isDropdownOpen && (
        <div className={styles.dropdown}>
          {isAdmin && (
            <div className={styles.dropdownItem} onClick={handleMyPageClick}>
              마이페이지
            </div>
          )}
          <div className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
            로그아웃
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpoAdminInfoBox;

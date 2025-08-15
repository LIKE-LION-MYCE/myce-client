import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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
      if (!expoId) return;

      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.loginType !== 'ADMIN_CODE');
        }

        const expo = await getMyExpoInfo(expoId);
        setExpoInfo(expo);

        const businessProfile = await getMyBusinessProfile(expoId);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => setIsDropdownOpen((prev) => !prev);

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
      <button
        className={styles.expoInfoBox}
        onClick={handleProfileClick}
        type="button"
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
      >
        <img
          src={
            companyLogo ||
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzLjk5OTkgMTQuNjg2MyAxMy45OTk5IDE4QzEzLjk5OTkgMjEuMzEzNyAxNi42ODYzIDI0IDIwIDI0QzIzLjMxMzcgMjQgMjYgMjEuMzEzNyAyNiAxOEMyNiAxNC42ODYzIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0yMCAyNkMxNS41ODE3IDI2IDEyIDI5LjU4MTcgMTIgMzRIMjhDMjggMjkuNTgxNyAyNC40MTgzIDI2IDIwIDI2WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K"
          }
          alt="Company Logo"
          className={styles.expoImage}
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzLjk5OTkgMTQuNjg2MyAxMy45OTk5IDE4QzEzLjk5OTkgMjEuMzEzNyAxNi42ODYzIDI0IDIwIDI0QzIzLjMxMzcgMjQgMjYgMjEuMzEzNyAyNiAxOEMyNiAxNC42ODYzIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0yMCAyNkMxNS41ODE3IDI2IDEyIDI5LjU4MTcgMTIgMzRIMjhDMjggMjkuNTgxNyAyNC40MTgzIDI2IDIwIDI2WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K";
          }}
        />
        <span className={styles.expoName} title={expoInfo?.title || ''}>
          {expoInfo?.title}
        </span>
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdown} role="menu">
          {isAdmin && (
            <div className={styles.dropdownItem} role="menuitem" onClick={handleMyPageClick}>
              마이페이지
            </div>
          )}
          <div
            className={`${styles.dropdownItem} ${styles.logoutItem}`}
            role="menuitem"
            onClick={handleLogout}
          >
            로그아웃
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpoAdminInfoBox;
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getMemberInfo } from '../../../api/service/user/memberApi';
import styles from './PlatformAdminInfoBox.module.css';

function PlatformAdminInfoBox() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [memberInfo, setMemberInfo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const memberInfo = await getMemberInfo();

            setMemberInfo(memberInfo.data);
            try {
                const token = localStorage.getItem('access_token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setIsAdmin(decodedToken.role === 'PLATFORM_ADMIN');
                }
            } catch (error) {
                console.error('PlatformAdminInfoBox 데이터 로딩 실패:', error);
            }
        };

        fetchData();
    }, []);

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
        <div className={styles.platformInfoBoxContainer} ref={dropdownRef}>
            <button
                className={styles.platformInfoBox}
                onClick={handleProfileClick}
                type="button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="menu"
            >
                <span className={styles.adminName} title = {memberInfo?.name || "관리자 닉네임"}>
                    {memberInfo?.name || "-"}
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

export default PlatformAdminInfoBox;
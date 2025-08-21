import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
  menuClasses,
} from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AiOutlineBarChart } from 'react-icons/ai';
import { MdOutlineSummarize } from 'react-icons/md';
import { MdEventNote, MdOutlineOndemandVideo } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';

import PlatformAdminInfoBox from '../../components/InfoBox/PlatformAdminInfoBox';

function PlatformAdminSideBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [selectedMenu, setSelectedMenu] = useState('');
  // 한 번에 하나만 열리도록 유지: ['dashboard'] | ['expo'] | ['banner'] | ['role'] | ['setting'] | []
  const [openSubMenus, setOpenSubMenus] = useState([]);

  // 경로 이동 시 해당 서브메뉴만 열리게 처리
  useEffect(() => {
    setSelectedMenu(currentPath);

    if (currentPath.includes('/platform/admin/dashboard')) {
      setOpenSubMenus(['dashboard']);
    } else if (currentPath.includes('/platform/admin/expo')) {
      setOpenSubMenus(['expo']);
    } else if (currentPath.includes('/platform/admin/banner')) {
      setOpenSubMenus(['banner']);
    } else if (currentPath.includes('/platform/admin/role')) {
      setOpenSubMenus(['role']);
    } else if (currentPath.includes('/platform/admin/setting')) {
      setOpenSubMenus(['setting']);
    } else if (currentPath === '/platform/admin') {
      setOpenSubMenus(['dashboard']);
    } else {
      setOpenSubMenus([]);
    }
  }, [currentPath]);

  // 한 번에 하나만 열리도록 토글
  const toggleSubMenu = (menuKey) => {
    setOpenSubMenus((prev) => (prev.includes(menuKey) ? [] : [menuKey]));
  };

  // 대시보드(루트)에서 스크롤에 따라 해시 갱신 (선택사항)
  useEffect(() => {
    if (currentPath !== '/platform/admin/dashboard/revenue' && currentPath !== '/platform/admin/dashboard/usage') {
      return;
    }

    const handleScroll = () => {
      const revenueSection = document.getElementById('revenue');
      const usageSection = document.getElementById('usage');
      const scrollY = window.scrollY + 150;

      if (usageSection && scrollY >= usageSection.offsetTop) {
        if (location.hash !== '#usage') {
          window.history.replaceState(null, '', '#usage');
        }
      } else if (revenueSection && scrollY >= revenueSection.offsetTop) {
        if (location.hash !== '#revenue') {
          window.history.replaceState(null, '', '#revenue');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath, location.hash]);

  return (
    <Sidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: '#1e2a38',
          fontSize: '14px',
          fontWeight: '300',
          borderRight: '1px solid #1e2a38',
        },
      }}
    >
      <div
        style={{
          padding: '16px',
          backgroundColor: '#1e2a38',
          borderBottom: '1px solid #2b3c50ff',
        }}
      >
        <PlatformAdminInfoBox />
      </div>

      <Menu
        rootStyles={{
          [`.${menuClasses.button}`]: {
            color: '#fff',
            backgroundColor: '#1e2a38',
          },
          [`.${menuClasses.button}:hover`]: {
            backgroundColor: '#2c3e50',
          },
          [`.${menuClasses.active}`]: {
            backgroundColor: '#2c3e50',
          },
        }}
      >
        <MenuItem disabled style={{ cursor: 'default', opacity: '0.6' }}>
          Dashboards
        </MenuItem>

        <SubMenu
          icon={<AiOutlineBarChart />}
          label="대시 보드"
          open={openSubMenus.includes('dashboard')}
          onOpenChange={() => toggleSubMenu('dashboard')}
        >
          <MenuItem
            component={<Link to="/platform/admin/dashboard/revenue" />}
            active={selectedMenu === '/platform/admin/dashboard/revenue'}
          >
            수익 정산
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin/dashboard/usage" />}
            active={selectedMenu === '/platform/admin/dashboard/usage'}
          >
            이용량 조회
          </MenuItem>
        </SubMenu>

        <MenuItem
          icon={<MdOutlineSummarize />}
          component={<Link to="/platform/admin/settlementHistory" />}
          active={selectedMenu === '/platform/admin/settlementHistory'}
        >
          정산 내역
        </MenuItem>

        <MenuItem disabled style={{ cursor: 'default', opacity: '0.6' }}>
          Management
        </MenuItem>

        <SubMenu
          icon={<MdEventNote />}
          label="박람회 관리"
          open={openSubMenus.includes('expo')}
          onOpenChange={() => toggleSubMenu('expo')}
        >
          <MenuItem
            component={<Link to="/platform/admin/expoApplications" />}
            active={selectedMenu === '/platform/admin/expoApplications'}
          >
            박람회 신청 관리
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin/expoCurrent" />}
            active={selectedMenu === '/platform/admin/expoCurrent'}
          >
            현재 박람회 관리
          </MenuItem>
        </SubMenu>

        <SubMenu
          icon={<MdOutlineOndemandVideo />}
          label="광고 관리"
          open={openSubMenus.includes('banner')}
          onOpenChange={() => toggleSubMenu('banner')}
        >
          <MenuItem
            component={<Link to="/platform/admin/bannerApplications" />}
            active={selectedMenu === '/platform/admin/bannerApplications'}
          >
            광고 신청 관리
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin/bannerCurrent" />}
            active={selectedMenu === '/platform/admin/bannerCurrent'}
          >
            현재 광고 관리
          </MenuItem>
        </SubMenu>

        <SubMenu
          icon={<FaUserFriends />}
          label="권한 관리"
          open={openSubMenus.includes('role')}
          onOpenChange={() => toggleSubMenu('role')}
        >
          <MenuItem
            component={<Link to="/platform/admin/roleUsers" />}
            active={selectedMenu === '/platform/admin/roleUsers'}
          >
            일반 사용자 관리
          </MenuItem>
        </SubMenu>

        <MenuItem
          icon={<FiMessageSquare />}
          component={<Link to="/platform/admin/inquiry" />}
          active={selectedMenu === '/platform/admin/inquiry'}
        >
          문의
        </MenuItem>

        <MenuItem disabled style={{ cursor: 'default', opacity: '0.6' }}>
          Setting
        </MenuItem>

        <SubMenu
          icon={<FiSettings />}
          label="시스템 설정"
          open={openSubMenus.includes('setting')}
          onOpenChange={() => toggleSubMenu('setting')}
        >
          <MenuItem
            component={<Link to="/platform/admin/settingMessage" />}
            active={selectedMenu === '/platform/admin/settingMessage'}
          >
            발송 메시지 설정
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin/adPosition" />}
            active={selectedMenu === '/platform/admin/adPosition'}
          >
            광고 타입 설정
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin/settingAmount" />}
            active={selectedMenu === '/platform/admin/settingAmount'}
          >
            금액 설정
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}

export default PlatformAdminSideBar;
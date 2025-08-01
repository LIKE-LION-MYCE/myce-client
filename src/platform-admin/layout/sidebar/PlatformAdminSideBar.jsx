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

import {
  AiOutlineBarChart,
} from 'react-icons/ai';
import {
  MdEventNote,
  MdOutlineOndemandVideo,
} from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';

import PlatformAdminInfoBox from '../../components/PlatformAdminInfoBox.jsx/PlatformAdminInfoBox';

function PlatformAdminSideBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [selectedMenu, setSelectedMenu] = useState('');
  const [openSubMenus, setOpenSubMenus] = useState([]);

  useEffect(() => {
    setSelectedMenu(currentPath);
  }, [currentPath]);

  const toggleSubMenu = (menuKey) => {
    setOpenSubMenus((prev) =>
      prev.includes(menuKey)
        ? prev.filter((key) => key !== menuKey)
        : [...prev, menuKey]
    );
  };

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

        {/* 대시보드 */}
        {/* 하위탭들은 추후에 스크롤 값에 따라서 이동 및 활성화 되도록 수정 예정 */}
        <SubMenu
          icon={<AiOutlineBarChart />}
          label="대시 보드"
          open={openSubMenus.includes('dashboard')}
          onOpenChange={() => toggleSubMenu('dashboard')}
        >
          <MenuItem
            component={<Link to="/platform/admin" />}
            active={selectedMenu === '/platform/admin'}
          >
            수익 정산
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin" />}
            active={selectedMenu === '/platform/admin'}
          >
            이용량 조회
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin" />}
            active={selectedMenu === '/platform/admin'}
          >
            정산 내역
          </MenuItem>
        </SubMenu>

        <MenuItem disabled style={{ cursor: 'default', opacity: '0.6' }}>
          Management
        </MenuItem>

        {/* 박람회 관리 */}
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

        {/* 배너 관리 */}
        <SubMenu
          icon={<MdOutlineOndemandVideo />}
          label="배너 관리"
          open={openSubMenus.includes('banner')}
          onOpenChange={() => toggleSubMenu('banner')}
        >
          <MenuItem
            component={<Link to="/platform/admin/bannerApplications" />}
            active={selectedMenu === '/platform/admin/bannerApplications'}
          >
            배너 신청 관리
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin/bannerCurrent" />}
            active={selectedMenu === '/platform/admin/bannerCurrent'}
          >
            현재 배너 관리
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin/bannerCancelled" />}
            active={selectedMenu === '/platform/admin/bannerCancelled'}
          >
            배너 취소 관리
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin/bannerMessage" />}
            active={selectedMenu === '/platform/admin/bannerMessage'}
          >
            발송 메시지
          </MenuItem>
        </SubMenu>

        {/* 권한 관리 */}
        <SubMenu
          icon={<FaUserFriends />}
          label="권한 관리"
          open={openSubMenus.includes('role')}
          onOpenChange={() => toggleSubMenu('role')}
        >
          <MenuItem
            component={<Link to="/platform/admin/roleAccounts" />}
            active={selectedMenu === '/platform/admin/roleAccounts'}
          >
            박람회 관리자계정 관리
          </MenuItem>
          <MenuItem
            component={<Link to="/platform/admin/roleUsers" />}
            active={selectedMenu === '/platform/admin/roleUsers'}
          >
            일반 사용자 목록
          </MenuItem>
        </SubMenu>

        {/* 문의 */}
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

        {/* 시스템 설정 */}
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
            발송 메시지
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
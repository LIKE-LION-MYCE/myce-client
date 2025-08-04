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
import { MdEventNote } from 'react-icons/md';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';
import { FaUserFriends } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';

import ExpoAdminInfoBox from '../../components/InfoBox/ExpoAdminInfoBox';

function ExpoAdminSideBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [selectedMenu, setSelectedMenu] = useState('');
  const [openSubMenus, setOpenSubMenus] = useState([]); // <-- 타입 제거 (JS 전용)

  const expoPaths = ['/expo/admin/setting', '/expo/admin/booths', '/expo/admin/events'];
  const reservationPaths = ['/expo/admin/payments', '/expo/admin/reservations', '/expo/admin/emails'];

  useEffect(() => {
    setSelectedMenu(currentPath);
    if (expoPaths.includes(currentPath)) {
      setOpenSubMenus(['expo']);
    } else if (reservationPaths.includes(currentPath)) {
      setOpenSubMenus(['reservation']);
    } else {
      setOpenSubMenus([]);
    }
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
        <ExpoAdminInfoBox />
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
          [`.${menuClasses.subMenuRoot}`]: {
            backgroundColor: '#1e2a38',
          },
        }}
      >
        <MenuItem disabled style={{ cursor: 'default' , opacity: '0.6'}}>
          Dashboards
        </MenuItem>

        <MenuItem
          icon={<AiOutlineBarChart />}
          component={<Link to="/expo/admin" />}
          active={selectedMenu === '/expo/admin'}
        >
          대시 보드
        </MenuItem>

        <MenuItem disabled style={{ cursor: 'default' , opacity: '0.6'}}>
          Pages
        </MenuItem>

        <SubMenu
          icon={<MdEventNote />}
          label="박람회 관리"
          open={openSubMenus.includes('expo')}
          onOpenChange={() => toggleSubMenu('expo')}
        >
          <Menu>
            <MenuItem
              component={<Link to="/expo/admin/setting" />}
              active={selectedMenu === '/expo/admin/setting'}
            >
              박람회 상세
            </MenuItem>
            <MenuItem
              component={<Link to="/expo/admin/booths" />}
              active={selectedMenu === '/expo/admin/booths'}
            >
              참가 부스
            </MenuItem>
            <MenuItem
              component={<Link to="/expo/admin/events" />}
              active={selectedMenu === '/expo/admin/events'}
            >
              행사 일정
            </MenuItem>
          </Menu>
        </SubMenu>

        <SubMenu
          icon={<FaUserFriends />}
          label="예약 관리"
          open={openSubMenus.includes('reservation')}
          onOpenChange={() => toggleSubMenu('reservation')}
        >
          <Menu>
            <MenuItem
              component={<Link to="/expo/admin/payments" />}
              active={selectedMenu === '/expo/admin/payments'}
            >
              결제 내역
            </MenuItem>
            <MenuItem
              component={<Link to="/expo/admin/reservations" />}
              active={selectedMenu === '/expo/admin/reservations'}
            >
              예약자 리스트
            </MenuItem>
            <MenuItem
              component={<Link to="/expo/admin/emails" />}
              active={selectedMenu === '/expo/admin/emails'}
            >
              이메일 전송 이력
            </MenuItem>
          </Menu>
        </SubMenu>

        <MenuItem
          icon={<FiSettings />}
          component={<Link to="/expo/admin/operation" />}
          active={selectedMenu === '/expo/admin/operation'}
        >
          운영 설정
        </MenuItem>

        <MenuItem
          icon={<BiMoneyWithdraw />}
          component={<Link to="/expo/admin/settlement" />}
          active={selectedMenu === '/expo/admin/settlement'}
        >
          정산
        </MenuItem>

        <MenuItem
          icon={<FiMessageSquare />}
          component={<Link to="/expo/admin/inquiry" />}
          active={selectedMenu === '/expo/admin/inquiry'}
        >
          문의
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default ExpoAdminSideBar;
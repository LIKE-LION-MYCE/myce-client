import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
  menuClasses,
} from 'react-pro-sidebar';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AiOutlineBarChart } from 'react-icons/ai';
import { MdEventNote } from 'react-icons/md';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';
import { FaUserFriends } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';

import ExpoAdminInfoBox from '../../components/InfoBox/ExpoAdminInfoBox';

function ExpoAdminSideBar() {
  const location = useLocation();
  const { expoId } = useParams(); // ✅ 현재 expoId 추출
  const currentPath = location.pathname;

  const [selectedMenu, setSelectedMenu] = useState('');
  const [openSubMenus, setOpenSubMenus] = useState([]);

  const basePath = `/expos/${expoId}/admin`;

  const expoPaths = [`${basePath}/setting`, `${basePath}/booths`, `${basePath}/events`];
  const reservationPaths = [`${basePath}/payments`, `${basePath}/reservations`, `${basePath}/emails`];

  useEffect(() => {
    setSelectedMenu(currentPath);
    if (expoPaths.includes(currentPath)) {
      setOpenSubMenus(['expo']);
    } else if (reservationPaths.includes(currentPath)) {
      setOpenSubMenus(['reservation']);
    } else {
      setOpenSubMenus([]);
    }
  }, [currentPath, basePath]);

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
          }
        }}
      >
        <MenuItem disabled style={{ cursor: 'default', opacity: '0.6' }}>
          Dashboards
        </MenuItem>

        <MenuItem
          icon={<AiOutlineBarChart />}
          component={<Link to={`${basePath}`} />}
          active={selectedMenu === `${basePath}`}
        >
          대시 보드
        </MenuItem>

        <MenuItem disabled style={{ cursor: 'default', opacity: '0.6' }}>
          Pages
        </MenuItem>

        <SubMenu
          icon={<MdEventNote />}
          label="박람회 관리"
          open={openSubMenus.includes('expo')}
          onOpenChange={() => toggleSubMenu('expo')}
        >
          <MenuItem
            component={<Link to={`${basePath}/setting`} />}
            active={selectedMenu === `${basePath}/setting`}
          >
            박람회 상세
          </MenuItem>
          <MenuItem
            component={<Link to={`${basePath}/booths`} />}
            active={selectedMenu === `${basePath}/booths`}
          >
            참가 부스
          </MenuItem>
          <MenuItem
            component={<Link to={`${basePath}/events`} />}
            active={selectedMenu === `${basePath}/events`}
          >
            행사 일정
          </MenuItem>
        </SubMenu>

        <SubMenu
          icon={<FaUserFriends />}
          label="예약 관리"
          open={openSubMenus.includes('reservation')}
          onOpenChange={() => toggleSubMenu('reservation')}
        >
          <MenuItem
            component={<Link to={`${basePath}/payments`} />}
            active={selectedMenu === `${basePath}/payments`}
          >
            예약 내역
          </MenuItem>
          <MenuItem
            component={<Link to={`${basePath}/reservations`} />}
            active={selectedMenu === `${basePath}/reservations`}
          >
            예약자 리스트
          </MenuItem>
          <MenuItem
            component={<Link to={`${basePath}/emails`} />}
            active={selectedMenu === `${basePath}/emails`}
          >
            이메일 전송 이력
          </MenuItem>
        </SubMenu>

        <MenuItem
          icon={<FiSettings />}
          component={<Link to={`${basePath}/operation`} />}
          active={selectedMenu === `${basePath}/operation`}
        >
          운영 설정
        </MenuItem>

        <MenuItem
          icon={<BiMoneyWithdraw />}
          component={<Link to={`${basePath}/settlement`} />}
          active={selectedMenu === `${basePath}/settlement`}
        >
          정산
        </MenuItem>

        <MenuItem
          icon={<FiMessageSquare />}
          component={<Link to={`${basePath}/inquiry`} />}
          active={selectedMenu === `${basePath}/inquiry`}
        >
          문의
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default ExpoAdminSideBar;
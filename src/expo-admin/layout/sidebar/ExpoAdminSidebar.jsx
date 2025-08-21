import { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses, menuClasses } from 'react-pro-sidebar';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { AiOutlineBarChart } from 'react-icons/ai';
import { MdEventNote } from 'react-icons/md';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';
import { FaUserFriends, FaQrcode } from 'react-icons/fa';
import { usePermission } from '../../permission/PermissionContext';
import ExpoAdminInfoBox from '../../components/InfoBox/ExpoAdminInfoBox';

function ExpoAdminSideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { expoId } = useParams();
  const { perm } = usePermission();

  const currentPath = location.pathname;
  const [selectedMenu, setSelectedMenu] = useState('');
  // 하나만 열리도록: ['expo'] | ['reservation'] | []
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

  // 한 번에 하나만 열리도록 토글
  const toggleSubMenu = (menuKey) => {
    setOpenSubMenus((prev) => (prev.includes(menuKey) ? [] : [menuKey]));
  };

  const go = (path) => () => navigate(path);

  const can = {
    dashboard: true,
    setting: !!perm?.isExpoDetailUpdate,
    booths: !!perm?.isBoothInfoUpdate,
    events: !!perm?.isScheduleUpdate,
    payments: !!perm?.isPaymentView,
    reservations: !!perm?.isReserverListView,
    emails: !!perm?.isEmailLogView,
    operation: !!perm?.isOperationsConfigUpdate,
    settlement: !!perm?.isSettlementView,
    inquiry: !!perm?.isInquiryView,
  };

  const disabledStyle = { cursor: 'not-allowed', color: '#838383ff' };

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
          padding: '8px',
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
            backgroundColor: '#2c3e50'
          },
          [`.${menuClasses.subMenuRoot}`]: {
            backgroundColor: '#1e2a38',
          },
        }}
      >
        <MenuItem disabled style={{ cursor: 'default', opacity: 0.6 }}>
          Dashboards
        </MenuItem>

        <MenuItem
          icon={<AiOutlineBarChart />}
          onClick={go(`${basePath}`)}
          active={selectedMenu === `${basePath}`}
        >
          대시 보드
        </MenuItem>

        <MenuItem disabled style={{ cursor: 'default', opacity: 0.6 }}>
          QR CheckIn
        </MenuItem>

        <MenuItem
          icon={<FaQrcode />}
          onClick={go(`${basePath}/qrcheckin`)}
          active={selectedMenu === `${basePath}/qrcheckin`}
        >
          QR 체크인
        </MenuItem>

        <MenuItem disabled style={{ cursor: 'default', opacity: 0.6 }}>
          Pages
        </MenuItem>

        <SubMenu
          icon={<MdEventNote />}
          label="박람회 관리"
          open={openSubMenus.includes('expo')}
          onOpenChange={() => toggleSubMenu('expo')}
        >
          <MenuItem
            onClick={can.setting ? go(`${basePath}/setting`) : undefined}
            active={selectedMenu === `${basePath}/setting`}
            disabled={!can.setting}
            style={!can.setting ? disabledStyle : {}}
          >
            박람회 상세
          </MenuItem>

          <MenuItem
            onClick={can.booths ? go(`${basePath}/booths`) : undefined}
            active={selectedMenu === `${basePath}/booths`}
            disabled={!can.booths}
            style={!can.booths ? disabledStyle : {}}
          >
            참가 부스
          </MenuItem>

          <MenuItem
            onClick={can.events ? go(`${basePath}/events`) : undefined}
            active={selectedMenu === `${basePath}/events`}
            disabled={!can.events}
            style={!can.events ? disabledStyle : {}}
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
            onClick={can.payments ? go(`${basePath}/payments`) : undefined}
            active={selectedMenu === `${basePath}/payments`}
            disabled={!can.payments}
            style={!can.payments ? disabledStyle : {}}
          >
            예약 내역
          </MenuItem>

          <MenuItem
            onClick={can.reservations ? go(`${basePath}/reservations`) : undefined}
            active={selectedMenu === `${basePath}/reservations`}
            disabled={!can.reservations}
            style={!can.reservations ? disabledStyle : {}}
          >
            예약자 리스트
          </MenuItem>

          <MenuItem
            onClick={can.emails ? go(`${basePath}/emails`) : undefined}
            active={selectedMenu === `${basePath}/emails`}
            disabled={!can.emails}
            style={!can.emails ? disabledStyle : {}}
          >
            이메일 전송 이력
          </MenuItem>
        </SubMenu>

        <MenuItem
          icon={<FiSettings />}
          onClick={can.operation ? go(`${basePath}/operation`) : undefined}
          active={selectedMenu === `${basePath}/operation`}
          disabled={!can.operation}
          style={!can.operation ? disabledStyle : {}}
        >
          운영 설정
        </MenuItem>

        <MenuItem
          icon={<FiMessageSquare />}
          onClick={can.inquiry ? go(`${basePath}/inquiry`) : undefined}
          active={selectedMenu === `${basePath}/inquiry`}
          disabled={!can.inquiry}
          style={!can.inquiry ? disabledStyle : {}}
        >
          문의
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default ExpoAdminSideBar;
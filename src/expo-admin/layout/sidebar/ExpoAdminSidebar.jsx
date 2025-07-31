import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { AiOutlineBarChart } from 'react-icons/ai';
import { MdEventNote } from 'react-icons/md';
import { FiMessageSquare, FiSettings } from 'react-icons/fi'; 
import { FaUserFriends } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';

import ExpoAdminInfoBox from '../../components/InfoBox/ExpoAdminInfoBox'; 



//오픈소스 활용 - react-pro-sidebar, react-icons 설치(npm)
function ExpoAdminSideBar() {
  return (
    <Sidebar
      rootStyles={{
        backgroundColor: '#1e2a38',
        fontWeight: '300',
        fontSize:'14px',
        borderRight:'1px solid #1e2a38'
      }}
    >

          {/* 프로필 박스 */}
      <div style={{ padding : '16px', 
                    backgroundColor:'#1e2a38',
                    borderBottom: '1px solid #2b3c50ff'
                    }}>
        <ExpoAdminInfoBox />
      </div>
      <Menu
        menuItemStyles={{
          button: {
            color: '#fff',
            backgroundColor: '#1e2a38',
            '&:hover': {
              backgroundColor: '#2c3e50',
            },
            '&.active': {
              backgroundColor: '#34495e',
            },
          },
          label: {
            color: '#fff',
          },
          icon: {
            color: '#fff',
          },
        }}
      >
        {/* Dashboards */}
        <MenuItem disabled style={{ cursor: 'default'}}>
          Dashboards
        </MenuItem>

        <MenuItem icon={<AiOutlineBarChart />} component={<Link to="/expo/admin" />}>
          대시 보드
        </MenuItem>

        {/* Pages */}
        <MenuItem disabled style={{cursor: 'default' }}>
          Pages
        </MenuItem>

        <SubMenu icon={<MdEventNote />} label="박람회 관리">
          <MenuItem component={<Link to="/expo/admin/setting" />}>박람회 상세</MenuItem>
          <MenuItem component={<Link to="/expo/admin/booths" />}>참가 부스</MenuItem>
          <MenuItem component={<Link to="/expo/admin/events" />}>행사 일정</MenuItem>
        </SubMenu>

        <SubMenu icon={<FaUserFriends />} label="예약 관리">
          <MenuItem component={<Link to="/expo/admin/payments" />}>결제 내역</MenuItem>
          <MenuItem component={<Link to="/expo/admin/reservations" />}>예약자 리스트</MenuItem>
          <MenuItem component={<Link to="/expo/admin/emails" />}>이메일 전송 이력</MenuItem>
        </SubMenu>

        <MenuItem icon={<FiSettings/>} component={<Link to="/expo/admin/operation" />}>
          운영 설정
        </MenuItem>

        <MenuItem icon={<BiMoneyWithdraw />} component={<Link to="/expo/admin/settlement" />}>
          정산
        </MenuItem>
        <MenuItem icon={<FiMessageSquare />} component={<Link to="/expo/admin/inquiry" />}>
          문의
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default ExpoAdminSideBar;

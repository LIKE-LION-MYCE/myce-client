import { useLocation } from "react-router-dom";
import styles from './ExpoAdminHeader.module.css';

const pathMap = {
  '/expo/admin': ['대시보드'],
  '/expo/admin/setting': ['박람회 관리', '박람회 상세'],
  '/expo/admin/booths': ['박람회 관리', '참가 부스'],
  '/expo/admin/events': ['박람회 관리', '행사 일정'],
  '/expo/admin/payments': ['예약 관리', '결제 내역'],
  '/expo/admin/reservations': ['예약 관리', '예약자 리스트'],
  '/expo/admin/emails': ['예약 관리', '이메일 전송 이력'],
  '/expo/admin/entry': ['입장 관리'],
  '/expo/admin/operation': ['운영 설정'],
  '/expo/admin/settlement': ['정산'],
  '/expo/admin/inquiry': ['문의'],
};

function ExpoAdminHeader() {
  const location = useLocation();
  const currentPath = location.pathname;

  const matchedKey = Object.keys(pathMap)
    .sort((a, b) => b.length - a.length)
    .find((key) => currentPath.startsWith(key));

  const crumbs = matchedKey ? pathMap[matchedKey] : [];
  const isDashboard = matchedKey === '/expo/admin';

  return (
    <nav className={styles.breadcrumb}>
      <span className={`${styles.item} ${styles.prefix}`}>
        {isDashboard ? 'Dashboards' : 'Pages'}
      </span>
      {crumbs.map((label, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span
            key={idx}
            className={`${styles.item} ${isLast ? styles.active : ''}`}
          >
            {label}
          </span>
        );
      })}
    </nav>
  );
}

export default ExpoAdminHeader;

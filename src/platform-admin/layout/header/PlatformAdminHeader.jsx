import { useLocation } from "react-router-dom";
import styles from './PlatformAdminHeader.module.css';

const pathMap = {
  '/platform/admin/settlementHistory': ['정산', '정산 내역'],
  '/platform/admin/expoApplications': ['박람회 관리', '박람회 신청 관리'],
  '/platform/admin/expoCurrent': ['박람회 관리', '현재 박람회 관리'],
  '/platform/admin/bannerApplications': ['배너 관리', '배너 신청 관리'],
  '/platform/admin/bannerCurrent': ['배너 관리', '현재 배너 관리'],
  '/platform/admin/bannerCancelled': ['배너 관리', '배너 취소 관리'],
  '/platform/admin/bannerMessage': ['배너 관리', '발송 메시지'],
  '/platform/admin/roleAccounts': ['권한 관리', '관리자 계정'],
  '/platform/admin/roleUsers': ['권한 관리', '일반 사용자'],
  '/platform/admin/inquiry': ['문의'],
  '/platform/admin/settingMessage': ['시스템 설정', '발송 메시지'],
  '/platform/admin/settingAmount': ['시스템 설정', '금액 설정'],
  '/platform/admin': ['대시보드']
};

function PlatformAdminHeader() {
  const location = useLocation();
  const currentPath = location.pathname + location.hash;

  const matchedKey = Object.keys(pathMap)
    .sort((a, b) => b.length - a.length)
    .find((key) => currentPath.startsWith(key));

  const crumbs = matchedKey ? pathMap[matchedKey] : [];

  const isDashboardOnly =
    currentPath.startsWith('/platform/admin') && crumbs.length === 1 && crumbs[0] === '대시보드';

  return (
    <nav className={styles.breadcrumb}>
      <span className={`${styles.item} ${styles.prefix}`}>
        {isDashboardOnly ? 'Dashboards' : 'Pages'}
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

export default PlatformAdminHeader;
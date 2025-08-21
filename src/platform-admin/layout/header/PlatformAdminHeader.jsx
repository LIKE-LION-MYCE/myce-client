import { useLocation } from "react-router-dom";
import styles from './PlatformAdminHeader.module.css';

const pathMap = {
  '/platform/admin/settlementHistory': ['정산 내역'],
  '/platform/admin/expoApplications': ['박람회 관리', '박람회 신청 관리'],
  '/platform/admin/expoCurrent': ['박람회 관리', '현재 박람회 관리'],
  '/platform/admin/bannerApplications': ['광고 관리', '광고 신청 관리'],
  '/platform/admin/bannerCurrent': ['광고 관리', '현재 광고 관리'],
  '/platform/admin/roleAdmins': ['권한 관리', '관리자 계정'],
  '/platform/admin/roleUsers': ['권한 관리', '일반 사용자 관리'],
  '/platform/admin/inquiry': ['문의'],
  '/platform/admin/settingMessage': ['시스템 설정', '발송 메시지'],
  '/platform/admin/settingAmount': ['시스템 설정', '금액 설정'],
  '/platform/admin/bannerLocation': ['시스템 설정', '광고 위치 설정'],
  '/platform/admin/dashboard/usage': ['대시보드','이용량 조회'],
  '/platform/admin/dashboard/revenue': ['대시보드','수익 정산'],
  '/platform/admin/adPosition' : ['시스템 설정','광고 타입 설정']
};

const DASHBOARD_KEYS = new Set([
  '/platform/admin/settlementHistory',
  '/platform/admin/dashboard/usage',
  '/platform/admin/dashboard/revenue',
]);

const DASHBOARD_LAST_CRUMBS = new Set(['정산 내역', '이용량 조회', '수익 정산']);

const MANAGEMENT_FIRST_CRUMBS = new Set(['박람회 관리', '광고 관리', '권한 관리', '문의']);

function PlatformAdminHeader() {
  const location = useLocation();
  const currentPath = location.pathname + location.hash;

  const matchedKey = Object.keys(pathMap)
    .sort((a, b) => b.length - a.length)
    .find((key) => currentPath.startsWith(key));

  const crumbs = matchedKey ? pathMap[matchedKey] : [];

  let prefixLabel = 'Setting'; // 기본값

  if (matchedKey && DASHBOARD_KEYS.has(matchedKey)) {
    prefixLabel = 'Dashboards';
  } else if (crumbs.length && DASHBOARD_LAST_CRUMBS.has(crumbs[crumbs.length - 1])) {
    prefixLabel = 'Dashboards';
  } else if (crumbs.length && MANAGEMENT_FIRST_CRUMBS.has(crumbs[0])) {
    prefixLabel = 'Management';
  } else {
    // 그 외는 Setting 유지
    prefixLabel = 'Setting';
  }

  return (
    <nav className={styles.breadcrumb}>
      <span className={`${styles.item} ${styles.prefix}`}>
        {prefixLabel}
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
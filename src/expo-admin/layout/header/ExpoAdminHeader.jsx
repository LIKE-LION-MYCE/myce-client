import { useLocation } from "react-router-dom";
import styles from './ExpoAdminHeader.module.css';

const pathMap = {
  '/expos/:expoId/admin': ['대시보드'],
  '/expos/:expoId/admin/qrcheckin': ['QR 체크인'],
  '/expos/:expoId/admin/setting': ['박람회 관리', '박람회 상세'],
  '/expos/:expoId/admin/booths': ['박람회 관리', '참가 부스'],
  '/expos/:expoId/admin/events': ['박람회 관리', '행사 일정'],
  '/expos/:expoId/admin/payments': ['예약 관리', '예약 내역'],
  '/expos/:expoId/admin/reservations': ['예약 관리', '예약자 리스트'],
  '/expos/:expoId/admin/emails': ['예약 관리', '이메일 전송 이력'],
  '/expos/:expoId/admin/operation': ['운영 설정'],
  '/expos/:expoId/admin/inquiry': ['문의'],
};

// prefix 라벨 매핑
const prefixMap = {
  '/expos/:expoId/admin': 'Dashboards',
  '/expos/:expoId/admin/qrcheckin': 'QR CheckIn',
};

// 경로 내 :expoId를 무시하고 매칭하기 위한 헬퍼 함수
function normalizePath(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 3 && segments[0] === 'expos' && segments[2] === 'admin') {
    segments[1] = ':expoId'; // expoId 자리에 변수로 대체
  }
  return '/' + segments.join('/');
}

function ExpoAdminHeader() {
  const location = useLocation();
  const currentPath = normalizePath(location.pathname); // 경로 정규화

  const matchedKey = Object.keys(pathMap)
    .sort((a, b) => b.length - a.length)
    .find((key) => currentPath.startsWith(key));

  const crumbs = matchedKey ? pathMap[matchedKey] : [];

  // 경로별 prefix 라벨 선택: 매칭 없으면 기본 'Pages'
  const prefixLabel = (matchedKey && prefixMap[matchedKey]) || 'Pages';

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

export default ExpoAdminHeader;
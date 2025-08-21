// ExpoAdminLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import styles from "./ExpoAdminLayout.module.css";
import ExpoAdminHeader from "./header/ExpoAdminHeader";
import ExpoAdminSideBar from "./sidebar/ExpoAdminSidebar";

import { jwtDecode } from "jwt-decode";
import instance from "../../api/lib/axios";
import { usePermission } from "../permission/PermissionContext";
import AccessDeniedPage from "../../common/pages/AccessDeniedPage";

function ExpoAdminLayout() {
  const { expoId } = useParams();
  const location = useLocation();
  const { perm } = usePermission(); // perm === null 이면 아직 로딩 중으로 간주

  const [hasExpoAccess, setHasExpoAccess] = useState(null); // true | false | null
  const [checking, setChecking] = useState(false); // 이 컴포넌트 내부 체크 진행 여부

  // expoId 접근 권한 체크
  useEffect(() => {
    const checkPermission = async () => {
      // PermissionContext가 아직 준비 전
      if (perm === null) return;

      setChecking(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setHasExpoAccess(false);
          return;
        }

        let decoded = null;
        try {
          decoded = jwtDecode(token);
        } catch {
          setHasExpoAccess(false);
          return;
        }

        if (decoded?.loginType === "ADMIN_CODE") {
          // AdminCode 로그인 → API로 접근 검증
          try {
            await instance.get(`/expos/${expoId}/chats/rooms`);
            setHasExpoAccess(true);
          } catch {
            setHasExpoAccess(false);
          }
        } else {
          // MEMBER 로그인 → perm.expoIds 검증
          const expoIdNumber = Number(expoId);
          const ok = Array.isArray(perm?.expoIds) && perm.expoIds.includes(expoIdNumber);
          setHasExpoAccess(ok);
        }
      } catch {
        setHasExpoAccess(false);
      } finally {
        setChecking(false);
      }
    };

    checkPermission();
  }, [perm, expoId]);

  // 페이지별 권한 체크 (perm/접근 허용 이후에만 의미 있음)
  const basePath = `/expos/${expoId}/admin`;
  const path = location.pathname;
  const pageAllowed = hasPagePermission(path, basePath, perm);

  // 뷰 분기 (조기 return 최소화)
  let content = null;

  // perm 로딩 중이거나, 이 컴포넌트의 접근 체크 진행 중이거나, 아직 판정 전 → 스피너
  if (perm === null || checking || hasExpoAccess === null) {
    content = (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        권한 확인 중...
      </div>
    );
  } else if (hasExpoAccess === false) {
    // 접근 불가 확정
    content = <AccessDeniedPage />;
  } else if (!pageAllowed) {
    // 페이지 권한 불가
    content = <AccessDeniedPage />;
  } else {
    // 정상 화면
    content = (
      <div className={styles.layout}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebar}>
            <ExpoAdminSideBar />
          </div>
          <div className={styles.main}>
            <div className={styles.header}>
              <ExpoAdminHeader />
            </div>
            <div className={styles.content}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return content;
}

export default ExpoAdminLayout;

// 주소창 직입 방지: 페이지별 권한 규칙
function hasPagePermission(path, basePath, perm) {
  if (path === basePath || path === `${basePath}/`) return true;

  const rules = [
    { match: `${basePath}/setting`,      allow: !!perm?.isExpoDetailUpdate },
    { match: `${basePath}/booths`,       allow: !!perm?.isBoothInfoUpdate },
    { match: `${basePath}/events`,       allow: !!perm?.isScheduleUpdate },
    { match: `${basePath}/payments`,     allow: !!perm?.isPaymentView },
    { match: `${basePath}/reservations`, allow: !!perm?.isReserverListView },
    { match: `${basePath}/emails`,       allow: !!perm?.isEmailLogView },
    { match: `${basePath}/operation`,    allow: !!perm?.isOperationsConfigUpdate },
    { match: `${basePath}/inquiry`,      allow: !!perm?.isInquiryView },
  ];

  for (const r of rules) {
    if (path.startsWith(r.match)) return r.allow;
  }
  return true;
}
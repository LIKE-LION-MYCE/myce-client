import { useEffect, useState } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import styles from './ExpoAdminLayout.module.css';
import ExpoAdminHeader from "./header/ExpoAdminHeader";
import ExpoAdminSideBar from "./sidebar/ExpoAdminSidebar";
import { usePermission } from "../permission/PermissionContext";

function ExpoAdminLayout() {
  const { expoId } = useParams();
  const location = useLocation();
  const { perm } = usePermission();

  const [hasExpoAccess, setHasExpoAccess] = useState(null);

  // 1) expoId 접근 권한(해당 박람회 소속 여부) 체크 및 직입 방지
  useEffect(() => {
    if (!perm) return;
    const expoIdNumber = Number(expoId);
    setHasExpoAccess(perm.expoIds.includes(expoIdNumber));
  }, [perm, expoId]);

  if (hasExpoAccess === null) return null;
  if (!hasExpoAccess) return <NoAccessPage />;

  // 2) 페이지별 권한 체크 (주소창 직입 방지)
  const basePath = `/expos/${expoId}/admin`;
  const path = location.pathname;

  const pageAllowed = hasPagePermission(path, basePath, perm);

  if (!pageAllowed) return <NoAccessPage />;

  return (
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

export default ExpoAdminLayout;


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
    { match: `${basePath}/settlement`,   allow: !!perm?.isSettlementView },
    { match: `${basePath}/inquiry`,      allow: !!perm?.isInquiryView },
  ];

  for (const r of rules) {
    if (path.startsWith(r.match)) return r.allow;
  }
  return true;
}

function NoAccessPage() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h2 style={{ fontSize: "1.5rem", color: "#d32f2f", marginBottom: "1rem" }}>
        [403 Forbidden] 접근 권한이 없습니다.
      </h2>
    </div>
  );
}
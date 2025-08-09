import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import styles from './ExpoAdminLayout.module.css';
import ExpoAdminHeader from "./header/ExpoAdminHeader";
import ExpoAdminSideBar from "./sidebar/ExpoAdminSidebar";
import { usePermission } from "../permission/PermissionContext";

function ExpoAdminLayout() {
  const { expoId } = useParams();
  const { perm } = usePermission();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    if (!perm) return;
    const expoIdNumber = Number(expoId);
    setHasPermission(perm.expoIds.includes(expoIdNumber));
  }, [perm, expoId]);

  if (hasPermission === null) return null;

  if (!hasPermission) return <NoAccessPage />; //권한 없음 페이지 렌더링

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
      <h2 style={{ fontSize: "1.75rem", color: "#d32f2f", marginBottom: "1rem" }}>
        [403 Forbidden] 접근 권한이 없습니다
      </h2>
      <p style={{ fontSize: "1rem", color: "#555" }}>
        이 박람회에 대한 관리 권한이 없습니다.
      </p>
    </div>
  );
}
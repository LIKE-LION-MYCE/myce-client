import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from './PlatformAdminLayout.module.css'
import PlatformAdminHeader from "./header/PlatformAdminHeader";
import PlatformAdminSideBar from "./sidebar/PlatformAdminSideBar";
import AccessDenied from "../../common/pages/AccessDeniedPage"
import { jwtDecode } from "jwt-decode";

function PlatformAdminLayout() {
  const [hasExpoAccess, setHasExpoAccess] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setHasExpoAccess(false);
          return <AccessDenied />;
        }

        const decodedToken = jwtDecode(token);

        if (decodedToken.role === 'PLATFORM_ADMIN') {
          setHasExpoAccess(true);
        } else {
          setHasExpoAccess(false);
        }
      } catch (error) {
        console.log(error);
        setHasExpoAccess(false);
      }
    }
    checkPermission();
  }, [])

  if (hasExpoAccess === false) {
    return <AccessDenied />;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <PlatformAdminSideBar></PlatformAdminSideBar>
        </div>
        <div className={styles.main}>
          <div className={styles.header}>
            <PlatformAdminHeader></PlatformAdminHeader>
          </div>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlatformAdminLayout;

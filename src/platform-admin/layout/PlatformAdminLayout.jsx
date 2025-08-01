import { Outlet } from "react-router-dom";
import styles from './PlatformAdminLayout.module.css'
import PlatformAdminHeader from "./header/PlatformAdminHeader";
import PlatformAdminSideBar from "./sidebar/PlatformAdminSideBar";

function PlatformAdminLayout() {
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

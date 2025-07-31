import { Outlet } from "react-router-dom";
import styles from './ExpoAdminLayout.module.css'
import ExpoAdminHeader from "./header/ExpoAdminHeader";
import ExpoAdminSideBar from "./sidebar/ExpoAdminSidebar";

function ExpoAdminLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <ExpoAdminSideBar></ExpoAdminSideBar>
        </div>
        <div className={styles.main}>
          <div className={styles.header}>
            <ExpoAdminHeader></ExpoAdminHeader>
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

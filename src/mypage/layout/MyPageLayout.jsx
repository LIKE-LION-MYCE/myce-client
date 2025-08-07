import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../mainpage/layout/header/MainPageHeader";
import MyPageSidebar from "./sidebar/MyPageSidebar";
import styles from "./MyPageLayout.module.css";
import Footer from "../../mainpage/layout/footer/MainPageFooter";

const MyPageLayout = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.content}>
        <MyPageSidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MyPageLayout;

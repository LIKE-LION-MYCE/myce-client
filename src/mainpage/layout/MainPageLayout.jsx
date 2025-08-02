import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../layout/header/Header';
import Footer from '../layout/footer/Footer';
import styles from './MainPageLayout.module.css';

export default function MainPageLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.headerFixed}>
        <Header />
      </div>
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

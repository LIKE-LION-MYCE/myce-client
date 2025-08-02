// BrowseExpo.jsx
import React from 'react';
import styles from './BrowseExpo.module.css';
import SidebarFilters from '../components/sidebar/SidebarFilters';
import ExpoCardList from '../components/expocard/ExpoCardList';

export default function BrowseExpo() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <h2 className={styles.title}>전체 행사 <span className={styles.count}>8개의 행사</span></h2>
          <ExpoCardList />
        </section>
        <aside className={styles.sidebar}>
          <SidebarFilters />
        </aside>
      </main>
    </div>
  );
}

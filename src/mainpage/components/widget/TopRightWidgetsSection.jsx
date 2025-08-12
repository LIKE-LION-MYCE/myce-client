// TopRightWidgetsSection.jsx
import React from 'react';
import TopRightWidgets from './TopRightWidgets';
import styles from './TopRightWidgetsSection.module.css';
import AdBannerD from '../banners/AdBannerD';

export default function TopRightWidgetsSection({ banners }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.wrapper}>
          <TopRightWidgets />
        </div>
        <AdBannerD banners= {banners}/>
      </div>
    </section>
  );
}

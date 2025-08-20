import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SubBanners.module.css';


export default function SubBanners({ banners }) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {banners.slice(0,4).map((banner, idx) => (
          <div key={idx} className={styles.item}>
            <Link key={banner.bannerId} to={banner.linkUrl} className={styles.link}>
              <img src={banner.bannerImageUrl} alt={banner.bannerId} className={styles.image} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

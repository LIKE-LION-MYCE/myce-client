import React from 'react';
import styles from './SubBanners.module.css';

const bannerItems = [
  { text: '배너 광고 B-1', image: 'https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png' },
  { text: '배너 광고 B-2', image: 'https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png' },
  { text: '배너 광고 B-3', image: 'https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png' },
  { text: '배너 광고 B-4', image: 'https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png' },
  { text: '배너 광고 B-5', image: 'https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png' },
  { text: '배너 광고 B-6', image: 'https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png' },
];

export default function SubBanners() {
  return (
    <div className={styles.grid}>
      {bannerItems.map((item, idx) => (
        <div key={idx} className={styles.item}>
          <img src={item.image} alt={item.text} className={styles.image} />
        </div>
      ))}
    </div>
  );
}

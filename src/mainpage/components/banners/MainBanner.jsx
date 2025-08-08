import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MainBanner.module.css';

const bannersTemp = [
  {
    bannerId: 1,
    locationId: 1,
    bannerImageUrl: "https://signwayonline.net/wp-content/uploads/2018/02/spacesuit-banner-1200x400.jpg",
    linkUrl: "https://it-education.com"
  },
  {
    bannerId: 11,
    locationId: 1,
    bannerImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsKxIWBpf1frtmq7L0Fs0IOy5D2kf5TMKrMg&s",
    linkUrl: "https://naver.com"
  },
  {
    bannerId: 1,
    locationId: 1,
    bannerImageUrl: "https://signwayonline.net/wp-content/uploads/2018/02/spacesuit-banner-1200x400.jpg",
    linkUrl: "https://it-education.com"
  },
];

export default function MainBanner({ banners }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000); // 4초마다 전환

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.banner}>
      <div
        className={styles.slider}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, idx) => (
          <Link key={idx} to={banner.linkUrl} className={styles.link}>
            <img
              src={banner.bannerImageUrl}
              alt={`배너 ${idx + 1}`}
              className={styles.image}
            />
          </Link>
        ))}
      </div>

      <div className={styles.dots}>
        {banners.map((_, idx) => (
          <span
            key={idx}
            className={`${styles.dot} ${current === idx ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MainBanner.module.css';


export default function MainBanner({ banners }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000); // 4초마다 전환

    return () => clearInterval(interval);
  }, [banners, current]);;

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
            onClick={() => {
              setCurrent(idx)
            }
            } // 👈 이 부분 추가
          />
        ))}
      </div>
    </div>
  );
}

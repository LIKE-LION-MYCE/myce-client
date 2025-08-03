import React, { useEffect, useState } from 'react';
import styles from './MainBanner.module.css';


const images = [
  'https://cdn.imweb.me/upload/S20211122cdb0adf5a68c6/aff244a40eeb0.png',
  'https://cdn.imweb.me/upload/S20211122cdb0adf5a68c6/aff244a40eeb0.png',
  'https://cdn.imweb.me/upload/S20211122cdb0adf5a68c6/aff244a40eeb0.png',
];


export default function MainBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // 4초마다 전환

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.banner}>
      <div
        className={styles.slider}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={`배너 ${idx + 1}`} className={styles.image} />
        ))}
      </div>

      <div className={styles.dots}>
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`${styles.dot} ${current === idx ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

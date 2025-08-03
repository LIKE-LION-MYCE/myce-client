import React from 'react';
import styles from './FooterBanner.module.css';

export default function FooterBanner() {
  return (
    <div className={styles.banner}>
      <img
        src="https://cdn.imweb.me/upload/S20211122cdb0adf5a68c6/aff244a40eeb0.png"
        alt="하단 배너 C"
        className={styles.image}
      />
    </div>
  );
}
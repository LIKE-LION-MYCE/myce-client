import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SubBanners.module.css';

const banners = [
  {
    "bannerId": 12,
    "locationId": 2,
    "bannerImageUrl": "https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png",
    "linkUrl": "https://naver.com"
  },
  {
    "bannerId": 16,
    "locationId": 2,
    "bannerImageUrl": "https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png",
    "linkUrl": "https://naver.com"
  },
  {
    "bannerId": 20,
    "locationId": 2,
    "bannerImageUrl": "https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png",
    "linkUrl": "https://naver.com"
  },
  {
    "bannerId": 20,
    "locationId": 2,
    "bannerImageUrl": "https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png",
    "linkUrl": "https://naver.com"
  },
  {
    "bannerId": 20,
    "locationId": 2,
    "bannerImageUrl": "https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png",
    "linkUrl": "https://naver.com"
  },
  {
    "bannerId": 20,
    "locationId": 2,
    "bannerImageUrl": "https://cdn.imweb.me/upload/S201701025869fcb41ae40/ff12458f715e9.png",
    "linkUrl": "https://naver.com"
  },
]

export default function SubBanners({ banners }) {
  return (
    <div className={styles.grid}>
      {banners.map((banner, idx) => (
        <div key={idx} className={styles.item}>
          <Link key={banner.bannerId} to={banner.linkUrl} className={styles.link}>
            <img src={banner.bannerImageUrl} alt={banner.bannerId} className={styles.image} />
          </Link>
        </div>
      ))}
    </div>
  );
}

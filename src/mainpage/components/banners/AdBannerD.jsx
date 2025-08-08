import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './AdBannerD.module.css';

export default function AdBannerD({ banners }) {
  const [selected, setSelected] = useState(null);

  // 상위에서 banners가 새로 들어올 때만 랜덤으로 선택
  useEffect(() => {
    if (Array.isArray(banners) && banners.length > 0) {
      const idx = Math.floor(Math.random() * banners.length);
      setSelected(banners[idx]);
    } else {
      setSelected(null);
    }
  }, [banners]);

  if (!selected) {
    // 배너 없을 때는 아무것도 안 보이게 하거나 placeholder 이미지
    return null;
  }

  const img = (
    <img
      src={selected.bannerImageUrl}
      alt={`배너 ${selected.bannerId}`}
      className={styles.image}
      loading="lazy"
    />
  );

  return (
    <div className={styles.banner}>
      {selected.linkUrl ? (
        (
          <Link to={selected.linkUrl} className={styles.linkReset}>
            {img}
          </Link>
        )
      ) : (
        img
      )}
    </div>
  );
}

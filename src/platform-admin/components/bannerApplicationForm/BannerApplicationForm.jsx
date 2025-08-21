import { useEffect } from 'react';
import styles from './BannerApplicationForm.module.css';

function BannerApplicationForm({ bannerData }) {
  const data = bannerData || {
    title: '',
    bannerLocationName: '',
    bannerImageUrl: '',
    startAt: '',
    endAt: '',
    description: '',
  };

  useEffect(() => {}, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.profileWrapper}>
          <img
            src={data.bannerImageUrl}
            alt="배너 이미지"
            className={styles.profileImage}
          />
        </div>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>배너 제목</label>
            <div className={styles.displayField}>
              {data.title || '-'}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>배너 위치</label>
            <div className={styles.displayField}>
              {data.bannerLocationName || '-'}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>광고 기간</label>
            <div className={styles.displayField}>
              {data.startAt && data.endAt ? `${data.startAt} ~ ${data.endAt}` : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.formGroup} ${styles.full}`}>
        <label className={styles.label}>광고 설명</label>
        <div className={styles.textarea}>
          {data.description || '-'}
        </div>
      </div>
    </div>
  );
}

export default BannerApplicationForm;
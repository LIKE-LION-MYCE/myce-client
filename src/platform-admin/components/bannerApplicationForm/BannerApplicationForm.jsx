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

  useEffect(() => {
  }, [data]); 

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
            <input
              className={styles.inputField}
              value={data.title || ''}
              readOnly
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>배너 위치</label>
            <input
              className={styles.inputField}
              value={data.bannerLocationName || ''}
              readOnly
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>광고 기간</label>
            <div className={styles.dateGroup}>
              <input
                type="date"
                className={styles.inputField}
                value={data.startAt || ''}
                readOnly
              />
              <input
                type="date"
                className={styles.inputField}
                value={data.endAt || ''}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.formGroup} ${styles.full}`}>
        <label className={styles.label}>광고 설명</label>
        <textarea
          className={styles.textarea}
          value={data.description || ''}
          readOnly
        />
      </div>
    </div>
  );
}

export default BannerApplicationForm;
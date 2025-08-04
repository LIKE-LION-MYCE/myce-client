import { useEffect, useState } from 'react';
import styles from './BannerApplicationForm.module.css';

const mockExpoData = {
  name: '2025 AI 박람회',
  bannerType: '메인 상단 배너',
  imageUrl: 'https://www.naver.com',
  postStartDate: '2025-08-01',
  postEndDate: '2025-09-05',
  description: 'AI 기술을 주제로 한 대규모 박람회입니다.',
};

function BannerApplicationForm() {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({ ...mockExpoData });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.profileWrapper}>
          <img
            src='https://vrthumb.clipartkorea.co.kr/2023/06/15/ta0060a6402.jpg'
            alt="배너 이미지"
            className={styles.profileImage}
          />
        </div>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>배너 이름</label>
            <input
              className={styles.inputField}
              value={form.name || ''}
              readOnly
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>배너 타입</label>
            <input
              className={styles.inputField}
              value={form.bannerType || ''}
              readOnly
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>이미지 연결 URL</label>
            <input
              className={styles.inputField}
              value={form.imageUrl || ''}
              readOnly
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>개시 기간</label>
            <div className={styles.dateGroup}>
              <input
                type="date"
                className={styles.inputField}
                value={form.postStartDate || ''}
                readOnly
              />
              <input
                type="date"
                className={styles.inputField}
                value={form.postEndDate || ''}
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
          value={form.description || ''}
          readOnly
        />
      </div>
    </div>
  );
}

export default BannerApplicationForm;
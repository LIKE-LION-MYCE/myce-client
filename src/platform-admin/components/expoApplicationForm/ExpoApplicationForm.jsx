import { useEffect, useState } from 'react';
import styles from './ExpoApplicationForm.module.css';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';

const mockExpoData = {
  name: '2025 AI 박람회',
  location: '서울 삼성 코엑스',
  capacity: 1000,
  startDate: '2025-09-01',
  endDate: '2025-09-03',
  startTime: '09:00',
  endTime: '18:00',
  postStartDate: '2025-08-01',
  postEndDate: '2025-09-05',
  isPremium: true,
  isPublic: true,
  category: 'IT',
  description: 'AI 기술을 주제로 한 대규모 박람회입니다.',
};

function ExpoApplicationForm() {
  const [form, setForm] = useState({});
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setForm({ ...mockExpoData });
    setIsPremium(mockExpoData.isPremium);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.profileWrapper}>
          <img
            src="https://cdn.netongs.com/news/photo/202412/322861_127383_830.jpg"
            alt="포스터"
            className={styles.profileImage}
          />
        </div>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 이름</label>
            <input
              className={styles.inputField}
              value={form.name || ''}
              readOnly
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 위치</label>
            <input
              className={styles.inputField}
              value={form.location || ''}
              readOnly
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>최대 수용 인원</label>
            <input
              type="number"
              className={styles.inputField}
              value={form.capacity || ''}
              readOnly
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>개최 기간</label>
            <div className={styles.dateGroup}>
              <input
                type="date"
                className={styles.inputField}
                value={form.startDate || ''}
                readOnly
              />
              <input
                type="date"
                className={styles.inputField}
                value={form.endDate || ''}
                readOnly
              />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>운영 시간</label>
            <div className={styles.dateGroup}>
              <input
                type="time"
                className={styles.inputField}
                value={form.startTime || ''}
                readOnly
              />
              <input
                type="time"
                className={styles.inputField}
                value={form.endTime || ''}
                readOnly
              />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>게시 기간</label>
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

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>프리미엄 상위 노출 신청 여부</label>
            <div className={styles.toggleWrapper}>
              <ToggleSwitch checked={isPremium} disabled />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>카테고리</label>
            <div className={styles.badgeRow}>
              <div className={styles.badge}>
                {form.category || '카테고리 없음'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.formGroup} ${styles.full}`}>
        <label className={styles.label}>설명</label>
        <textarea
          className={styles.textarea}
          value={form.description || ''}
          readOnly
        />
      </div>
    </div>
  );
}

export default ExpoApplicationForm;
import { useEffect, useState } from 'react';
import styles from './ExpoApplicationForm.module.css';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';

function ExpoApplicationForm({ expoData }) {
  const [form, setForm] = useState({});
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (expoData) {
      setForm(expoData);
      setIsPremium(expoData.isPremium || false);
    }
  }, [expoData]);

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.profileWrapper}>
          <img
            src={form.thumbnailUrl || "https://cdn.netongs.com/news/photo/202412/322861_127383_830.jpg"}
            alt="포스터"
            className={styles.profileImage}
          />
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>카테고리</label>
            <div className={styles.badgeRow}>
              {(() => {
                // 카테고리가 배열인지 확인하고 처리
                if (Array.isArray(form.category)) {
                  return form.category.map((cat, index) => (
                    <div key={index} className={styles.badge}>
                      {cat}
                    </div>
                  ));
                } else if (typeof form.category === 'string') {
                  // 쉼표로 구분된 문자열인 경우 분리
                  const categories = form.category.split(',').map(cat => cat.trim()).filter(cat => cat);
                  return categories.map((cat, index) => (
                    <div key={index} className={styles.badge}>
                      {cat}
                    </div>
                  ));
                } else {
                  return (
                    <div className={styles.badge}>
                      카테고리 없음
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>프리미엄 상위 노출 신청 여부</label>
            <div className={styles.toggleWrapper}>
              <ToggleSwitch checked={isPremium} disabled />
              <span className={`${styles.toggleStatus} ${isPremium ? styles.active : styles.inactive}`}>
                {isPremium ? '신청' : '미신청'}
              </span>
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 이름</label>
            <div className={styles.displayField}>
              {form.title || '-'}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 위치</label>
            <div className={styles.displayField}>
              {form.location || '-'}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>상세 위치</label>
            <div className={styles.displayField}>
              {form.locationDetail || '-'}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>최대 수용 인원</label>
            <div className={styles.displayField}>
              {form.maxReserverCount ? `${form.maxReserverCount.toLocaleString()}명` : '-'}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>개최 기간</label>
            <div className={styles.displayField}>
              {form.startDate && form.endDate ? `${form.startDate} ~ ${form.endDate}` : '-'}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>운영 시간</label>
            <div className={styles.displayField}>
              {form.startTime && form.endTime ? `${form.startTime} ~ ${form.endTime}` : '-'}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>게시 기간</label>
            <div className={styles.displayField}>
              {form.displayStartDate && form.displayEndDate ? `${form.displayStartDate} ~ ${form.displayEndDate}` : '-'}
            </div>
            {form.status === 'PENDING_PUBLISH' && form.displayStartDate && (
              <div className={styles.autoPublishNotice}>
                <div className={styles.noticeIcon}>📅</div>
                <div className={styles.noticeContent}>
                  <span className={styles.noticeTitle}>자동 게시 예정</span>
                  <span className={styles.noticeDate}>{form.displayStartDate}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className={`${styles.formGroup} ${styles.full} ${styles.lastFormGroup}`}>
        <label className={styles.label}>설명</label>
        <div className={styles.textarea}>
          {form.description || '설명이 없습니다.'}
        </div>
      </div>
    </div>
  );
}

export default ExpoApplicationForm;
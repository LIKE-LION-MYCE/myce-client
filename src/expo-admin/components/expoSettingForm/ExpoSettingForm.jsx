import { useState } from 'react';
import styles from './ExpoSettingForm.module.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ToggleSwitch from '../../../common/commponents/toggleSwitch/ToggleSwitch';

function ExpoSettingForm() {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div className={styles.container}>
      {/* 상단 행 */}
      <div className={styles.topRow}>
        {/* 포스터 */}
        <div className={styles.profileWrapper}>
          <img
            src="https://cdn.netongs.com/news/photo/202412/322861_127383_830.jpg"
            alt="포스터"
            className={styles.profileImage}
          />
        </div>

        {/* 폼 */}
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 이름</label>
            <input className={styles.inputField} placeholder="박람회 이름 입력" />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 위치</label>
            <input className={styles.inputField} placeholder="박람회 위치 입력" />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>최대 수용 인원</label>
            <input className={styles.inputField} type="number" placeholder="최대 인원 입력" />
          </div>

          {/* 개최 기간 */}
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>개최 기간</label>
            <div className={styles.dateGroup}>
              <div className={styles.dateInputWrapper}>
                <input type="date" className={styles.inputField} />
              </div>
              <div className={styles.dateInputWrapper}>
                <input type="date" className={styles.inputField} />
              </div>
            </div>
          </div>

          {/* 운영 시간 */}
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>운영 시간</label>
            <div className={styles.dateGroup}>
              <div className={styles.dateInputWrapper}>
                <input type="time" className={styles.inputField} />
              </div>
              <div className={styles.dateInputWrapper}>
                <input type="time" className={styles.inputField} />
              </div>
            </div>
          </div>

          {/* 게시 기간 */}
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>게시 기간</label>
            <div className={styles.dateGroup}>
              <div className={styles.dateInputWrapper}>
                <input type="date" className={styles.inputField} />
              </div>
              <div className={styles.dateInputWrapper}>
                <input type="date" className={styles.inputField} />
              </div>
            </div>
          </div>

          {/* 프리미엄 상위 노출 여부 - 토글 */}
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>프리미엄 상위 노출 신청 여부</label>
            <div className={styles.toggleWrapper}>
              <ToggleSwitch
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
              />
            </div>
          </div>

          {/* 공개 상태 및 카테고리 */}
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>공개 상태 및 카테고리</label>
            <div className={styles.badgeRow}>
              <div className={`${styles.badge} ${styles.red}`}>공개</div>
              <div className={styles.badge}>IT</div>
            </div>
          </div>
        </div>
      </div>

      {/* 설명 */}
      <div className={`${styles.formGroup} ${styles.full}`}>
        <label className={styles.label}>설명</label>
        <textarea className={styles.textarea} placeholder="박람회 설명 입력" />
      </div>

      {/* 버튼 */}
      <div className={styles.buttonGroup}>
        <button className={`${styles.actionBtn} ${styles.submitBtn}`}>
          <FaCheckCircle className={styles.iconBtn} /> 수정
        </button>
        <button className={`${styles.actionBtn} ${styles.cancelBtn}`}>
          <FaTimesCircle className={styles.iconBtn} /> 취소
        </button>
      </div>
    </div>
  );
}

export default ExpoSettingForm;

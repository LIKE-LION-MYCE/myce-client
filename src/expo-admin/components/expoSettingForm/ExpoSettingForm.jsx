import { useEffect, useState } from 'react';
import styles from './ExpoSettingForm.module.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ToggleSwitch from '../../../common/commponents/toggleSwitch/ToggleSwitch';
import ToastSuccess from '../../../common/commponents/toastSuccess/ToastSuccess';

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

function ExpoSettingForm() {
  const [form, setForm] = useState(initForm());
  const [isPremium, setIsPremium] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function initForm() {
    return {
      name: '',
      location: '',
      capacity: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      postStartDate: '',
      postEndDate: '',
      isPublic: true,
      category: '',
      description: '',
    };
  }

  useEffect(() => {
    setForm({ ...mockExpoData });
    setIsPremium(mockExpoData.isPremium);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSubmit = () => {
    const payload = { ...form, isPremium };
    console.log('[제출할 데이터]', payload);
    triggerToast();
  };

  const handleCancel = () => {
    setForm(initForm());
    setIsPremium(false);
    triggerToast();
  };

  return (
    <div className={styles.container}>
      {showToast && <ToastSuccess />}

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
              placeholder="박람회 이름 입력"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 위치</label>
            <input
              className={styles.inputField}
              placeholder="박람회 위치 입력"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>최대 수용 인원</label>
            <input
              className={styles.inputField}
              type="number"
              placeholder="최대 인원 입력"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>개최 기간</label>
            <div className={styles.dateGroup}>
              <input type="date" className={styles.inputField} name="startDate" value={form.startDate} onChange={handleChange} />
              <input type="date" className={styles.inputField} name="endDate" value={form.endDate} onChange={handleChange} />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>운영 시간</label>
            <div className={styles.dateGroup}>
              <input type="time" className={styles.inputField} name="startTime" value={form.startTime} onChange={handleChange} />
              <input type="time" className={styles.inputField} name="endTime" value={form.endTime} onChange={handleChange} />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>게시 기간</label>
            <div className={styles.dateGroup}>
              <input type="date" className={styles.inputField} name="postStartDate" value={form.postStartDate} onChange={handleChange} />
              <input type="date" className={styles.inputField} name="postEndDate" value={form.postEndDate} onChange={handleChange} />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>프리미엄 상위 노출 신청 여부</label>
            <div className={styles.toggleWrapper}>
              <ToggleSwitch checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>공개 상태 및 카테고리</label>
            <div className={styles.badgeRow}>
              <div className={`${styles.badge} ${styles.red}`}>{form.isPublic ? '공개' : '비공개'}</div>
              <div className={styles.badge}>{form.category || '카테고리 없음'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.formGroup} ${styles.full}`}>
        <label className={styles.label}>설명</label>
        <textarea
          className={styles.textarea}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="박람회 설명 입력"
        />
      </div>

      <div className={styles.buttonGroup}>
        <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSubmit}>
          <FaCheckCircle className={styles.iconBtn} /> 수정
        </button>
        <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleCancel}>
          <FaTimesCircle className={styles.iconBtn} /> 취소
        </button>
      </div>
    </div>
  );
}

export default ExpoSettingForm;
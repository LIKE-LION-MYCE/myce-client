import { useState, useEffect } from 'react';
import ToastSuccess from '../../../common/commponents/toastSuccess/ToastSuccess';
import styles from './EventSettingForm.module.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function EventSettingForm({ onSubmit, onCancel, editingEvent }) {
  const [form, setForm] = useState(initForm());
  const [toastMessage, setToastMessage] = useState('');

  function initForm() {
    return {
      eventName: '',
      eventLocation: '',
      eventDate: '',
      eventTimeStart: '',
      eventTimeEnd: '',
      eventDescription: '',
      managerName: '',
      managerPhone: '',
      managerEmail: '',
    };
  }

  useEffect(() => {
    if (editingEvent) {
      setForm(editingEvent);
    } else {
      setForm(initForm());
    }
  }, [editingEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm(initForm());
    setToastMessage(editingEvent ? '행사 정보가 수정되었습니다.' : '행사 정보가 등록되었습니다.');
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleCancel = () => {
    setForm(initForm());
    onCancel?.();
  };

  return (
    <div className={styles.container}>
      {toastMessage && <ToastSuccess message={toastMessage} />}

      <div className={styles.formGrid}>
        {/* 왼쪽 컬럼 */}
        <div className={styles.column}>
          <div className={styles.formGroup}>
            <label className={styles.label}>행사 이름</label>
            <input
              name="eventName"
              className={styles.inputField}
              placeholder="행사 이름 입력"
              value={form.eventName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 위치</label>
            <input
              name="eventLocation"
              className={styles.inputField}
              placeholder="행사 위치 입력"
              value={form.eventLocation}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 날짜</label>
            <input
              type="date"
              name="eventDate"
              className={styles.inputField}
              value={form.eventDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 시간</label>
            <div className={styles.timeRange}>
              <input
                type="time"
                name="eventTimeStart"
                className={styles.inputField}
                value={form.eventTimeStart}
                onChange={handleChange}
              />
              <span className={styles.timeDivider}>~</span>
              <input
                type="time"
                name="eventTimeEnd"
                className={styles.inputField}
                value={form.eventTimeEnd}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 소개</label>
            <input
              name="eventDescription"
              className={styles.inputField}
              placeholder="행사 소개 입력"
              value={form.eventDescription}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className={styles.column}>
          <div className={styles.formGroup}>
            <label className={styles.label}>담당자명</label>
            <input
              name="managerName"
              className={styles.inputField}
              placeholder="담당자명 입력"
              value={form.managerName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 전화번호</label>
            <input
              name="managerPhone"
              className={styles.inputField}
              placeholder="전화번호 입력"
              value={form.managerPhone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 이메일</label>
            <input
              name="managerEmail"
              className={styles.inputField}
              placeholder="이메일 입력"
              value={form.managerEmail}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSubmit}>
          <FaCheckCircle className={styles.iconBtn} /> {editingEvent ? '수정' : '등록'}
        </button>
        <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleCancel}>
          <FaTimesCircle className={styles.iconBtn} /> 취소
        </button>
      </div>
    </div>
  );
}

export default EventSettingForm;
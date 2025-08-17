import { useState, useEffect } from 'react';
import styles from './EventSettingForm.module.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function EventSettingForm({ onSubmit, onCancel, editingEvent, expoStartDate, expoEndDate }) {
  const [form, setForm] = useState(initForm());

  function initForm() {
    return {
      name: '',
      location: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      description: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
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

  const handleSubmit = async () => {
    const success = await onSubmit(form);
    if (success) {
      setForm(initForm());
    }
  };

  const handleCancel = () => {
    setForm(initForm());
    onCancel?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formGrid}>
        {/* 왼쪽 컬럼 */}
        <div className={styles.column}>
          <div className={styles.formGroup}>
            <label className={styles.label}>행사 이름 <span style={{color: 'red'}}>*</span></label>
            <input
              name="name"
              className={styles.inputField}
              placeholder="행사 이름 입력"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 위치 <span style={{color: 'red'}}>*</span></label>
            <input
              name="location"
              className={styles.inputField}
              placeholder="행사 위치 입력"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 날짜 <span style={{color: 'red'}}>*</span></label>
            <input
              type="date"
              name="eventDate"
              className={styles.inputField}
              value={form.eventDate}
              onChange={handleChange}
              min={expoStartDate ? expoStartDate.split('T')[0] : undefined}
              max={expoEndDate ? expoEndDate.split('T')[0] : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 시간 <span style={{color: 'red'}}>*</span></label>
            <div className={styles.timeRange}>
              <input
                type="time"
                name="startTime"
                className={styles.inputField}
                value={form.startTime}
                onChange={handleChange}
              />
              <span className={styles.timeDivider}>~</span>
              <input
                type="time"
                name="endTime"
                className={styles.inputField}
                value={form.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 소개 <span style={{color: 'red'}}>*</span></label>
            <input
              name="description"
              className={styles.inputField}
              placeholder="행사 소개 입력"
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className={styles.column}>
          <div className={styles.formGroup}>
            <label className={styles.label}>담당자명 <span style={{color: 'red'}}>*</span></label>
            <input
              name="contactName"
              className={styles.inputField}
              placeholder="담당자명 입력"
              value={form.contactName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 전화번호 <span style={{color: 'red'}}>*</span></label>
            <input
              name="contactPhone"
              className={styles.inputField}
              placeholder="전화번호 입력"
              value={form.contactPhone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 이메일 <span style={{color: 'red'}}>*</span></label>
            <input
              name="contactEmail"
              className={styles.inputField}
              placeholder="이메일 입력"
              value={form.contactEmail}
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
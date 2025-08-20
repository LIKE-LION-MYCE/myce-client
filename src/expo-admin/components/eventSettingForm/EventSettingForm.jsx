// EventSettingForm.jsx
import { useState, useEffect } from 'react';
import styles from './EventSettingForm.module.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function EventSettingForm({ onSubmit, onCancel, editingEvent, expoStartDate, expoEndDate }) {
  const [form, setForm] = useState(initForm());
  const [errors, setErrors] = useState({});

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
      setForm({
        name: editingEvent.name || '',
        location: editingEvent.location || '',
        eventDate: editingEvent.eventDate || '',
        startTime: editingEvent.startTime || '',
        endTime: editingEvent.endTime || '',
        description: editingEvent.description || '',
        contactName: editingEvent.contactName || '',
        contactPhone: editingEvent.contactPhone || '',
        contactEmail: editingEvent.contactEmail || '',
      });
    } else {
      setForm(initForm());
    }
    setErrors({});
  }, [editingEvent]);

  // 전화번호 자동 하이픈 (02, 0XX, 010 등)
  const formatPhoneNumber = (value) => {
    const onlyNums = String(value || '').replace(/[^0-9]/g, '');
    if (onlyNums.startsWith('02')) {
      if (onlyNums.length <= 2) return onlyNums;
      if (onlyNums.length <= 5) return onlyNums.replace(/(\d{2})(\d{1,3})/, '$1-$2');
      if (onlyNums.length <= 9) return onlyNums.replace(/(\d{2})(\d{3})(\d{1,4})/, '$1-$2-$3');
      return onlyNums.replace(/(\d{2})(\d{4})(\d{4}).*/, '$1-$2-$3');
    }
    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 6) return onlyNums.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    if (onlyNums.length <= 10) return onlyNums.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
    return onlyNums.replace(/(\d{3})(\d{4})(\d{4}).*/, '$1-$2-$3');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === 'contactPhone') {
        return { ...prev, contactPhone: formatPhoneNumber(value) };
      }
      if (name === 'startTime') {
        // 시작시간은 정각(00분) 또는 30분만 허용
        if (value && value.includes(':')) {
          const [hour, minute] = value.split(':');
          if (minute !== '00' && minute !== '30') {
            // 가장 가까운 유효한 시간으로 자동 조정
            const adjustedMinute = parseInt(minute) < 15 ? '00' : 
                                   parseInt(minute) < 45 ? '30' : '00';
            const adjustedHour = adjustedMinute === '00' && parseInt(minute) >= 45 ? 
                               String(parseInt(hour) + 1).padStart(2, '0') : hour;
            return { ...prev, [name]: `${adjustedHour}:${adjustedMinute}` };
          }
        }
      }
      return { ...prev, [name]: value };
    });

    // 해당 필드 에러 즉시 제거
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ===== 유효성 검사 (서버 DTO EventRequest와 매칭) =====
  const runValidation = () => {
    const e = {};
    const f = form;
    const isBlank = (v) => !v || String(v).trim() === '';

    // @NotBlank
    if (isBlank(f.name)) e.name = '행사명을 입력해주세요.';
    if (isBlank(f.location)) e.location = '장소를 입력해주세요.';
    if (isBlank(f.description)) e.description = '행사 설명을 입력해주세요.';
    if (isBlank(f.contactName)) e.contactName = '담당자 이름을 입력해주세요.';
    if (isBlank(f.contactEmail)) e.contactEmail = '담당자 이메일을 입력해주세요.';
    if (isBlank(f.contactPhone)) e.contactPhone = '담당자 연락처를 입력해주세요.';

    // @NotNull: eventDate, startTime, endTime
    if (isBlank(f.eventDate)) e.eventDate = '행사 날짜를 입력해주세요.';
    if (isBlank(f.startTime)) e.startTime = '시작 시간을 입력해주세요.';
    if (isBlank(f.endTime)) e.endTime = '종료 시간을 입력해주세요.';

    // 전화번호 패턴: 숫자/하이픈만
    if (!e.contactPhone && !/^[0-9-]+$/.test(f.contactPhone)) {
      e.contactPhone = '올바른 전화번호 형식을 입력하세요. (숫자와 하이픈만 허용)';
    }

    // 이메일 형식
    if (!e.contactEmail) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(f.contactEmail)) {
        e.contactEmail = '이메일 형식이 올바르지 않습니다.';
      }
    }

    // 시작시간 분 단위 검증 (정각 또는 30분만 허용)
    if (!e.startTime && f.startTime) {
      const [, minute] = f.startTime.split(':');
      if (minute !== '00' && minute !== '30') {
        e.startTime = '시작시간은 정각(00분) 또는 30분만 입력 가능합니다.';
      }
    }

    // 시간 범위: startTime < endTime
    if (!e.startTime && !e.endTime && f.startTime && f.endTime) {
      // 문자열 "HH:mm" 비교로도 가능하지만, 안전하게 Date 객체로 비교
      const [sh, sm] = f.startTime.split(':').map(Number);
      const [eh, em] = f.endTime.split(':').map(Number);
      const start = sh * 60 + sm;
      const end = eh * 60 + em;
      if (!(start < end)) {
        e.endTime = '시작시간은 종료시간보다 빨라야 합니다.';
      }
    }

    // 행사 날짜가 박람회 기간 내인지(있을 때만 체크)
    const expoStart = expoStartDate ? expoStartDate.split('T')[0] : null;
    const expoEnd = expoEndDate ? expoEndDate.split('T')[0] : null;
    if (!e.eventDate && f.eventDate && (expoStart || expoEnd)) {
      if (expoStart && f.eventDate < expoStart) {
        e.eventDate = '행사 날짜는 박람회 시작일과 같거나 이후여야 합니다.';
      }
      if (expoEnd && f.eventDate > expoEnd) {
        e.eventDate = '행사 날짜는 박람회 종료일과 같거나 이전이어야 합니다.';
      }
    }

    return e;
  };

  const handleSubmit = async () => {
    const v = runValidation();
    setErrors(v);
    if (Object.values(v).some(Boolean)) return; // 에러 있으면 제출 중단

    const success = await onSubmit(form);
    if (success) {
      setForm(initForm());
      setErrors({});
    }
  };

  const handleCancel = () => {
    setForm(initForm());
    setErrors({});
    onCancel?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formGrid}>
        {/* 왼쪽 컬럼 */}
        <div className={styles.column}>
          <div className={styles.formGroup}>
            <label className={styles.label}>행사 이름</label>
            <input
              name="name"
              className={styles.inputField}
              placeholder="행사 이름 입력"
              value={form.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 위치</label>
            <input
              name="location"
              className={styles.inputField}
              placeholder="행사 위치 입력"
              value={form.location}
              onChange={handleChange}
              aria-invalid={!!errors.location}
            />
            {errors.location && <p className={styles.errorText}>{errors.location}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 날짜</label>
            <input
              type="date"
              name="eventDate"
              className={styles.inputField}
              value={form.eventDate}
              onChange={handleChange}
              min={expoStartDate ? expoStartDate.split('T')[0] : undefined}
              max={expoEndDate ? expoEndDate.split('T')[0] : undefined}
              aria-invalid={!!errors.eventDate}
            />
            {errors.eventDate && <p className={styles.errorText}>{errors.eventDate}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 시간</label>
            <div className={styles.timeRange}>
              <input
                type="time"
                name="startTime"
                className={styles.inputField}
                value={form.startTime}
                onChange={handleChange}
                aria-invalid={!!errors.startTime}
                step="1800"
                title="정각(00분) 또는 30분만 선택 가능합니다"
              />
              <span className={styles.timeDivider}>~</span>
              <input
                type="time"
                name="endTime"
                className={styles.inputField}
                value={form.endTime}
                onChange={handleChange}
                aria-invalid={!!errors.endTime}
              />
            </div>
            {(errors.startTime || errors.endTime) && (
              <p className={styles.errorText}>{errors.startTime || errors.endTime}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>행사 소개</label>
            <input
              name="description"
              className={styles.inputField}
              placeholder="행사 소개 입력"
              value={form.description}
              onChange={handleChange}
              aria-invalid={!!errors.description}
            />
            {errors.description && <p className={styles.errorText}>{errors.description}</p>}
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className={styles.column}>
          <div className={styles.formGroup}>
            <label className={styles.label}>담당자명</label>
            <input
              name="contactName"
              className={styles.inputField}
              placeholder="담당자명 입력"
              value={form.contactName}
              onChange={handleChange}
              aria-invalid={!!errors.contactName}
              maxLength={30}
            />
            {errors.contactName && <p className={styles.errorText}>{errors.contactName}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 전화번호</label>
            <input
              name="contactPhone"
              className={styles.inputField}
              placeholder="예: 010-1234-5678"
              value={form.contactPhone}
              onChange={handleChange}
              aria-invalid={!!errors.contactPhone}
              inputMode="numeric"
            />
            {errors.contactPhone && <p className={styles.errorText}>{errors.contactPhone}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>담당자 이메일</label>
            <input
              name="contactEmail"
              className={styles.inputField}
              placeholder="예 : example@company.com"
              value={form.contactEmail}
              onChange={handleChange}
              aria-invalid={!!errors.contactEmail}
              maxLength={100}
            />
            {errors.contactEmail && <p className={styles.errorText}>{errors.contactEmail}</p>}
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
import React, { useState, useEffect } from 'react';
import styles from './DateInput.module.css';

/**
 * 생년월일 입력 컴포넌트 (드롭다운형)
 * @param {Object} props
 * @param {string} props.value - 날짜 값 (YYYYMMDD 또는 YYYY-MM-DD 형태)
 * @param {function} props.onChange - 값 변경 핸들러
 * @param {string} props.name - input name 속성
 * @param {boolean} props.required - 필수 입력 여부
 * @param {boolean} props.showError - 에러 표시 여부
 * @param {string} props.className - 추가 CSS 클래스
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {string} props.format - 출력 형식 ('YYYYMMDD' | 'YYYY-MM-DD'), 기본값: 'YYYYMMDD'
 */
const DateInput = ({
  value = '',
  onChange,
  name = 'birth',
  required = false,
  showError = true,
  className = '',
  disabled = false,
  format = 'YYYYMMDD',
  ...otherProps
}) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // 현재 연도 기준으로 년도 옵션 생성 (1900년부터 현재년도까지)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i).reverse();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 선택된 년/월에 따른 일수 계산
  const getDaysInMonth = (year, month) => {
    if (!year || !month) return [];
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(parseInt(year), parseInt(month));

  // 외부에서 value가 변경될 때 내부 상태 업데이트
  useEffect(() => {
    if (value) {
      // 다양한 날짜 형식 처리
      if (value.includes('-')) {
        // YYYY-MM-DD 형식
        const parts = value.split('-');
        if (parts.length === 3) {
          setYear(parts[0]);
          setMonth(parseInt(parts[1], 10).toString());
          setDay(parseInt(parts[2], 10).toString());
        }
      } else {
        // YYYYMMDD 숫자 형식
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length === 8) {
          setYear(cleanValue.substring(0, 4));
          setMonth(parseInt(cleanValue.substring(4, 6), 10).toString());
          setDay(parseInt(cleanValue.substring(6, 8), 10).toString());
        }
      }
    } else {
      setYear('');
      setMonth('');
      setDay('');
    }
  }, [value]);

  // 날짜 유효성 검사
  const validateDate = (y, m, d) => {
    if (!y || !m || !d) return false;
    
    const yearNum = parseInt(y);
    const monthNum = parseInt(m);
    const dayNum = parseInt(d);
    
    // 기본 범위 체크
    if (yearNum < 1900 || yearNum > currentYear) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    if (dayNum < 1 || dayNum > 31) return false;
    
    // 해당 월에 존재하는 날짜인지 체크
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum > daysInMonth) return false;
    
    // 미래 날짜인지 체크
    const selectedDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();
    if (selectedDate > today) return false;
    
    return true;
  };

  // 전체 날짜 조합 및 부모에게 전달
  const updateFullDate = (y, m, d) => {
    let fullDate = '';
    let isValid = false;

    if (y && m && d) {
      const paddedMonth = m.padStart(2, '0');
      const paddedDay = d.padStart(2, '0');
      
      fullDate = format === 'YYYY-MM-DD' 
        ? `${y}-${paddedMonth}-${paddedDay}` 
        : `${y}${paddedMonth}${paddedDay}`;
      
      isValid = validateDate(y, m, d);
    }

    // 에러 검사
    if (showError && (y || m || d)) {
      setTouched(true);
      if (fullDate && !isValid) {
        setError('올바른 생년월일을 선택해주세요.');
      } else {
        setError('');
      }
    }

    // 부모 컴포넌트에 변경사항 전달
    if (onChange) {
      onChange({
        target: {
          name,
          value: fullDate
        }
      });
    }
  };

  const handleYearChange = (e) => {
    if (disabled) return;
    
    const selectedYear = e.target.value;
    setYear(selectedYear);
    
    // 년도 변경 시 일자가 해당 월에 존재하지 않으면 초기화
    if (month && day) {
      const daysInNewMonth = new Date(parseInt(selectedYear), parseInt(month), 0).getDate();
      if (parseInt(day) > daysInNewMonth) {
        setDay('');
        updateFullDate(selectedYear, month, '');
      } else {
        updateFullDate(selectedYear, month, day);
      }
    } else {
      updateFullDate(selectedYear, month, day);
    }
  };

  const handleMonthChange = (e) => {
    if (disabled) return;
    
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    
    // 월 변경 시 일자가 해당 월에 존재하지 않으면 초기화
    if (year && day) {
      const daysInNewMonth = new Date(parseInt(year), parseInt(selectedMonth), 0).getDate();
      if (parseInt(day) > daysInNewMonth) {
        setDay('');
        updateFullDate(year, selectedMonth, '');
      } else {
        updateFullDate(year, selectedMonth, day);
      }
    } else {
      updateFullDate(year, selectedMonth, day);
    }
  };

  const handleDayChange = (e) => {
    if (disabled) return;
    
    const selectedDay = e.target.value;
    setDay(selectedDay);
    updateFullDate(year, month, selectedDay);
  };

  const hasError = touched && error && showError;

  return (
    <div className={styles.dateInputWrapper}>
      <select
        value={year}
        onChange={handleYearChange}
        disabled={disabled}
        className={`${styles.dateSelect} ${styles.yearSelect} ${hasError ? styles.error : ''}`}
        {...otherProps}
      >
        <option value="">년도</option>
        {years.map(y => (
          <option key={y} value={y}>{y}년</option>
        ))}
      </select>

      <select
        value={month}
        onChange={handleMonthChange}
        disabled={disabled}
        className={`${styles.dateSelect} ${styles.monthSelect} ${hasError ? styles.error : ''}`}
      >
        <option value="">월</option>
        {months.map(m => (
          <option key={m} value={m}>{m}월</option>
        ))}
      </select>

      <select
        value={day}
        onChange={handleDayChange}
        disabled={disabled}
        className={`${styles.dateSelect} ${styles.daySelect} ${hasError ? styles.error : ''}`}
      >
        <option value="">일</option>
        {days.map(d => (
          <option key={d} value={d}>{d}일</option>
        ))}
      </select>

      {hasError && (
        <span className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};

export default DateInput;
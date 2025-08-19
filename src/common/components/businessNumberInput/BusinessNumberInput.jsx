import React, { useState, useEffect, useRef } from 'react';
import styles from './BusinessNumberInput.module.css';

/**
 * 사업자번호 입력 컴포넌트 (3-2-5 자리 분리형)
 * @param {Object} props
 * @param {string} props.value - 사업자번호 값 (123-12-12345 형태 또는 1231212345)
 * @param {function} props.onChange - 값 변경 핸들러
 * @param {string} props.name - input name 속성
 * @param {boolean} props.required - 필수 입력 여부
 * @param {boolean} props.showError - 에러 표시 여부
 * @param {string} props.className - 추가 CSS 클래스
 * @param {boolean} props.disabled - 비활성화 여부
 */
const BusinessNumberInput = ({
  value = '',
  onChange,
  name = 'businessNumber',
  required = false,
  showError = true,
  className = '',
  disabled = false,
  ...otherProps
}) => {
  // 사업자번호를 3개 부분으로 분리 (3-2-5)
  const [part1, setPart1] = useState('');
  const [part2, setPart2] = useState('');
  const [part3, setPart3] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // input refs for auto focus
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  // 외부에서 value가 변경될 때 내부 상태 업데이트
  useEffect(() => {
    if (value) {
      // 하이픈이 있는 경우와 없는 경우 모두 처리
      if (value.includes('-')) {
        const parts = value.split('-');
        setPart1(parts[0] || '');
        setPart2(parts[1] || '');
        setPart3(parts[2] || '');
      } else {
        // 숫자만 있는 경우 (예: "1231212345")
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length >= 3) {
          setPart1(cleanValue.substring(0, 3));
          if (cleanValue.length >= 5) {
            setPart2(cleanValue.substring(3, 5));
            setPart3(cleanValue.substring(5, 10));
          } else if (cleanValue.length > 3) {
            setPart2(cleanValue.substring(3));
            setPart3('');
          }
        } else {
          setPart1(cleanValue);
          setPart2('');
          setPart3('');
        }
      }
    } else {
      setPart1('');
      setPart2('');
      setPart3('');
    }
  }, [value]);

  // 사업자번호 유효성 검사 (간단한 형식 체크)
  const validateBusinessNumber = (fullNumber) => {
    const clean = fullNumber.replace(/\D/g, '');
    return clean.length === 10;
  };

  // 전체 사업자번호 조합 및 부모에게 전달
  const updateFullBusinessNumber = (p1, p2, p3) => {
    const cleanFullNumber = p1 && p2 && p3 ? `${p1}-${p2}-${p3}` : '';

    // 에러 검사
    if (showError && (p1 || p2 || p3)) {
      setTouched(true);
      if (cleanFullNumber && !validateBusinessNumber(cleanFullNumber)) {
        setError('올바른 사업자번호 형식이 아닙니다.');
      } else {
        setError('');
      }
    }

    // 부모 컴포넌트에 변경사항 전달
    if (onChange) {
      onChange({
        target: {
          name,
          value: cleanFullNumber
        }
      });
    }
  };

  // 첫 번째 칸 입력 핸들러 (3자리)
  const handlePart1Change = (e) => {
    if (disabled) return;

    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    if (value.length <= 3) {
      setPart1(value);
      updateFullBusinessNumber(value, part2, part3);

      // 3자리 입력 완료 시 다음 칸으로 포커스
      if (value.length === 3) {
        input2Ref.current?.focus();
      }
    }
  };

  // 두 번째 칸 입력 핸들러 (2자리)
  const handlePart2Change = (e) => {
    if (disabled) return;

    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setPart2(value);
      updateFullBusinessNumber(part1, value, part3);

      // 2자리 입력 완료 시 다음 칸으로 포커스
      if (value.length === 2) {
        input3Ref.current?.focus();
      }
    }
  };

  // 세 번째 칸 입력 핸들러 (5자리)
  const handlePart3Change = (e) => {
    if (disabled) return;

    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 5) {
      setPart3(value);
      updateFullBusinessNumber(part1, part2, value);
    }
  };

  // 백스페이스 처리
  const handleKeyDown = (e, currentPart, prevInputRef) => {
    if (e.key === 'Backspace' && !currentPart && prevInputRef) {
      prevInputRef.current?.focus();
    }
  };

  // 포커스 아웃 핸들러
  const handleBlur = () => {
    setTouched(true);
    const fullNumber = part1 && part2 && part3 ? `${part1}-${part2}-${part3}` : '';
    if (showError && fullNumber && !validateBusinessNumber(fullNumber)) {
      setError('올바른 사업자번호를 입력해주세요.');
    }
  };

  const hasError = touched && error && showError;

  return (
    <div className={styles.businessNumberWrapper}>
      <div className={styles.businessInputRow}>
        <input
          ref={input1Ref}
          type="tel"
          value={part1}
          onChange={handlePart1Change}
          onKeyDown={(e) => handleKeyDown(e, part1, null)}
          onBlur={handleBlur}
          placeholder="123"
          disabled={disabled}
          className={`${styles.businessPartInput} ${styles.part1} ${hasError ? styles.error : ''}`}
          maxLength="3"
          {...otherProps}
        />
        <span className={styles.separator}>-</span>
        <input
          ref={input2Ref}
          type="tel"
          value={part2}
          onChange={handlePart2Change}
          onKeyDown={(e) => handleKeyDown(e, part2, input1Ref)}
          onBlur={handleBlur}
          placeholder="12"
          disabled={disabled}
          className={`${styles.businessPartInput} ${styles.part2} ${hasError ? styles.error : ''}`}
          maxLength="2"
        />
        <span className={styles.separator}>-</span>
        <input
          ref={input3Ref}
          type="tel"
          value={part3}
          onChange={handlePart3Change}
          onKeyDown={(e) => handleKeyDown(e, part3, input2Ref)}
          onBlur={handleBlur}
          placeholder="12345"
          disabled={disabled}
          className={`${styles.businessPartInput} ${styles.part3} ${hasError ? styles.error : ''}`}
          maxLength="5"
        />
      </div>
      {hasError && (
        <span className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};

export default BusinessNumberInput;
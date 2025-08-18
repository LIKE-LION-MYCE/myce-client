/**
 * 전화번호 포맷팅 유틸리티
 */

/**
 * 전화번호를 자동으로 포맷팅합니다.
 * @param {string} phoneNumber - 입력된 전화번호
 * @returns {string} 포맷된 전화번호 (예: 010-1234-5678)
 */
export const formatPhoneNumber = (phoneNumber) => {
  // 숫자만 추출
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // 길이에 따른 포맷팅
  if (cleanNumber.length <= 3) {
    return cleanNumber;
  } else if (cleanNumber.length <= 7) {
    return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3)}`;
  } else if (cleanNumber.length <= 11) {
    return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 7)}-${cleanNumber.slice(7)}`;
  } else {
    // 11자리를 초과하면 11자리까지만 사용
    return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 7)}-${cleanNumber.slice(7, 11)}`;
  }
};

/**
 * 전화번호 유효성 검사
 * @param {string} phoneNumber - 검사할 전화번호
 * @returns {boolean} 유효성 여부
 */
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * 전화번호 입력 이벤트 핸들러
 * @param {string} value - 입력값
 * @param {function} setValue - 상태 업데이트 함수
 * @returns {string} 포맷된 전화번호
 */
export const handlePhoneChange = (value, setValue) => {
  const formatted = formatPhoneNumber(value);
  setValue(formatted);
  return formatted;
};

/**
 * 전화번호 에러 메시지 반환
 * @param {string} phoneNumber - 검사할 전화번호
 * @returns {string|null} 에러 메시지 또는 null
 */
export const getPhoneErrorMessage = (phoneNumber) => {
  if (!phoneNumber) {
    return '전화번호를 입력해주세요.';
  }
  
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  if (cleanNumber.length < 10) {
    return '전화번호가 너무 짧습니다.';
  }
  
  if (cleanNumber.length > 11) {
    return '전화번호가 너무 깁니다.';
  }
  
  if (!validatePhoneNumber(phoneNumber)) {
    return '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
  }
  
  return null;
};
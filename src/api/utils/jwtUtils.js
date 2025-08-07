/**
 * JWT 토큰 관련 유틸리티
 */

/**
 * JWT 토큰을 디코딩하여 페이로드 반환
 * @param {string} token - JWT 토큰
 * @returns {object|null} 디코딩된 페이로드 또는 null
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    // JWT는 header.payload.signature 형태
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Base64 디코딩 (URL-safe Base64)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decoded);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

/**
 * JWT 토큰에서 사용자 ID 추출
 * @param {string} token - JWT 토큰
 * @returns {number|null} 사용자 ID 또는 null
 */
export const getUserIdFromToken = (token) => {
  const payload = decodeJWT(token);
  return payload ? payload.memberId : null; // 'memberId' 클레임에 사용자 ID가 있음
};

/**
 * JWT 토큰에서 사용자 정보 추출
 * @param {string} token - JWT 토큰
 * @returns {object|null} 사용자 정보 또는 null
 */
export const getUserInfoFromToken = (token) => {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return {
    id: payload.memberId,
    loginId: payload.loginId,
    role: payload.role,
    name: payload.name,
    exp: payload.exp,
    iat: payload.iat
  };
};

/**
 * JWT 토큰이 만료되었는지 확인
 * @param {string} token - JWT 토큰
 * @returns {boolean} 만료 여부
 */
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};
import instance from '../../lib/axios';

/**
 * 박람회 요금제 목록 조회
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {string} name - 요금제 이름 필터 (선택사항)
 * @returns {Promise} API 응답
 */
export const getExpoFeeList = async (page = 0, name = null) => {
  const params = { page };
  if (name) params.name = name;
  
  return await instance.get('/api/settings/expo-fee', { params });
};

/**
 * 광고 요금제 목록 조회
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} positionId - 광고 위치 ID (선택사항)
 * @param {string} name - 요금제 이름 필터 (선택사항)
 * @returns {Promise} API 응답
 */
export const getAdFeeList = async (page = 0, positionId = null, name = null) => {
  const params = { page };
  if (positionId) params.position = positionId;
  if (name) params.name = name;
  
  return await instance.get('/api/settings/ad-fee', { params });
};

/**
 * 단일 박람회 요금제 조회 (is_active=1인 요금제)
 * @returns {Promise} 현재 활성화된 박람회 요금제
 */
export const getActiveExpoFee = async () => {
  return await instance.get('/expo/fees/active');
};

/**
 * 활성화된 박람회 요금제 조회 (단일 요금제)
 * @returns {Promise} 활성화된 요금제
 */
export const getActiveExpoFees = async () => {
  return await instance.get('/api/settings/expo-fee/active');
};

/**
 * 활성화된 광고 요금제 조회 (위치별 활성 요금제)
 * @returns {Promise} 활성화된 요금제 목록
 */
export const getActiveAdFees = async () => {
  return await instance.get('/ad/fees/active');
};
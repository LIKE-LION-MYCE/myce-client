// 등급별 이미지 매핑 유틸리티
const GRADE_IMAGE_MAP = {
  // 파일명 매핑
  'BRONZE.png': '/images/grades/BRONZE.png',
  'SILVER.png': '/images/grades/SILVER.png', 
  'GOLD.png': '/images/grades/GOLD.png',
  'PLATINUM.png': '/images/grades/PLATINUM.png',
  'DIAMOND.png': '/images/grades/DIAMOND.png',
  // 등급명 매핑
  'BRONZE': '/images/grades/BRONZE.png',
  'SILVER': '/images/grades/SILVER.png', 
  'GOLD': '/images/grades/GOLD.png',
  'PLATINUM': '/images/grades/PLATINUM.png',
  'DIAMOND': '/images/grades/DIAMOND.png',
  // 한국어 등급명 매핑
  '브론즈': '/images/grades/BRONZE.png',
  '실버': '/images/grades/SILVER.png',
  '골드': '/images/grades/GOLD.png',
  '플래티넘': '/images/grades/PLATINUM.png',
  '다이아몬드': '/images/grades/DIAMOND.png',
  // 기본값
  'DEFAULT': '/images/grades/BRONZE.png'
};

/**
 * 등급 이미지 파일명을 받아서 전체 경로를 반환
 * @param {string} gradeImageUrl - 등급 이미지 파일명 (예: "BRONZE.png", "bronze.png" 등)
 * @returns {string} 이미지 경로
 */
export const getGradeImagePath = (gradeImageUrl) => {
  if (!gradeImageUrl) {
    return GRADE_IMAGE_MAP.DEFAULT;
  }
  
  // 파일명이 이미 전체 경로인 경우 그대로 반환
  if (gradeImageUrl.startsWith('/') || gradeImageUrl.startsWith('http')) {
    return gradeImageUrl;
  }
  
  // 파일명 그대로 경로 조합 (BRONZE.png -> /images/grades/BRONZE.png)
  return `/images/grades/${gradeImageUrl}`;
};

/**
 * 등급 설명을 받아서 해당하는 이미지 경로를 반환 (fallback 용도)
 * @param {string} gradeDescription - 등급 설명 (예: "BRONZE", "브론즈" 등)
 * @returns {string} 이미지 경로
 */
export const getGradeImagePathByDescription = (gradeDescription) => {
  if (!gradeDescription) {
    return GRADE_IMAGE_MAP.DEFAULT;
  }
  
  // 대소문자 구분 없이 매핑
  const normalizedGrade = gradeDescription.toUpperCase().trim();
  
  // 직접 매핑 확인
  if (GRADE_IMAGE_MAP[normalizedGrade]) {
    return GRADE_IMAGE_MAP[normalizedGrade];
  }
  
  // 부분 매칭 (등급명이 포함된 경우)
  for (const [grade, imagePath] of Object.entries(GRADE_IMAGE_MAP)) {
    if (normalizedGrade.includes(grade) || grade.includes(normalizedGrade)) {
      return imagePath;
    }
  }
  
  // 기본 이미지 반환
  return GRADE_IMAGE_MAP.DEFAULT;
};

/**
 * 등급 이미지가 존재하는지 확인
 * @param {string} gradeDescription - 등급 설명
 * @returns {boolean} 이미지 존재 여부
 */
export const hasGradeImage = (gradeDescription) => {
  const imagePath = getGradeImagePath(gradeDescription);
  return imagePath !== GRADE_IMAGE_MAP.DEFAULT;
};

/**
 * 모든 등급 이미지 목록 반환
 * @returns {Array} 등급별 이미지 정보 배열
 */
export const getAllGradeImages = () => {
  return [
    { grade: 'BRONZE', name: '브론즈', image: GRADE_IMAGE_MAP.BRONZE },
    { grade: 'SILVER', name: '실버', image: GRADE_IMAGE_MAP.SILVER },
    { grade: 'GOLD', name: '골드', image: GRADE_IMAGE_MAP.GOLD },
    { grade: 'PLATINUM', name: '플래티넘', image: GRADE_IMAGE_MAP.PLATINUM },
    { grade: 'DIAMOND', name: '다이아몬드', image: GRADE_IMAGE_MAP.DIAMOND }
  ];
};
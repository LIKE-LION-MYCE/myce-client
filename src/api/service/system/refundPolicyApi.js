import instance from "../../lib/axios";

/**
 * 공개 환불 정책 조회 API
 * 인증 없이 누구나 환불 정책을 확인할 수 있는 API
 */

// 현재 활성화된 환불 정책 조회
export const getActiveRefundPolicy = async () => {
  try {
    const response = await instance.get("/settings/refund-fee/public");
    return response.data;
  } catch (error) {
    console.error("환불 정책 조회 실패:", error);
    // API가 없거나 실패하는 경우 기본 정책 반환
    return getDefaultRefundPolicy();
  }
};

// 기본 환불 정책 (백엔드 API가 준비되기 전까지 사용)
export const getDefaultRefundPolicy = () => {
  return {
    policies: [
      {
        id: 1,
        name: "박람회 시작 7일 전까지",
        description: "박람회 시작일로부터 7일 이전까지",
        standardType: "DAYS_BEFORE_START",
        standardDayCount: 7,
        feeRate: 0.00, // 0% 수수료 (100% 환불)
        refundRate: 1.00
      },
      {
        id: 2,
        name: "박람회 시작 3~6일 전까지",
        description: "박람회 시작일로부터 3~6일 이전까지",
        standardType: "DAYS_BEFORE_START",
        standardDayCount: 3,
        feeRate: 0.20, // 20% 수수료 (80% 환불)
        refundRate: 0.80
      },
      {
        id: 3,
        name: "박람회 시작 1~2일 전까지",
        description: "박람회 시작일로부터 1~2일 이전까지",
        standardType: "DAYS_BEFORE_START",
        standardDayCount: 1,
        feeRate: 0.50, // 50% 수수료 (50% 환불)
        refundRate: 0.50
      },
      {
        id: 4,
        name: "박람회 당일",
        description: "박람회 시작일 당일",
        standardType: "DAYS_BEFORE_START",
        standardDayCount: 0,
        feeRate: 1.00, // 100% 수수료 (환불 불가)
        refundRate: 0.00
      }
    ]
  };
};

// 환불 정책을 읽기 쉬운 형태로 포맷팅
export const formatRefundPolicy = (policies) => {
  return policies.map(policy => {
    // 백엔드에서 이미 displayText가 있는 경우 그대로 사용
    if (policy.displayText) {
      return policy;
    }
    
    // 없는 경우 생성
    const refundPercentage = Math.round(policy.refundRate * 100);
    
    if (refundPercentage === 0) {
      return {
        ...policy,
        displayText: `${policy.name}: 환불 불가`
      };
    } else {
      return {
        ...policy,
        displayText: `${policy.name}: ${refundPercentage}% 환불`
      };
    }
  });
};
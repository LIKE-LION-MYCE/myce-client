import React, { useState } from "react";
import styles from "./UsageGuidelines.module.css";

const UsageGuidelines = ({ type }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const expoGuidelines = [
    {
      title: "신청 자격",
      items: [
        "법인 사업자 또는 개인 사업자만 신청 가능합니다.",
        "박람회 개최 경험 또는 관련 업종 운영 경험이 있어야 합니다.",
        "신청 시 사업자등록증 및 관련 서류 제출이 필요합니다."
      ]
    },
    {
      title: "승인 기준",
      items: [
        "박람회 내용이 건전하고 법적 문제가 없어야 합니다.",
        "제출된 서류가 완전하고 정확해야 합니다.",
        "플랫폼 정책에 부합하는 박람회여야 합니다.",
        "중복 신청이 아니어야 합니다."
      ]
    },
    {
      title: "주의사항",
      items: [
        "승인 후 박람회 정보 변경 시 재승인이 필요할 수 있습니다.",
        "게시 기간은 박람회 개최 기간을 초과할 수 없습니다.",
        "부적절한 내용 발견 시 승인이 취소될 수 있습니다.",
        "결제 완료 후 취소 시 수수료가 발생할 수 있습니다."
      ]
    },
    {
      title: "환불 정책",
      items: [
        "승인 대기 중 취소: 100% 환불",
        "결제 완료 후 개최 30일 전 취소: 80% 환불",
        "개최 30일 이내 취소: 50% 환불",
        "개최 7일 이내 취소: 환불 불가"
      ]
    }
  ];

  const adGuidelines = [
    {
      title: "광고 규정",
      items: [
        "법적으로 문제없는 건전한 광고 내용이어야 합니다.",
        "타인의 저작권을 침해하지 않는 이미지를 사용해야 합니다.",
        "허위 또는 과장 광고는 금지됩니다.",
        "성인 콘텐츠, 도박, 불법 상품 광고는 불가합니다."
      ]
    },
    {
      title: "이미지 규격",
      items: [
        "파일 형식: JPG, PNG, GIF, WebP만 허용",
        "파일 크기: 10MB 이하",
        "권장 해상도: 1200x628px (가로:세로 = 1.91:1)",
        "텍스트가 포함된 경우 가독성을 고려해주세요."
      ]
    },
    {
      title: "게시 정책",
      items: [
        "광고 심사는 영업일 기준 1-3일 소요됩니다.",
        "부적절한 광고로 판단 시 승인이 거절될 수 있습니다.",
        "게시 중 정책 위반 발견 시 즉시 게시가 중단됩니다.",
        "동일 광고 위치에 중복 예약은 불가능합니다."
      ]
    },
    {
      title: "환불 정책",
      items: [
        "승인 대기 중 취소: 100% 환불",
        "게시 시작 3일 전 취소: 70% 환불",
        "게시 중 취소: 남은 기간 비례 환불",
        "게시 완료 후: 환불 불가"
      ]
    }
  ];

  const guidelines = type === "expo" ? expoGuidelines : adGuidelines;
  const title = type === "expo" ? "박람회 신청 주의사항" : "광고 신청 주의사항";

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className={styles.title}>{title}</h3>
        <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ""}`}>
          ▼
        </span>
      </div>
      
      {isExpanded && (
        <div className={styles.content}>
          {guidelines.map((section, index) => (
            <div key={index} className={styles.section}>
              <h4 className={styles.sectionTitle}>{section.title}</h4>
              <ul className={styles.itemList}>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className={styles.item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsageGuidelines;
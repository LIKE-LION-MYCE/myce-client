import React, { useState } from "react";
import styles from "./PricingInfo.module.css";

const PricingInfo = ({ type }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const expoPricing = [
    {
      category: "기본 수수료",
      items: [
        { name: "플랫폼 이용료", price: "월 50,000원", description: "기본 박람회 등록 및 관리" },
        { name: "결제 수수료", price: "매출의 3%", description: "티켓 판매 시 발생" }
      ]
    },
    {
      category: "추가 서비스",
      items: [
        { name: "프리미엄 배치", price: "월 +30,000원", description: "메인 페이지 상단 노출" },
        { name: "마케팅 지원", price: "월 +20,000원", description: "SNS 홍보 및 이벤트 지원" },
        { name: "전용 채팅", price: "월 +10,000원", description: "관람객과의 실시간 소통" }
      ]
    },
    {
      category: "할인 혜택",
      items: [
        { name: "신규 회원", price: "첫 달 50% 할인", description: "첫 박람회 등록 시" },
        { name: "장기 계약", price: "6개월 이상 10% 할인", description: "6개월 이상 계약 시" },
        { name: "우수 파트너", price: "최대 20% 할인", description: "평점 4.5 이상 유지 시" }
      ]
    }
  ];

  const adPricing = [
    {
      category: "광고 위치별 요금",
      items: [
        { name: "메인 배너 (상단)", price: "일 50,000원", description: "메인 페이지 최상단 배너" },
        { name: "사이드 배너", price: "일 20,000원", description: "사이드바 광고 영역" },
        { name: "하단 배너", price: "일 15,000원", description: "페이지 하단 광고 영역" },
        { name: "팝업 광고", price: "일 30,000원", description: "페이지 로딩 시 팝업" }
      ]
    },
    {
      category: "기간별 할인",
      items: [
        { name: "1주일 (7일)", price: "5% 할인", description: "단기 광고 캠페인" },
        { name: "2주일 (14일)", price: "10% 할인", description: "중기 광고 캠페인" },
        { name: "1개월 (30일)", price: "15% 할인", description: "장기 광고 캠페인" },
        { name: "3개월 이상", price: "20% 할인", description: "대규모 광고 캠페인" }
      ]
    },
    {
      category: "추가 서비스",
      items: [
        { name: "광고 분석 리포트", price: "+일 2,000원", description: "클릭률, 노출수 등 상세 분석" },
        { name: "타겟팅 광고", price: "+일 5,000원", description: "연령, 지역별 맞춤 노출" },
        { name: "A/B 테스트", price: "+일 3,000원", description: "광고 효과 최적화" }
      ]
    }
  ];

  const pricing = type === "expo" ? expoPricing : adPricing;
  const title = type === "expo" ? "박람회 요금제 안내" : "광고 요금제 안내";

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
          {pricing.map((category, index) => (
            <div key={index} className={styles.category}>
              <h4 className={styles.categoryTitle}>{category.category}</h4>
              <div className={styles.itemGrid}>
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={styles.priceItem}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemPrice}>{item.price}</span>
                    </div>
                    <p className={styles.itemDescription}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className={styles.notice}>
            <h4 className={styles.noticeTitle}>💡 참고사항</h4>
            <ul className={styles.noticeList}>
              <li>모든 요금은 부가세(VAT) 별도입니다.</li>
              <li>요금은 예고 없이 변경될 수 있습니다.</li>
              <li>문의사항은 고객센터로 연락해주세요.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingInfo;
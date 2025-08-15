import React, { useState, useEffect } from "react";
import { getActiveExpoFee, getActiveAdFees } from "../../../api/service/fee/feeApi";
import styles from "./PricingInfo.module.css";

const PricingInfo = ({ type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API에서 데이터 로드
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (type === "expo") {
          const response = await getActiveExpoFee();
          setPricingData(formatExpoPricingData([response.data]));
        } else {
          const response = await getActiveAdFees();
          setPricingData(formatAdPricingData(response.data));
        }
      } catch (err) {
        console.error('요금제 정보 로드 실패:', err);
        setError('요금제 정보를 불러오는데 실패했습니다.');
        // 에러 시 기본 데이터 표시
        setPricingData(getDefaultPricingData(type));
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, [type]);

  // 박람회 요금제 데이터 포맷팅
  const formatExpoPricingData = (feeList) => {
    if (!feeList || feeList.length === 0) {
      return getDefaultPricingData("expo");
    }

    const categories = [];
    
    feeList.forEach(fee => {
      categories.push({
        category: fee.name || "박람회 요금제",
        items: [
          {
            name: "일 사용료",
            price: `${Number(fee.dailyUsageFee || fee.daily_usage_fee || 0).toLocaleString()}원/일`,
            description: "박람회 게시 1일당 사용료"
          },
          {
            name: "기본 등록금 (보증금)",
            price: `${Number(fee.deposit || 0).toLocaleString()}원`,
            description: "박람회 등록 시 필요한 기본 보증금"
          },
          {
            name: "프리미엄 이용료",
            price: `${Number(fee.premiumDeposit || fee.premium_deposit || 0).toLocaleString()}원`,
            description: "프리미엄 기능 이용 시 추가 요금"
          },
          {
            name: "티켓 수수료",
            price: `${Number(fee.settlementCommission || fee.settlement_commission || 0)}%`,
            description: "티켓 판매 시 발생하는 수수료율"
          }
        ]
      });
    });

    return categories;
  };

  // 광고 요금제 데이터 포맷팅
  const formatAdPricingData = (feeList) => {
    if (!feeList || feeList.length === 0) {
      return getDefaultPricingData("ad");
    }

    // 모든 광고 위치를 하나의 "기본 요금제" 카테고리로 묶음
    const categories = [{
      category: "기본 요금제",
      items: feeList.map(fee => ({
        name: fee.position, // 위치명을 아이템 이름으로 사용 (예: "메인 배너", "사이드 배너")
        price: `${Number(fee.feePerDay || 0).toLocaleString()}원/일`,
        description: `${fee.position} 위치에 광고 게시 시 일당 요금`
      }))
    }];

    return categories;
  };

  // 기본 데이터 (API 실패 시 사용)
  const getDefaultPricingData = (dataType) => {
    if (dataType === "expo") {
      return [{
        category: "박람회 기본 요금",
        items: [
          { name: "표준 박람회", price: "문의", description: "기본 박람회 개최 서비스" }
        ]
      }];
    } else {
      return [{
        category: "광고 기본 요금",
        items: [
          { name: "기본 광고", price: "문의", description: "기본 광고 게시 서비스" }
        ]
      }];
    }
  };
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
          {loading ? (
            <div className={styles.loading}>요금제 정보를 불러오는 중...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
              {pricingData.map((category, index) => (
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
                  <li>모든 요금은 부가세(VAT) 포함 입니다.</li>
                  <li>문의사항은 고객센터로 연락해주세요.</li>
                </ul>
              </div>
          </>
          )}
        </div>
      )}
    </div>
  );
};

export default PricingInfo;
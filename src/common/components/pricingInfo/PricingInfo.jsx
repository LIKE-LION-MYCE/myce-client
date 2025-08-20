import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { getActiveExpoFee, getActiveAdFees } from "../../../api/service/fee/feeApi";
import styles from "./PricingInfo.module.css";

const PricingInfo = ({ type }) => {
  const { t } = useTranslation();
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
        setError(t(`pricingInfo.${type}.error`));
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
        category: fee.name || t('pricingInfo.expo.categories.default'),
        items: [
          {
            name: t('pricingInfo.expo.items.dailyUsage'),
            price: `${Number(fee.dailyUsageFee || fee.daily_usage_fee || 0).toLocaleString()}${t('pricingInfo.expo.units.daily')}`,
            description: t('pricingInfo.expo.descriptions.dailyUsage')
          },
          {
            name: t('pricingInfo.expo.items.basicDeposit'),
            price: `${Number(fee.deposit || 0).toLocaleString()}${t('pricingInfo.expo.units.currency')}`,
            description: t('pricingInfo.expo.descriptions.basicDeposit')
          },
          {
            name: t('pricingInfo.expo.items.premiumFee'),
            price: `${Number(fee.premiumDeposit || fee.premium_deposit || 0).toLocaleString()}${t('pricingInfo.expo.units.currency')}`,
            description: t('pricingInfo.expo.descriptions.premiumFee')
          },
          {
            name: t('pricingInfo.expo.items.ticketCommission'),
            price: `${Number(fee.settlementCommission || fee.settlement_commission || 0)}${t('pricingInfo.expo.units.percent')}`,
            description: t('pricingInfo.expo.descriptions.ticketCommission')
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

    // 모든 광고 위치를 하나의 "기본 요금제" 카테곦0리로 묶음
    const categories = [{
      category: t('pricingInfo.ad.categories.basic'),
      items: feeList.map(fee => ({
        name: fee.position, // 위치명을 아이템 이름으로 사용 (예: "메인 배너", "사이드 배너")
        price: `${Number(fee.feePerDay || 0).toLocaleString()}${t('pricingInfo.expo.units.daily')}`,
        description: `${fee.position} ${t('pricingInfo.expo.descriptions.adPosition')}`
      }))
    }];

    return categories;
  };

  // 기본 데이터 (API 실패 시 사용)
  const getDefaultPricingData = (dataType) => {
    if (dataType === "expo") {
      return [{
        category: t('pricingInfo.expo.categories.basic'),
        items: [
          { name: t('pricingInfo.expo.items.standard'), price: t('pricingInfo.expo.units.inquiry'), description: t('pricingInfo.expo.descriptions.standard') }
        ]
      }];
    } else {
      return [{
        category: t('pricingInfo.ad.categories.default'),
        items: [
          { name: t('pricingInfo.ad.items.basicAd'), price: t('pricingInfo.expo.units.inquiry'), description: t('pricingInfo.ad.descriptions.basicAd') }
        ]
      }];
    }
  };

  const title = t(`pricingInfo.${type}.title`);

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
            <div className={styles.loading}>{t(`pricingInfo.${type}.loading`)}</div>
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
                <h4 className={styles.noticeTitle}>{t('pricingInfo.expo.notice.title')}</h4>
                <ul className={styles.noticeList}>
                  {t('pricingInfo.expo.notice.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
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
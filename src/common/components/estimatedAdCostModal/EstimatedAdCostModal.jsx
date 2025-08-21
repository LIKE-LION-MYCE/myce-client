import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAdPositions } from '../../../api/service/user/adPositionApi';
import { getActiveAdFees } from '../../../api/service/fee/feeApi';
import styles from './EstimatedAdCostModal.module.css';

const EstimatedAdCostModal = ({ 
  isOpen, 
  onClose, 
  displayStartDate, 
  displayEndDate, 
  selectedPositionId 
}) => {
  const { t } = useTranslation();
  const [adPositions, setAdPositions] = useState([]);
  const [adFees, setAdFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 광고 기간 계산 (일 수)
  const calculateDisplayDays = () => {
    if (!displayStartDate || !displayEndDate) return 0;
    
    const start = new Date(displayStartDate);
    const end = new Date(displayEndDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1은 시작일 포함
    return diffDays;
  };

  // 광고 위치 및 요금 데이터 로드
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 병렬로 두 API 호출
        const [positions, fees] = await Promise.all([
          getAdPositions(),
          getActiveAdFees()
        ]);
        
        setAdPositions(positions);
        setAdFees(fees.data);
        
        console.log('광고 위치:', positions);
        console.log('광고 요금:', fees.data);
      } catch (err) {
        console.error('광고 정보 로드 실패:', err);
        setError(t('estimatedAdCostModal.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // 예상 이용료 계산
  const calculateAdCost = () => {
    if (!adPositions.length || !adFees.length || !selectedPositionId) return null;

    // 선택된 광고 위치 찾기
    const selectedPosition = adPositions.find(pos => pos.id === parseInt(selectedPositionId));
    if (!selectedPosition) return null;

    // 해당 위치의 요금 정보 찾기 (position 이름으로 매칭)
    const positionFee = adFees.find(fee => fee.position === selectedPosition.name);
    if (!positionFee) return null;

    const displayDays = calculateDisplayDays();
    const dailyFee = positionFee.feePerDay || 0;
    const totalCost = dailyFee * displayDays;

    return {
      displayDays,
      dailyFee,
      totalCost,
      positionName: selectedPosition.name,
      positionDescription: selectedPosition.description || positionFee.description
    };
  };

  if (!isOpen) return null;

  const adCost = calculateAdCost();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('estimatedAdCostModal.title')}</h2>
          <button className={styles.closeButton} onClick={onClose}>{t('estimatedAdCostModal.buttons.close')}</button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>{t('estimatedAdCostModal.loading')}</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : adCost ? (
            <>
              <div className={styles.summarySection}>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>{t('estimatedAdCostModal.summary.period')}</span>
                  <span className={styles.value}>
                    {displayStartDate} ~ {displayEndDate} ({adCost.displayDays}{t('estimatedAdCostModal.summary.days')})
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>{t('estimatedAdCostModal.summary.position')}</span>
                  <span className={styles.value}>{adCost.positionName}</span>
                </div>
                {adCost.positionDescription && (
                  <div className={styles.summaryItem}>
                    <span className={styles.label}>{t('estimatedAdCostModal.summary.description')}</span>
                    <span className={styles.value}>{adCost.positionDescription}</span>
                  </div>
                )}
              </div>

              <div className={styles.costDetails}>
                <h3 className={styles.sectionTitle}>{t('estimatedAdCostModal.costDetails.title')}</h3>
                
                <div className={styles.costItem}>
                  <span className={styles.itemLabel}>{t('estimatedAdCostModal.costDetails.dailyFee')}</span>
                  <span className={styles.itemValue}>{adCost.dailyFee.toLocaleString()}{t('estimatedAdCostModal.costDetails.dailyUnit')}</span>
                </div>
                
                <div className={styles.costItem}>
                  <span className={styles.itemLabel}>{t('estimatedAdCostModal.costDetails.period')}</span>
                  <span className={styles.itemValue}>{adCost.displayDays}{t('estimatedAdCostModal.summary.days')}</span>
                </div>
                
                <div className={styles.divider}></div>
                
                <div className={styles.totalSection}>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>{t('estimatedAdCostModal.costDetails.totalCost')}</span>
                    <span className={styles.finalAmount}>{adCost.totalCost.toLocaleString()}{t('estimatedAdCostModal.costDetails.currency')}</span>
                  </div>
                </div>
              </div>

              <div className={styles.notice}>
                <h4 className={styles.noticeTitle}>{t('estimatedAdCostModal.notice.title')}</h4>
                <ul className={styles.noticeList}>
                  {t('estimatedAdCostModal.notice.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className={styles.noData}>
              {!selectedPositionId ? 
                t('estimatedAdCostModal.noData.selectPosition') : 
                !displayStartDate || !displayEndDate ? 
                t('estimatedAdCostModal.noData.selectPeriod') : 
                t('estimatedAdCostModal.noData.cannotCalculate')
              }
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={onClose}>
            {t('estimatedAdCostModal.buttons.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimatedAdCostModal;
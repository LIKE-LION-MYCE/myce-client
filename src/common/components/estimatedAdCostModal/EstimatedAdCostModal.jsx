import React, { useState, useEffect } from 'react';
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
        setError('광고 정보를 불러오는데 실패했습니다.');
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
          <h2 className={styles.title}>예상 광고 이용료</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>광고 정보를 불러오는 중...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : adCost ? (
            <>
              <div className={styles.summarySection}>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>광고 기간:</span>
                  <span className={styles.value}>
                    {displayStartDate} ~ {displayEndDate} ({adCost.displayDays}일)
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>광고 위치:</span>
                  <span className={styles.value}>{adCost.positionName}</span>
                </div>
                {adCost.positionDescription && (
                  <div className={styles.summaryItem}>
                    <span className={styles.label}>위치 설명:</span>
                    <span className={styles.value}>{adCost.positionDescription}</span>
                  </div>
                )}
              </div>

              <div className={styles.costDetails}>
                <h3 className={styles.sectionTitle}>상세 요금</h3>
                
                <div className={styles.costItem}>
                  <span className={styles.itemLabel}>일 이용료</span>
                  <span className={styles.itemValue}>{adCost.dailyFee.toLocaleString()}원/일</span>
                </div>
                
                <div className={styles.costItem}>
                  <span className={styles.itemLabel}>광고 기간</span>
                  <span className={styles.itemValue}>{adCost.displayDays}일</span>
                </div>
                
                <div className={styles.divider}></div>
                
                <div className={styles.totalSection}>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>예상 총 이용료</span>
                    <span className={styles.finalAmount}>{adCost.totalCost.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className={styles.notice}>
                <h4 className={styles.noticeTitle}>💡 안내사항</h4>
                <ul className={styles.noticeList}>
                  <li>위 금액은 입력하신 정보를 바탕으로 한 예상 금액입니다.</li>
                  <li>실제 결제 시 금액이 다를 수 있습니다.</li>
                  <li>모든 요금은 부가세(VAT) 포함 금액입니다.</li>
                  <li>광고 승인 후 결제가 진행됩니다.</li>
                </ul>
              </div>
            </>
          ) : (
            <div className={styles.noData}>
              {!selectedPositionId ? 
                "광고 위치를 선택해주세요." : 
                !displayStartDate || !displayEndDate ? 
                "광고 기간을 입력해주세요." : 
                "예상 이용료를 계산할 수 없습니다."
              }
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimatedAdCostModal;
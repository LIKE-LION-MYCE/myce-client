import React, { useState, useEffect } from 'react';
import TrafficLight from '../../common/TrafficLight/TrafficLight';
import styles from './CongestionModal.module.css';

const CongestionModal = ({ isOpen, onClose, expoId, getCongestionData }) => {
  const [congestionData, setCongestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && expoId && expoId !== undefined) {
      fetchCongestionData();
    }
  }, [isOpen, expoId]);

  const fetchCongestionData = async () => {
    if (!expoId || expoId === undefined) {
      setError('박람회 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getCongestionData(expoId);
      setCongestionData(response.data);
    } catch (err) {
      console.error('혼잡도 조회 실패:', err);
      setError('혼잡도 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchCongestionData();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>실시간 혼잡도</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>혼잡도 정보를 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
              <button className={styles.retryButton} onClick={handleRefresh}>
                다시 시도
              </button>
            </div>
          )}

          {congestionData && !loading && (
            <div className={styles.congestionInfo}>
              <div className={styles.statusSection}>
                <div className={styles.trafficLightContainer}>
                  <TrafficLight level={congestionData.level} />
                </div>
                <div className={styles.statusText}>
                  <h3 className={styles.levelName}>{congestionData.levelDisplayName}</h3>
                  <p className={styles.message}>{congestionData.message}</p>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>적정 1시간 입장자 수</span>
                  <span className={styles.statValue}>{congestionData.hourlyCapacity?.toLocaleString()}명</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>최근 1시간 현장 입장자 수</span>
                  <span className={styles.statValue}>{congestionData.hourlyVisitors?.toLocaleString()}명</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>혼잡도</span>
                  <span className={styles.statValue}>
                    {Math.round((congestionData.hourlyVisitors / congestionData.hourlyCapacity) * 100)}%
                  </span>
                </div>
              </div>

              <div className={styles.lastUpdate}>
                <span>마지막 업데이트: {new Date().toLocaleString('ko-KR')}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.refreshButton} onClick={handleRefresh} disabled={loading}>
            새로고침
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongestionModal;
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TrafficLight from '../../common/TrafficLight/TrafficLight';
import styles from './CongestionModal.module.css';

const CongestionModal = ({ isOpen, onClose, expoId, getCongestionData }) => {
  const { t } = useTranslation();
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
      setError(t('congestionModal.errors.notFound'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getCongestionData(expoId);
      setCongestionData(response.data);
    } catch (err) {
      console.error('혼잡도 조회 실패:', err);
      setError(t('congestionModal.errors.loadFailed'));
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
          <h2 className={styles.title}>{t('congestionModal.title')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>{t('congestionModal.loading')}</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
              <button className={styles.retryButton} onClick={handleRefresh}>
                {t('congestionModal.buttons.retry')}
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
                  <span className={styles.statLabel}>{t('congestionModal.stats.hourlyCapacity')}</span>
                  <span className={styles.statValue}>{congestionData.hourlyCapacity?.toLocaleString()}{t('congestionModal.stats.people')}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>{t('congestionModal.stats.hourlyVisitors')}</span>
                  <span className={styles.statValue}>{congestionData.hourlyVisitors?.toLocaleString()}{t('congestionModal.stats.people')}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>{t('congestionModal.stats.congestionRate')}</span>
                  <span className={styles.statValue}>
                    {Math.round((congestionData.hourlyVisitors / congestionData.hourlyCapacity) * 100)}%
                  </span>
                </div>
              </div>

              <div className={styles.lastUpdate}>
                <span>{t('congestionModal.lastUpdate')} {new Date().toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.refreshButton} onClick={handleRefresh} disabled={loading}>
            {t('congestionModal.buttons.refresh')}
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            {t('congestionModal.buttons.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongestionModal;
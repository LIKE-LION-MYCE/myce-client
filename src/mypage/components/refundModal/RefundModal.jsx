import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RefundModal.module.css';
import instance from '../../../api/lib/axios';

const RefundModal = ({ isOpen, onClose, reservationId, onRefundComplete }) => {
  const { t } = useTranslation();
  const [refundInfo, setRefundInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reason, setReason] = useState('personal');

  // 환불 정보 조회
  const getRefundPreview = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/refund/reservation/${reservationId}/preview`);
      setRefundInfo(response.data);
    } catch (error) {
      alert(error.response?.data?.message || t('refundModal.messages.errorFetch'));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // 실제 환불 처리
  const handleRefund = async () => {
    if (!window.confirm(t('refundModal.messages.confirmRefund'))) return;
    
    try {
      setProcessing(true);
      const reasonKey = t(`refundModal.reasons.${reason}`);
      await instance.post(`/refund/reservation/${reservationId}?reason=${encodeURIComponent(reasonKey)}`);
      alert(t('refundModal.messages.refundCompleted'));
      onRefundComplete();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || t('refundModal.messages.errorProcess'));
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (isOpen && reservationId) {
      getRefundPreview();
    }
  }, [isOpen, reservationId]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{t('refundModal.title')}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {loading ? (
          <div className={styles.loading}>{t('refundModal.loading')}</div>
        ) : refundInfo ? (
          <div className={styles.content}>
            <div className={styles.infoSection}>
              <h4>{t('refundModal.sections.refundInfo')}</h4>
              <div className={styles.infoItem}>
                <span>{t('refundModal.fields.originalAmount')}:</span>
                <span>{refundInfo.originalAmount?.toLocaleString()}{t('refundModal.units.currency')}</span>
              </div>
              <div className={styles.infoItem}>
                <span>{t('refundModal.fields.refundFee')}:</span>
                <span className={styles.fee}>-{refundInfo.refundFee?.toLocaleString()}{t('refundModal.units.currency')}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.highlight}>{t('refundModal.fields.actualRefundAmount')}:</span>
                <span className={styles.highlight}>{refundInfo.actualRefundAmount?.toLocaleString()}{t('refundModal.units.currency')}</span>
              </div>
              <div className={styles.infoItem}>
                <span>{t('refundModal.fields.restoreMileage')}:</span>
                <span className={styles.positive}>+{refundInfo.restoreMileage?.toLocaleString()}{t('refundModal.units.points')}</span>
              </div>
              <div className={styles.infoItem}>
                <span>{t('refundModal.fields.deductMileage')}:</span>
                <span className={styles.negative}>-{refundInfo.deductMileage?.toLocaleString()}{t('refundModal.units.points')}</span>
              </div>
              <div className={styles.feeDescription}>
                <small>{refundInfo.feeDescription}</small>
              </div>
            </div>

            <div className={styles.reasonSection}>
              <label htmlFor="reason">{t('refundModal.fields.cancelReason')}:</label>
              <select 
                id="reason" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                className={styles.reasonSelect}
              >
                <option value="personal">{t('refundModal.reasons.personal')}</option>
                <option value="schedule">{t('refundModal.reasons.schedule')}</option>
                <option value="health">{t('refundModal.reasons.health')}</option>
                <option value="other">{t('refundModal.reasons.other')}</option>
              </select>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.cancelBtn} 
                onClick={onClose}
                disabled={processing}
              >
                {t('refundModal.buttons.cancel')}
              </button>
              <button 
                className={styles.refundBtn} 
                onClick={handleRefund}
                disabled={processing || refundInfo.actualRefundAmount <= 0}
              >
                {processing ? t('refundModal.buttons.processing') : t('refundModal.buttons.refund')}
              </button>
            </div>

            {refundInfo.actualRefundAmount <= 0 && (
              <div className={styles.warning}>
                {t('refundModal.messages.noRefundWarning')}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RefundModal;
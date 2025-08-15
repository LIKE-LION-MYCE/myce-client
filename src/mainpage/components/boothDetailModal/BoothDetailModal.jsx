import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from './BoothDetailModal.module.css';

const BoothDetailModal = ({ booth, isOpen, onClose }) => {
  if (!isOpen || !booth) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.titleSection}>
            <h2>{booth.name}</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {booth.mainImageUrl && (
            <div className={styles.imageSection}>
              <img 
                src={booth.mainImageUrl} 
                alt={booth.name}
                className={styles.boothImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className={styles.infoSection}>
            <div className={styles.boothLocationSection}>
              <h3>부스 위치</h3>
              <p className={styles.boothLocation}>
                #{booth.boothNumber}
              </p>
            </div>

            <div className={styles.descriptionSection}>
              <h3>부스 설명</h3>
              <p className={styles.description}>
                {booth.description || '부스 설명이 없습니다.'}
              </p>
            </div>

            <div className={styles.contactSection}>
              <h3>담당자 정보</h3>
              <div className={styles.contactInfo}>
                {booth.contactName && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>담당자명</span>
                    <span className={styles.contactValue}>{booth.contactName}</span>
                  </div>
                )}
                {booth.contactPhone && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>연락처</span>
                    <span className={styles.contactValue}>{booth.contactPhone}</span>
                  </div>
                )}
                {booth.contactEmail && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>이메일</span>
                    <span className={styles.contactValue}>{booth.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothDetailModal;
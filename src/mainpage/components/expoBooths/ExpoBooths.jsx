import React, { useState } from 'react';
import styles from './ExpoBooths.module.css';
import BoothDetailModal from '../boothDetailModal/BoothDetailModal';


const ExpoBooths = ({ booths }) => {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooth(null);
  };

  return (
    <div className={styles.boothsSection}>
      <h3>부스 정보</h3>
      {booths && booths.length > 0 ? (
        <div className={styles.boothsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>부스 번호</div>
            <div className={styles.headerCell}>부스명</div>
            <div className={styles.headerCell}>담당자</div>
          </div>
          <div className={styles.tableBody}>
            {booths.map((booth) => (
              <div 
                key={booth.id} 
                className={`${styles.tableRow} ${booth.isPremium ? styles.premiumRow : ''}`}
                onClick={() => handleBoothClick(booth)}
              >
                <div className={styles.tableCell}>
                  <span className={styles.boothNumber}>#{booth.boothNumber}</span>
                </div>
                <div className={styles.tableCell}>
                  <span className={styles.boothName}>{booth.name}</span>
                </div>
                <div className={styles.tableCell}>
                  <span className={styles.contactName}>
                    {booth.contactName || '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.emptyMessage}>등록된 부스가 없습니다.</p>
      )}

      <BoothDetailModal
        booth={selectedBooth}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ExpoBooths;
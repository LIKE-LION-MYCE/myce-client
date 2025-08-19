import React, { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import styles from './ExpoBooths.module.css';
import BoothDetailModal from '../boothDetailModal/BoothDetailModal';


const ExpoBooths = ({ booths }) => {
  const { t } = useTranslation();
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooth(null);
  };

  // 프리미엄 부스와 일반 부스 분리 및 검색 필터링
  const { premiumBooths, regularBooths } = useMemo(() => {
    if (!booths || booths.length === 0) {
      return { premiumBooths: [], regularBooths: [] };
    }

    const premium = booths
      .filter(booth => booth.isPremium)
      .sort((a, b) => (a.displayRank || 999) - (b.displayRank || 999))
      .slice(0, 3); // 상위 3개만

    let regular = booths.filter(booth => !booth.isPremium);
    
    // 검색 필터링 적용 (일반 부스만)
    if (searchText) {
      regular = regular.filter(
        (booth) =>
          (booth.name && booth.name.toLowerCase().includes(searchText.toLowerCase())) ||
          (booth.description && booth.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    return { premiumBooths: premium, regularBooths: regular };
  }, [booths, searchText]);

  return (
    <div className={styles.boothsSection}>
      <h3>{t('expoDetail.expoBooths.title', '부스 정보')}</h3>
      
      {/* 프리미엄 부스 카드 섹션 */}
      {premiumBooths.length > 0 && (
        <div className={styles.premiumSection}>
          <h4 className={styles.sectionTitle}>
            {t('expoDetail.expoBooths.premiumTitle', '추천 부스')}
          </h4>
          <div className={styles.premiumCards}>
            {premiumBooths.map((booth) => (
              <div 
                key={booth.id} 
                className={styles.premiumCard}
                onClick={() => handleBoothClick(booth)}
              >
                <div className={styles.premiumRank}>
                  {booth.displayRank || 1}
                </div>
                {/* 부스 이미지 (필수) */}
                <div className={styles.premiumImageContainer}>
                  <img 
                    src={booth.mainImageUrl} 
                    alt={booth.name}
                    className={styles.premiumImage}
                  />
                </div>
                <div className={styles.premiumContent}>
                  <h5 className={styles.premiumBoothName}>{booth.name}</h5>
                  <p className={styles.premiumBoothNumber}>#{booth.boothNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 일반 부스 테이블 섹션 */}
      <div className={styles.regularSection}>
        <h4 className={styles.sectionTitle}>{t('expoDetail.expoBooths.regularTitle', '부스 목록')}</h4>
        
        {/* 검색바 */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t('expoDetail.expoBooths.searchPlaceholder', '부스명 또는 설명 검색')}
              className={styles.searchInput}
            />
            <FiSearch className={styles.searchIcon} />
          </div>
        </div>
        
        {regularBooths.length > 0 ? (
          <div className={styles.boothsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>{t('expoDetail.expoBooths.boothNumber', '부스 번호')}</div>
              <div className={styles.headerCell}>{t('expoDetail.expoBooths.boothName', '부스명')}</div>
              <div className={styles.headerCell}>{t('expoDetail.expoBooths.contactName', '담당자')}</div>
            </div>
            <div className={styles.tableBody}>
              {regularBooths.map((booth) => (
                <div 
                  key={booth.id} 
                  className={styles.tableRow}
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
          <p className={styles.emptyMessage}>{t('expoDetail.expoBooths.noSearchResults', '검색 결과가 없습니다.')}</p>
        )}
      </div>

      {/* 부스가 없는 경우 */}
      {(!booths || booths.length === 0) && (
        <p className={styles.emptyMessage}>{t('expoDetail.expoBooths.noBooths', '등록된 부스가 없습니다.')}</p>
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
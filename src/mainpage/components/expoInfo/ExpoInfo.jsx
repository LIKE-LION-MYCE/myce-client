import { useTranslation } from 'react-i18next';
import styles from './ExpoInfo.module.css';
import GoogleMap from '../../../common/components/googleMap/GoogleMap';
import '../../../i18n/i18n_expodetail.js'; // expodetail용 i18n 파일 import

const ExpoInfo = ({ basicInfo, location }) => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.infoTab}>
      {/* 상세 설명 섹션 */}
      <div className={styles.description}>
        <h3>{t('expoDetail.expoInfo.description.title', '상세 설명')}</h3>
        <p>{basicInfo?.description || t('expoDetail.expoInfo.description.noDescription', '상세 설명이 없습니다.')}</p>
      </div>
      
      {/* 주최자 정보 섹션 */}
      {basicInfo && (
        <div className={styles.businessProfile}>
          <h3>{t('expoDetail.expoInfo.organizer.title', '주최자 정보')}</h3>
          <div className={styles.businessCard}>
            <div className={styles.businessHeader}>
              <h4>{basicInfo.organizerName || t('expoDetail.expoInfo.organizer.noOrganizerInfo', '주최자 정보 없음')}</h4>
              {basicInfo.organizerInfo?.companyName && basicInfo.organizerInfo.companyName !== basicInfo.organizerName && (
                <p className={styles.companyName}>{basicInfo.organizerInfo.companyName}</p>
              )}
            </div>
            
            <div className={styles.businessDetails}>
              {basicInfo.organizerInfo?.ceoName && (
                <p className={styles.businessItem}>
                  👤 {t('expoDetail.expoInfo.organizer.ceo', '대표자')}: {basicInfo.organizerInfo.ceoName}
                </p>
              )}
              
              {basicInfo.organizerContact && (
                <p className={styles.businessItem}>
                  📞 {t('expoDetail.expoInfo.organizer.contact', '연락처')}: {basicInfo.organizerContact}
                </p>
              )}
              
              {basicInfo.organizerInfo?.contactEmail && (
                <p className={styles.businessItem}>
                  ✉️ {t('expoDetail.expoInfo.organizer.email', '이메일')}: {basicInfo.organizerInfo.contactEmail}
                </p>
              )}
              
              {basicInfo.organizerInfo?.address && (
                <p className={styles.businessItem}>
                  📍 {t('expoDetail.expoInfo.organizer.address', '주소')}: {basicInfo.organizerInfo.address}
                </p>
              )}
              
              {basicInfo.organizerInfo?.businessRegistrationNumber && (
                <p className={styles.businessItem}>
                  🏢 {t('expoDetail.expoInfo.organizer.businessNumber', '사업자등록번호')}: {basicInfo.organizerInfo.businessRegistrationNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 위치 정보 섹션 */}
      <div className={styles.locationSection}>
        <h3>{t('expoDetail.expoInfo.location.title', '위치 정보')}</h3>
        {location ? (
          <div className={styles.locationInfo}>
            <p><strong>{t('expoDetail.expoInfo.location.address', '주소')}:</strong> {location.location}</p>
            {location.locationDetail && (
              <p><strong>{t('expoDetail.expoInfo.location.detailAddress', '상세 주소')}:</strong> {location.locationDetail}</p>
            )}
            {location.latitude && location.longitude && (
              <div className={styles.coordinates}>
                <GoogleMap 
                  latitude={location.latitude}
                  longitude={location.longitude}
                  address={location.location}
                  markerIcon={{
                    url: '/images/marker/MYCE_MARKER.png',
                    size: { width: 60, height: 60 },
                    anchor: { x: 30, y: 60 }
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <p>{t('expoDetail.expoInfo.location.noLocationInfo', '위치 정보를 불러올 수 없습니다.')}</p>
        )}
      </div>
    </div>
  );
};

export default ExpoInfo;
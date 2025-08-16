import styles from './ExpoInfo.module.css';

const ExpoInfo = ({ basicInfo, location }) => {
  return (
    <div className={styles.infoTab}>
      {/* 상세 설명 섹션 */}
      <div className={styles.description}>
        <h3>상세 설명</h3>
        <p>{basicInfo?.description || '상세 설명이 없습니다.'}</p>
      </div>
      
      {/* 주최자 정보 섹션 */}
      {basicInfo && (
        <div className={styles.businessProfile}>
          <h3>주최자 정보</h3>
          <div className={styles.businessCard}>
            <div className={styles.businessHeader}>
              <h4>{basicInfo.organizerName || '주최자 정보 없음'}</h4>
              {basicInfo.organizerInfo?.companyName && basicInfo.organizerInfo.companyName !== basicInfo.organizerName && (
                <p className={styles.companyName}>{basicInfo.organizerInfo.companyName}</p>
              )}
            </div>
            
            <div className={styles.businessDetails}>
              {basicInfo.organizerInfo?.ceoName && (
                <p className={styles.businessItem}>
                  👤 대표자: {basicInfo.organizerInfo.ceoName}
                </p>
              )}
              
              {basicInfo.organizerContact && (
                <p className={styles.businessItem}>
                  📞 연락처: {basicInfo.organizerContact}
                </p>
              )}
              
              {basicInfo.organizerInfo?.contactEmail && (
                <p className={styles.businessItem}>
                  ✉️ 이메일: {basicInfo.organizerInfo.contactEmail}
                </p>
              )}
              
              {basicInfo.organizerInfo?.address && (
                <p className={styles.businessItem}>
                  📍 주소: {basicInfo.organizerInfo.address}
                </p>
              )}
              
              {basicInfo.organizerInfo?.businessRegistrationNumber && (
                <p className={styles.businessItem}>
                  🏢 사업자등록번호: {basicInfo.organizerInfo.businessRegistrationNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 위치 정보 섹션 */}
      <div className={styles.locationSection}>
        <h3>위치 정보</h3>
        {location ? (
          <div className={styles.locationInfo}>
            <p><strong>주소:</strong> {location.location}</p>
            {location.locationDetail && (
              <p><strong>상세 주소:</strong> {location.locationDetail}</p>
            )}
            {location.latitude && location.longitude && (
              <div className={styles.coordinates}>
                <p>위도: {location.latitude}, 경도: {location.longitude}</p>
                {/* TODO: 지도 컴포넌트 추가 */}
              </div>
            )}
          </div>
        ) : (
          <p>위치 정보를 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ExpoInfo;
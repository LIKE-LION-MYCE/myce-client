// src/mainpage/layout/footer/MainPageFooter.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MainPageFooter.module.css';
import TermsModal from '../../../components/shared/modals/TermsModal';
import PrivacyModal from '../../../components/shared/modals/PrivacyModal';

function MainPageFooter() {
  const { t } = useTranslation();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  
  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);
  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const closePrivacyModal = () => setIsPrivacyModalOpen(false);
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.column}>
            <h3 className={styles.companyTitle}>(주)MYCE</h3>
            <div className={styles.companyInfo}>
              <p>주소: 서울특별시 강남구 테크노로 123 (삼성동, 마이스타워)</p>
              <p>사업자등록번호: 123-45-67890｜대표이사: 김찍찍</p>
              <p>통신판매업신고: 2025-서울강남-0123</p>
              <p>관광사업증 등록번호: 제2025-000045호</p>
              <p>호스팅서비스제공자: (주)MYCE</p>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>고객센터</h4>
            <div className={styles.contactInfo}>
              <p>팩스: 02-6000-2025</p>
              <p>이메일: support@myce.live</p>
              <p>좌측 하단의 상담 서비스 버튼을 통해 전문 상담원 또는 AI 챗봇 상담을 이용하실 수 있습니다.</p>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>개인정보 보호책임자</h4>
            <div className={styles.contactInfo}>
              <p>담당부서: 개발팀</p>
              <p>연락처: privacy@myce.co.kr</p>
              <p>처리시간: 평일 09:00~18:00 (주말, 공휴일 제외)</p>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomSection}>
          <p className={styles.disclaimer}>
            (주)MYCE는 일부 상품의 통신판매중개자로서 통신판매의 당사자가 아니므로, 상품의 예약, 이용 및 환불 등 거래와 관련된 의무와 책임은 판매자에게 있으며 (주)MYCE는 일체 책임을 지지 않습니다.
          </p>
          <div className={styles.bottomLine}>
            <div className={styles.legalLinks}>
              <button onClick={openTermsModal} className={styles.legalLink}>이용약관</button>
              <span className={styles.separator}>|</span>
              <button onClick={openPrivacyModal} className={styles.legalLink}>개인정보 처리방침</button>
            </div>
            <p className={styles.copyright}>ⓒ MYCE Co., Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <TermsModal isOpen={isTermsModalOpen} onClose={closeTermsModal} />
      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={closePrivacyModal} />
    </footer>
  );
}

export default MainPageFooter;
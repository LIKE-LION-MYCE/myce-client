import React, { useEffect, useState } from 'react';
import styles from './PrivacyModal.module.css';

/**
 * Privacy Policy Modal Component
 * 
 * Shows the privacy policy when users click the link.
 */
export default function PrivacyModal({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  // Handle smooth open/close animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : styles.closing}`} onClick={onClose}>
      <div className={`${styles.modalContent} ${isOpen ? styles.open : styles.closing}`} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          className={styles.closeButton}
          onClick={onClose}
          title="닫기"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.header}>
            <h2>개인정보처리방침</h2>
            <p>MYCE 개인정보처리방침</p>
          </div>

          <div className={styles.privacyContent}>
            <section>
              <h3>1. 개인정보의 처리목적</h3>
              <p>MYCE(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
              <ul>
                <li><strong>회원가입 및 관리:</strong> 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 만14세 미만 아동 개인정보 수집 시 법정 대리인 동의·확인, 각종 고지·통지, 고충처리</li>
                <li><strong>재화 또는 서비스 제공:</strong> 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제·정산, 채권추심</li>
                <li><strong>고충처리:</strong> 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</li>
              </ul>
            </section>

            <section>
              <h3>2. 개인정보의 처리 및 보유기간</h3>
              <p>회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유․이용기간 또는 법령에 따른 개인정보 보유․이용기간 내에서 개인정보를 처리․보유합니다.</p>
              <ul>
                <li><strong>회원가입 정보:</strong> 회원탈퇴 시까지 (단, 관계법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지)</li>
                <li><strong>서비스 이용기록:</strong> 3년 (통신비밀보호법)</li>
                <li><strong>결제정보:</strong> 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
              </ul>
            </section>

            <section>
              <h3>3. 개인정보의 제3자 제공</h3>
              <p>회사는 정보주체의 개인정보를 개인정보의 처리목적에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
              
              <h4>3.1 개인정보를 제공받는자</h4>
              <ul>
                <li><strong>결제대행업체:</strong> 결제처리를 위한 최소한의 정보 제공</li>
                <li><strong>배송업체:</strong> 상품배송을 위한 최소한의 정보 제공</li>
                <li><strong>고객센터 운영업체:</strong> 고객상담 및 불만처리를 위한 최소한의 정보 제공</li>
              </ul>
            </section>

            <section>
              <h3>4. 개인정보처리의 위탁</h3>
              <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
              <ul>
                <li><strong>AWS (Amazon Web Services):</strong> 서버 및 데이터베이스 운영, 데이터 저장 및 관리</li>
                <li><strong>이메일 발송 서비스:</strong> 각종 안내메일 및 마케팅 메일 발송</li>
                <li><strong>SMS 발송 서비스:</strong> 각종 안내 문자메시지 발송</li>
              </ul>
            </section>

            <section>
              <h3>5. 정보주체의 권리·의무 및 그 행사방법</h3>
              <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
              <ol>
                <li>개인정보 처리현황 통지요구</li>
                <li>개인정보 열람요구</li>
                <li>개인정보 정정·삭제요구</li>
                <li>개인정보 처리정지요구</li>
              </ol>
              <p>위의 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
            </section>

            <section>
              <h3>6. 처리하는 개인정보의 항목</h3>
              <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
              
              <h4>6.1 필수항목</h4>
              <ul>
                <li>이름, 이메일 주소, 전화번호</li>
                <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                <li>결제기록 (결제수단, 결제금액, 결제일시)</li>
              </ul>

              <h4>6.2 선택항목</h4>
              <ul>
                <li>마케팅 수신동의 정보</li>
                <li>관심분야 및 선호도 정보</li>
              </ul>
            </section>

            <section>
              <h3>7. 개인정보의 파기</h3>
              <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
              
              <h4>7.1 파기절차</h4>
              <p>이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</p>
              
              <h4>7.2 파기방법</h4>
              <ul>
                <li><strong>전자적 파일형태:</strong> 기록을 재생할 수 없도록 로우레벨포멧(Low Level Format) 등의 방법을 이용하여 파기</li>
                <li><strong>종이문서:</strong> 분쇄하거나 소각하여 파기</li>
              </ul>
            </section>

            <section>
              <h3>8. 개인정보 보호책임자</h3>
              <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
              
              <div className={styles.contactInfo}>
                <h4>개인정보 보호책임자</h4>
                <ul>
                  <li><strong>담당부서:</strong> 개발팀</li>
                  <li><strong>연락처:</strong> privacy@myce.co.kr</li>
                  <li><strong>처리시간:</strong> 평일 09:00~18:00 (주말, 공휴일 제외)</li>
                </ul>
              </div>
            </section>

            <section>
              <h3>9. 개인정보 처리방침 변경</h3>
              <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
            </section>

            <div className={styles.effective}>
              <p><strong>부칙</strong></p>
              <p>본 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.</p>
              <p>이전 버전의 개인정보처리방침은 별도로 보관하며, 요청 시 제공해드립니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
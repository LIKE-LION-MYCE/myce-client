import React, { useEffect, useState } from 'react';
import styles from './TermsModal.module.css';

/**
 * Terms of Service Modal Component
 * 
 * Shows the terms of service when users click the link.
 */
export default function TermsModal({ isOpen, onClose }) {
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
            <h2>이용약관</h2>
            <p>MYCE 서비스 이용약관</p>
          </div>

          <div className={styles.termsContent}>
            <section>
              <h3>제1조 (목적)</h3>
              <p>본 약관은 MYCE(이하 "회사")가 제공하는 온라인 박람회 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
            </section>

            <section>
              <h3>제2조 (정의)</h3>
              <ol>
                <li>"서비스"란 회사가 제공하는 온라인 박람회 플랫폼을 의미합니다.</li>
                <li>"이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                <li>"회원"이란 서비스에 개인정보를 제공하여 회원등록을 한 자로서, 서비스의 정보를 지속적으로 제공받으며 서비스를 이용할 수 있는 자를 말합니다.</li>
                <li>"비회원"이란 회원에 가입하지 않고 서비스를 이용하는 자를 말합니다.</li>
              </ol>
            </section>

            <section>
              <h3>제3조 (서비스의 내용)</h3>
              <p>회사가 제공하는 서비스는 다음과 같습니다:</p>
              <ol>
                <li>온라인 박람회 정보 제공 및 예약 서비스</li>
                <li>박람회 관련 상담 및 고객지원 서비스</li>
                <li>AI 챗봇을 통한 자동 상담 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ol>
            </section>

            <section>
              <h3>제4조 (회원가입)</h3>
              <ol>
                <li>회원가입은 이용자가 본 약관의 내용에 대하여 동의를 하고 회원가입신청을 한 후 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</li>
                <li>회원가입신청서에는 다음 사항을 기재해야 합니다:
                  <ul>
                    <li>이용자의 아이디와 비밀번호</li>
                    <li>성명</li>
                    <li>전자우편주소</li>
                    <li>기타 회사가 필요하다고 인정하는 사항</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h3>제5조 (이용자의 의무)</h3>
              <ol>
                <li>이용자는 다음 행위를 하여서는 안 됩니다:
                  <ul>
                    <li>신청 또는 변경시 허위내용의 등록</li>
                    <li>타인의 정보도용</li>
                    <li>회사가 게시한 정보의 변경</li>
                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
                    <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                    <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h3>제6조 (개인정보보호)</h3>
              <p>회사는 관련법령이 정하는 바에 따라서 이용자의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법령 및 회사의 개인정보처리방침이 적용됩니다.</p>
            </section>

            <section>
              <h3>제7조 (서비스 이용의 제한)</h3>
              <p>회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.</p>
            </section>

            <section>
              <h3>제8조 (면책조항)</h3>
              <ol>
                <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
                <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여는 책임을 지지 않습니다.</li>
              </ol>
            </section>

            <section>
              <h3>제9조 (준거법 및 관할법원)</h3>
              <p>본 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국의 법을 적용하며, 서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 관할법원은 민사소송법상의 관할법원으로 합니다.</p>
            </section>

            <div className={styles.effective}>
              <p><strong>부칙</strong></p>
              <p>본 약관은 2024년 1월 1일부터 적용됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
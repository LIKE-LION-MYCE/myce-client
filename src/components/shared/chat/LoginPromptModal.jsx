import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPromptModal.module.css';
import TermsModal from '../modals/TermsModal';
import PrivacyModal from '../modals/PrivacyModal';

/**
 * Login Prompt Modal Component
 * 
 * Shows when non-authenticated users try to access chat.
 * Encourages login/signup with chat benefits and easy navigation.
 */
export default function LoginPromptModal({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    setShowPrivacyModal(true);
  };

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
          {/* Icon & Title */}
          <div className={styles.header}>
            <div className={styles.iconContainer}>
              <div className={styles.chatIcon}>💬</div>
              <img 
                src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f916/u1f916_u1f42d.png" 
                alt="AI 찍찍봇"
                className={styles.aiIcon}
              />
            </div>
            <h2>로그인이 필요합니다</h2>
            <p>MYCE 상담 서비스를 이용하려면 로그인해주세요</p>
          </div>

          {/* Benefits */}
          <div className={styles.benefits}>
            <h3>🎯 상담 서비스 혜택</h3>
            <ul className={styles.benefitsList}>
              <li>
                <img 
                  src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f916/u1f916_u1f42d.png" 
                  alt="AI 찍찍봇"
                  className={styles.benefitIcon}
                />
                <div>
                  <strong>AI 찍찍봇 상담</strong>
                  <p>24시간 즉시 답변받는 똑똑한 AI 상담</p>
                </div>
              </li>
              <li>
                <span className={styles.benefitIcon}>👨‍💼</span>
                <div>
                  <strong>전문 상담원 연결</strong>
                  <p>복잡한 문의는 실시간 전문 상담원과 대화</p>
                </div>
              </li>
              <li>
                <span className={styles.benefitIcon}>📱</span>
                <div>
                  <strong>실시간 알림</strong>
                  <p>답변 도착 시 즉시 알림으로 빠른 소통</p>
                </div>
              </li>
              <li>
                <span className={styles.benefitIcon}>📊</span>
                <div>
                  <strong>맞춤 박람회 추천</strong>
                  <p>관심사 기반 개인화된 박람회 정보 제공</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button 
              className={styles.loginButton}
              onClick={handleLogin}
            >
              <span>로그인</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </button>
            
            <button 
              className={styles.signupButton}
              onClick={handleSignup}
            >
              <span>회원가입</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <p className={styles.privacy}>회원가입 시 <a href="#" onClick={handleTermsClick}>이용약관</a> 및 <a href="#" onClick={handlePrivacyClick}>개인정보처리방침</a>에 동의하게 됩니다.</p>
          </div>
        </div>
      </div>

      {/* Terms and Privacy Modals */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
}
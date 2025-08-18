import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./nonMemberPurchaseModal.module.css"; // fix case
import { FiX } from "react-icons/fi";
import {
  sendVerificatiionEmail,
  verifyVerificationEmail,
  VERIFICATION_TYPE,
} from "../../../api/service/auth/AuthService";
import { savePreReservation } from "../../../api/service/reservation/reservationApi";

export default function NonMemberPurchaseModal({
  ticket,
  expoId,
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const quantity = 1; // Non-members can only purchase 1 ticket

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen || !ticket) return null;

  const handleSendCode = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    
    setIsSendingEmail(true);
    try {
      await sendVerificatiionEmail(VERIFICATION_TYPE.NONMEMBER_VERIFY, email);
      alert("인증 코드가 발송되었습니다.");
      setIsCodeSent(true);
      setTimer(180); // 3 minutes timer
    } catch (error) {
      console.error("인증 코드 발송 실패:", error);
      alert("인증 코드 발송에 실패했습니다.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert("인증 코드를 입력해주세요.");
      return;
    }
    
    setIsVerifyingCode(true);
    try {
      await verifyVerificationEmail(
        VERIFICATION_TYPE.NONMEMBER_VERIFY,
        email,
        verificationCode
      );
      alert("이메일이 성공적으로 인증되었습니다.");
      setIsVerified(true);
      setTimer(0);
    } catch (error) {
      console.error("이메일 인증 실패:", error);
      alert("인증 코드가 올바르지 않습니다.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handlePurchase = async () => {
    // Added async
    if (!isVerified) {
      // 이 확인 로직이 있어야 함
      alert("이메일 인증을 먼저 완료해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const preReservationData = {
        ticketId: ticket.ticketId,
        expoId: expoId,
        userType: "GUEST",
        userId: 0, // As per user's clarification
        quantity: quantity,
      };

      console.log("비회원 구매: 결제 페이지로 이동합니다.", {
        expoId,
        preReservationData: {
          ticketId: ticket.ticketId,
          userType: "GUEST",
          userId: 0,
          quantity: quantity,
        },
      });

      // preReservation Id 반환하는 POST
      const response = await savePreReservation(preReservationData);

      navigate(
        `/detail/${expoId}/payment?preReservationId=${response.reservationId}`
      );
      onClose();
    } catch (error) {
      console.error("사전 예약 생성 실패:", error);
      alert("티켓 구매 준비에 실패했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>비회원 구매</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.notice}>
            <p>비회원은 한 번에 1매만 구매 가능합니다.</p>
          </div>
          <div className={styles.ticketInfo}>
            <h4>{ticket.name}</h4>
            <p className={styles.price}>{ticket.price?.toLocaleString()}원</p>
          </div>

          <div className={styles.emailSection}>
            <label htmlFor="email-input">이메일</label>
            <div className={styles.inputWithButton}>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsVerified(false);
                  setIsCodeSent(false);
                }}
                placeholder="예약 확인용 이메일"
                className={styles.emailInput}
                disabled={isCodeSent}
              />
              <button
                onClick={handleSendCode}
                disabled={isCodeSent || timer > 0 || isSendingEmail}
                className={`${styles.sendCodeBtn} ${isSendingEmail ? styles.loading : ''}`}
              >
                {isSendingEmail ? (
                  <span className={styles.loadingContent}>
                    <span className={styles.spinner}></span>
                    발송 중...
                  </span>
                ) : isCodeSent ? (
                  `재전송 (${timer}s)`
                ) : (
                  "인증번호 발송"
                )}
              </button>
            </div>
          </div>

          {isCodeSent && (
            <div className={styles.verificationSection}>
              <label htmlFor="code-input">인증 코드</label>
              <div className={styles.inputWithButton}>
                <input
                  id="code-input"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증 코드를 입력하세요"
                  className={styles.codeInput}
                  disabled={isVerified}
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={isVerified || isVerifyingCode}
                  className={`${styles.verifyBtn} ${isVerifyingCode ? styles.loading : ''}`}
                >
                  {isVerifyingCode ? (
                    <span className={styles.loadingContent}>
                      <span className={styles.spinner}></span>
                      확인 중...
                    </span>
                  ) : isVerified ? (
                    "인증 완료"
                  ) : (
                    "확인"
                  )}
                </button>
              </div>
            </div>
          )}

          <div className={styles.summary}>
            <span>총 결제 금액</span>
            <span className={styles.totalPrice}>
              {(ticket.price * quantity).toLocaleString()}원
            </span>
          </div>

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              취소
            </button>
            <button
              className={styles.purchaseBtn}
              onClick={handlePurchase}
              disabled={!isVerified || isLoading}
            >
              {isLoading ? "처리 중..." : "구매하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import styles from "./NonMemberReservationCheckPage.module.css";
import { useNavigate } from "react-router-dom";
import { sendVerificatiionEmail, verifyVerificationEmail, VERIFICATION_TYPE } from "../../../api/service/auth/AuthService";
import { getNonMemberReservation } from "../../../api/service/reservation/reservationApi";

function NonMemberReservationCheckPage() {
  const [reservationNum, setReservationNum] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // 인증번호 발송
  const handleSendCode = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      await sendVerificatiionEmail(VERIFICATION_TYPE.NONMEMBER_VERIFY, email);
      setIsCodeSent(true);
      setTimer(180); // 3분 타이머 시작
      alert("인증번호가 발송되었습니다.");
      
      // 타이머 시작
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCodeSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("인증번호 발송 실패:", error);
      alert("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 인증번호 검증
  const handleVerifyCode = async () => {
    if (!email || !code) {
      alert("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }

    try {
      await verifyVerificationEmail(VERIFICATION_TYPE.NONMEMBER_VERIFY, email, code);
      setIsEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } catch (error) {
      console.error("인증번호 검증 실패:", error);
      alert("인증번호가 올바르지 않습니다. 다시 확인해주세요.");
    }
  };

  // 예매 확인 처리 (이메일 인증 + 예매번호)
  const handleCheck = async () => {
    if (!isEmailVerified) {
      alert("이메일 인증을 먼저 완료해주세요.");
      return;
    }
    if (!reservationNum) {
      alert("예매번호를 입력해주세요.");
      return;
    }

    try {
      const reservationData = await getNonMemberReservation(email, reservationNum);
      // 비회원 예매 상세 페이지로 이동하면서 데이터 전달
      navigate(`/non-member/reservation/${reservationData.reservationInfo.reservationId}`, {
        state: { reservationData }
      });
    } catch (error) {
      console.error("예매 조회 실패:", error);
      if (error.response?.status === 404) {
        alert("입력하신 이메일과 예매번호에 해당하는 예매 정보를 찾을 수 없습니다.");
      } else {
        alert("예매 조회 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 타이머 포맷팅 (MM:SS)
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.centerBox}>
      <div className={styles.formSection}>
        <div className={styles.emailGuide}>
          예매 시 사용한 이메일 주소로 인증을 진행한 후 예매번호를 입력해주세요.
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>이메일 주소</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className={styles.input}
              style={{ marginBottom: 0 }}
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailVerified}
            />
            <button
              type="button"
              className={styles.sendCodeBtn}
              onClick={handleSendCode}
              disabled={isEmailVerified || isCodeSent}
            >
              {isEmailVerified ? "인증완료" : isCodeSent ? "발송완료" : "인증번호 발송"}
            </button>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>인증번호</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className={styles.input}
              style={{ marginBottom: 0 }}
              placeholder="인증번호 6자리를 입력하세요"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isEmailVerified}
              maxLength={6}
            />
            {!isEmailVerified && isCodeSent && (
              <button
                type="button"
                className={styles.verifyBtn}
                onClick={handleVerifyCode}
                disabled={code.length !== 6}
              >
                인증확인
              </button>
            )}
          </div>
          <div className={styles.codeExpire}>
            {isEmailVerified ? (
              <span style={{ color: "#22c55e" }}>✓ 인증 완료</span>
            ) : timer > 0 ? (
              `유효시간: ${formatTimer(timer)}`
            ) : isCodeSent ? (
              <span style={{ color: "#ef4444" }}>인증시간이 만료되었습니다</span>
            ) : (
              "유효시간: 3분"
            )}
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>예매 번호</label>
          <input
            className={styles.input}
            placeholder="예매 번호를 입력하세요"
            value={reservationNum}
            onChange={(e) => setReservationNum(e.target.value)}
          />
        </div>
        <div className={styles.btnRow}>
          <button className={styles.cancelBtn}>취소</button>
          <button className={styles.confirmBtn} onClick={handleCheck}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default NonMemberReservationCheckPage;

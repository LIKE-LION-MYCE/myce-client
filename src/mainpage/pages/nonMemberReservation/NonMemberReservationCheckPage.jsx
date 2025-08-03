import React, { useState } from "react";
import styles from "./NonMemberReservationCheckPage.module.css";
import { useNavigate } from "react-router-dom";

function NonMemberReservationCheckPage() {
  const [activeTab, setActiveTab] = useState("number");
  const [reservationNum, setReservationNum] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  // const [timer, setTimer] = useState(180); // 실제 타이머 구현시
  const navigate = useNavigate();

  // 임시 인증(확인) 처리
  const handleCheck = () => {
    if (reservationNum) {
      navigate(`/non-member/reservation/${reservationNum}`);
    }
  };

  // 이메일 인증 완료 예시 (실제 로직 필요)
  const handleEmailVerify = () => {
    if (email && code.length === 6) {
      // 임의로 예시 reservation id로 이동
      navigate(`/non-member/reservation/EMAIL123456`);
    }
  };

  return (
    <div className={styles.centerBox}>
      <div className={styles.tabRow}>
        <button
          className={activeTab === "number" ? styles.active : ""}
          onClick={() => setActiveTab("number")}
        >
          예매 번호 확인
        </button>
        <button
          className={activeTab === "email" ? styles.active : ""}
          onClick={() => setActiveTab("email")}
        >
          이메일 인증
        </button>
      </div>
      {activeTab === "number" ? (
        <div className={styles.formSection}>
          <label className={styles.label}>예매 번호를 입력해주세요.</label>
          <input
            className={styles.input}
            placeholder="예매 번호를 입력하세요"
            value={reservationNum}
            onChange={(e) => setReservationNum(e.target.value)}
          />
          <div className={styles.btnRow}>
            <button className={styles.cancelBtn}>취소</button>
            <button className={styles.confirmBtn} onClick={handleCheck}>
              확인
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.formSection}>
          <div className={styles.emailGuide}>
            예매 시 사용한 이메일 주소로 인증을 진행해주세요.
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
              />
              <button
                type="button"
                className={styles.sendCodeBtn}
                // 기존 confirmBtn → sendCodeBtn
              >
                인증번호 발송
              </button>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>인증번호</label>
            <input
              className={styles.input}
              placeholder="인증번호 6자리를 입력하세요"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <div className={styles.codeExpire}>유효시간: 3분</div>
          </div>
          <div className={styles.btnRow}>
            <button className={styles.cancelBtn}>취소</button>
            <button className={styles.confirmBtn} onClick={handleEmailVerify}>
              인증 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NonMemberReservationCheckPage;

// EmailVerifyModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./EmailVerifyModal.module.css";

export default function EmailVerifyModal({
  open,
  onClose,
  onSendCode,
  onVerify,
  defaultEmail = "",
  expireSeconds = 180,
  onVerifySuccess,
}) {
  console.log("EmailVerifyModal received props:", {
    open,
    onClose,
    onSendCode,
    onVerify,
    defaultEmail,
    expireSeconds,
    onVerifySuccess,
  });
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [left, setLeft] = useState(0);
  const [error, setError] = useState("");
  const emailInputRef = useRef(null);
  const codeInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setEmail(defaultEmail);
      setCode("");
      setError("");
      setTimeout(() => emailInputRef.current?.focus(), 0);
    }
  }, [open, defaultEmail]);

  useEffect(() => {
    if (left <= 0) return;
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [left]);

  const mmss = useMemo(() => {
    const m = Math.floor(left / 60).toString();
    const s = (left % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [left]);

  const canSend = email.trim().length > 0 && !isSending;
  const canVerify =
    email.trim() && code.trim().length === 6 && !isVerifying && left > 0;

  const handleSend = async () => {
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 형식을 입력해 주세요.");
      emailInputRef.current?.focus();
      return;
    }
    try {
      setIsSending(true);
      await onSendCode?.(email);
      setLeft(expireSeconds);
      codeInputRef.current?.focus();
    } catch (e) {
      setError(e?.message || "인증번호 발송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    try {
      setIsVerifying(true);
      await onVerify?.({ email, code });
      onVerifySuccess?.();
    } catch (e) {
      setError(e?.message || "인증 검증에 실패했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className={styles["modal-backdrop"]}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className={styles["modal-container"]}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles["modal-header"]}>
          <h2>이메일 인증</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles["modal-body"]}>
          <p>예매 후 예매내역 확인을 위한 인증입니다.</p>

          <label className={styles.label}>이메일 주소</label>
          <div className={styles["input-group"]}>
            <input
              ref={emailInputRef}
              type="email"
              className={styles.input}
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className={`${styles.button} ${styles.primary}`}
              onClick={handleSend}
              disabled={!canSend}
            >
              {isSending ? "발송 중…" : "인증번호 발송"}
            </button>
          </div>

          <label className={styles.label}>인증번호</label>
          <div
            className={styles["input-group"]}
            style={{ position: "relative" }}
          >
            <input
              ref={codeInputRef}
              type="text"
              maxLength={6}
              className={styles.input}
              placeholder="인증번호 6자리를 입력하세요"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
            />
            <span className={styles["timer-badge"]}>
              {left > 0 ? `유효시간: ${mmss}` : "유효시간 만료"}
            </span>
          </div>

          {error && <p className={styles["error-message"]}>{error}</p>}
        </div>

        <div className={styles["modal-footer"]}>
          <button
            className={`${styles.button} ${styles.secondary}`}
            onClick={onClose}
          >
            취소
          </button>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={handleVerify}
            disabled={!canVerify}
          >
            {isVerifying ? "확인 중…" : "인증 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}

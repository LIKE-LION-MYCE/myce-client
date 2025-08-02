import React, { useState } from "react";
import styles from "./ChangePasswordModal.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ChangePasswordModal = ({ onClose }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>비밀번호 변경</h2>

        <div className={styles.formGroup}>
          <label>현재 비밀번호</label>
          <div className={styles.inputWrapper}>
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="현재 비밀번호를 입력하세요"
            />
            <button
              className={styles.eyeButton}
              onClick={() => setShowCurrent(!showCurrent)}
              type="button"
            >
              {showCurrent ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>새 비밀번호</label>
          <div className={styles.inputWrapper}>
            <input
              type={showNew ? "text" : "password"}
              placeholder="새 비밀번호를 입력하세요"
            />
            <button
              className={styles.eyeButton}
              onClick={() => setShowNew(!showNew)}
              type="button"
            >
              {showNew ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
          <p className={styles.helper}>비밀번호는 8자 이상이어야 합니다.</p>
        </div>

        <div className={styles.formGroup}>
          <label>새 비밀번호 확인</label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="새 비밀번호를 다시 입력하세요"
            />
            <button
              className={styles.eyeButton}
              onClick={() => setShowConfirm(!showConfirm)}
              type="button"
            >
              {showConfirm ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.confirm}>비밀번호 변경</button>
          <button className={styles.cancel} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

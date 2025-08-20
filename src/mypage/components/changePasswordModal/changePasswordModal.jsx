import React, { useState } from "react";
import styles from "./changePasswordModal.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { changePassword } from "../../../api/service/auth/AuthService";

const ChangePasswordModal = ({ onClose }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState({
    'currentPassword': '',
    'newPassword': '',
    'confirmPassword': ''
  });

  const handleInputChange = (field, value) => {
    setPassword(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = () => {
    changePassword({...password})
    .then(res => {
      alert('비밀번호가 변경되었습니다.');
      onClose();
    })
    .catch(err => {
      alert('비밀번호 변경에 실패했습니다.');
    })
  }

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
              value={password.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
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
              value={password.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
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
              value={password.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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

        <div className={styles.buttonGroup} onClick={handleChangePassword}>
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

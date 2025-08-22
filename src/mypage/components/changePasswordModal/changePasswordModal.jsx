import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import styles from "./changePasswordModal.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { changePassword } from "../../../api/service/auth/AuthService";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import ToastFail from "../../../common/components/toastFail/ToastFail";

const ChangePasswordModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [password, setPassword] = useState({
    'currentPassword': '',
    'newPassword': '',
    'confirmPassword': ''
  });

  const showSuccessMessage = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showFailMessage = (message) => {
    setToastMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  const handleInputChange = (field, value) => {
    setPassword(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = () => {
    changePassword({...password})
    .then(res => {
      showSuccessMessage(t('changePasswordModal.messages.success'));
      onClose();
    })
    .catch(err => {
      showFailMessage(t('changePasswordModal.messages.failure'));
    })
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>{t('changePasswordModal.title')}</h2>

        <div className={styles.formGroup}>
          <label>{t('changePasswordModal.labels.currentPassword')}</label>
          <div className={styles.inputWrapper}>
            <input
              type={showCurrent ? "text" : "password"}
              placeholder={t('changePasswordModal.placeholders.currentPassword')}
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
          <label>{t('changePasswordModal.labels.newPassword')}</label>
          <div className={styles.inputWrapper}>
            <input
              type={showNew ? "text" : "password"}
              placeholder={t('changePasswordModal.placeholders.newPassword')}
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
          <p className={styles.helper}>{t('changePasswordModal.helper')}</p>
        </div>

        <div className={styles.formGroup}>
          <label>{t('changePasswordModal.labels.confirmPassword')}</label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder={t('changePasswordModal.placeholders.confirmPassword')}
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
          <button className={styles.confirm}>{t('changePasswordModal.buttons.confirm')}</button>
          <button className={styles.cancel} onClick={onClose}>
            {t('changePasswordModal.buttons.cancel')}
          </button>
        </div>
        
        {showSuccessToast && <ToastSuccess message={toastMessage} />}
        {showFailToast && <ToastFail message={toastMessage} />}
      </div>
    </div>
  );
};

export default ChangePasswordModal;

// src/pages/findPassword/FindPassword.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./FindPasswordPage.module.css";
import AuthLayout from "../../layout/AuthLayout";
import { findPassword, sendVerificatiionEmail, VERIFICATION_TYPE, verifyVerificationEmail } from "../../../api/service/auth/AuthService";
import ToastFail from "../../../common/components/toastFail/ToastFail";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";

const FindPassword = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    loginId: "",
    email: "",
    emailCode: "",
  });
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [checkVerificationEmail, setCheckVerificationEmail] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSendAuthCode = () => {
    // TODO: 인증 코드 이메일 발송 API 호출
    console.log("이메일 인증 발송:", form.email);

    if(!validEmailFormat()) return;

    sendVerificatiionEmail(VERIFICATION_TYPE.FIND_PASSWORD, form.email)
    .then(() => triggerToastSuccess(t('findPassword.messages.emailSent')))
    .catch((err) => triggerToastFail(t('findPassword.messages.emailSendFailed'), err));
  };

  const handleVerifyCode = () => {
    // TODO: 인증번호 확인 API 호출
    console.log("입력된 인증번호:", form.emailCode);
    verifyVerificationEmail(VERIFICATION_TYPE.FIND_PASSWORD, form.email, form.emailCode)
    .then((res) => {
      console.log('API 응답 객체 (res):', res);
      if(res.status === HttpStatusCode.Ok) {
        triggerToastSuccess(t('findPassword.messages.verificationSuccess'));
        setCheckVerificationEmail(true);
      } else {
        triggerToastFail(res.data.message);
      }
    })
    .catch((err) => {
      console.log('API 응답 객체 (err):', err);
      if(err.response && err.response.data && err.response.data.message) {
        triggerToastFail(err.response.data.message);
      } else {
        triggerToastFail(t('findPassword.messages.verificationFailed'));
        console.log(`Fail to verify email verification. ${err}`);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 임시 비밀번호 발급 처리
    console.log("임시 비밀번호 발송");

    if(!form.name) {
      triggerToastFail(t('findPassword.validation.nameRequired'));
      return;
    }

    if(!form.loginId) {
      triggerToastFail(t('findPassword.validation.userIdRequired'));
      return;
    }

    if(!validEmailFormat()) return;

    if(!checkVerificationEmail) {
      triggerToastFail(t('findPassword.validation.emailVerificationRequired'));
      return;
    }

    findPassword(form.name, form.loginId, form.email)
    .then(res => {
      triggerToastSuccess(t('findPassword.messages.tempPasswordSent'));
      setTimeout(() => navigate('/login'), 1000);
    })
    .catch(err => {
      const res = err.response;
      if(res.data?.message) {
        triggerToastFail(res.data.message);
      } else {
        triggerToastFail(t('findPassword.messages.memberNotFound'))
      }
    })
  };

  const validEmailFormat = () => {
    var regEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
    if(!form.email || regEmail.test(form.email)) {
      triggerToastFail(t('findPassword.validation.emailFormat'));
      return false;
    }

    return true;
  }

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    console.log('setFailMessage');
    setTimeout(() => setShowFailToast(false), 3000);
  }

  const triggerToastSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    console.log('setSuccessMessage');
    setTimeout(() => setShowSuccessToast(false), 3000);
  }

  return (
    <AuthLayout>
      <h2>{t('findPassword.title')}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          {t('findPassword.form.name')}
          <input
            name="name"
            placeholder={t('findPassword.form.namePlaceholder')}
            value={form.name}
            onChange={handleChange}
          />
        </label>
        <label>
          {t('findPassword.form.userId')}
          <input
            name="loginId"
            placeholder={t('findPassword.form.userIdPlaceholder')}
            value={form.loginId}
            onChange={handleChange}
          />
        </label>
        <label>
          {t('findPassword.form.email')}
          <div className={styles.rowInput}>
            <input
              name="email"
              placeholder={t('findPassword.form.emailPlaceholder')}
              value={form.email}
              onChange={handleChange}
            />
            <button
              type="button"
              className={checkVerificationEmail ? styles.grayButton : styles.activeButton}
              onClick={handleSendAuthCode}
              disabled={checkVerificationEmail}
            >
              {t('findPassword.form.sendVerification')}
            </button>
          </div>
        </label>
        <label>
          <div className={styles.rowInput}>
            <input
              name="emailCode"
              placeholder={t('findPassword.form.verificationCodePlaceholder')}
              value={form.emailCode}
              onChange={handleChange}
            />
            <button
              type="button"
              className={checkVerificationEmail ? styles.grayButton : styles.activeButton}
              onClick={handleVerifyCode}
              disabled={checkVerificationEmail}
            >
              {t('findPassword.form.verify')}
            </button>
          </div>
        </label>
        <button type="submit" className={styles.submitButton}>
          {t('findPassword.form.submitButton')}
        </button>
      </form>
      <p className={styles.loginLink}>
        <a href="/login">{t('findPassword.footer.backToLogin')}</a>
      </p>
      {showFailToast && <ToastFail message={failMessage}/>}
      {showSuccessToast && <ToastSuccess message={successMessage}/>}
    </AuthLayout>
  );
};

export default FindPassword;

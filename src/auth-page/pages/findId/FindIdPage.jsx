import { useState } from "react";
import { useTranslation } from "react-i18next";
import AuthLayout from "../../layout/AuthLayout";
import styles from "./FindIdPage.module.css";
import { findId, sendVerificatiionEmail, verifyVerificationEmail, VERIFICATION_TYPE } from "../../../api/service/auth/AuthService";
import ToastFail from "../../../common/components/toastFail/ToastFail";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import { HttpStatusCode } from "axios";
import IdFoundModal from "../../components/bannerCancelDetailModal/IdFoundModal";

function FindIdPage() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundId, setFoundId] = useState('');
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [checkVerificationEmail, setCheckVerificationEmail] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!name) {
      triggerToastFail(t('findId.validation.nameRequired'));
      return;
    }

    if(!validEmailFormat()) return;

    if(!checkVerificationEmail) {
      triggerToastFail(t('findId.validation.emailVerificationRequired'));
      return;
    }

    findId(name, email) 
    .then((res) => {
        setFoundId(res.data.loginId); // 또는 data.data.loginId
        setIsModalOpen(true);
    })
    .catch((err) => {
      const res = err.response;
      if(res.data?.message) triggerToastFail(res.data?.message);
      else triggerToastFail(t('findId.messages.idNotFound'));
  });

    console.log("아이디 찾기 요청", { name, email, authCode });
  };

const sendEmailForVerification = () => {
    if(!validEmailFormat()) return;

    sendVerificatiionEmail(VERIFICATION_TYPE.FIND_ID, email)
    .then(() => triggerToastSuccess(t('findId.messages.emailSent')))
    .catch((err) => triggerToastFail(t('findId.messages.emailSendFailed'), err));
  }

  const verifyEmailForVerification = () => {
    console.log(`request verification : ${email} ==> ${authCode}`);
    verifyVerificationEmail(VERIFICATION_TYPE.FIND_ID, email, authCode)
    .then((res) => {
      console.log('API 응답 객체 (res):', res);
      if(res.status === HttpStatusCode.Ok) {
        triggerToastSuccess(t('findId.messages.verificationSuccess'));
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
        triggerToastFail(t('findId.messages.verificationFailed'));
        console.log(`Fail to verify email verification. ${err}`);
      }
    });
  }

  const validEmailFormat = () => {
    var regEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
    if(!email || regEmail.test(email)) {
      triggerToastFail(t('findId.validation.emailFormat'));
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

  const closeModal = () => {
    setIsModalOpen(false);
    setFoundId('');
    // 폼 초기화
    setFormData({ email: '', name: '' });
  };

  return (
    <AuthLayout title={t('findId.title')}>
      <h2>{t('findId.title')}</h2>
      <form className={styles.signUpForm} onSubmit={handleSubmit}>
        <label htmlFor="name">{t('findId.form.name')}</label>
        <input
          id="name"
          type="text"
          placeholder={t('findId.form.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">{t('findId.form.email')}</label>
        <div className={styles.rowInput}>
          <input
            id="email"
            type="email"
            placeholder={t('findId.form.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className={checkVerificationEmail ? styles.grayButton : styles.activeButton}
            onClick={sendEmailForVerification}
            disabled={checkVerificationEmail}
          >
            {t('findId.form.sendVerification')}
          </button>
        </div>

        <div className={styles.rowInput}>
          <input
            type="text"
            placeholder={t('findId.form.verificationCodePlaceholder')}
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
          />
          <button
            type="button"
            className={checkVerificationEmail ? styles.grayButton : styles.activeButton}
            onClick={verifyEmailForVerification}
            disabled={checkVerificationEmail}
          >
            {t('findId.form.verify')}
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          {t('findId.form.submitButton')}
        </button>

        <div className={styles.loginLink}>
          <a href="/login">{t('findId.footer.backToLogin')}</a>
        </div>
      </form>

      
      {showFailToast && <ToastFail message={failMessage}/>}
      {showSuccessToast && <ToastSuccess message={successMessage}/>}
      {isModalOpen && <IdFoundModal isOpen={isModalOpen} onClose={closeModal} foundId={foundId}/>}
    </AuthLayout>
  );
}

export default FindIdPage;

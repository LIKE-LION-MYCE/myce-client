import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SignUpPage.module.css";
import AuthLayout from "../../layout/AuthLayout";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { checkDuplicateLoginId, 
  sendVerificatiionEmail, 
  signup, 
  verifyVerificationEmail, 
  VERIFICATION_TYPE } from "../../../api/service/auth/AuthService";
import { HttpStatusCode } from "axios";
import ToastFail from "../../../common/components/toastFail/ToastFail";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import PhoneInput from "../../../common/components/phoneInput/PhoneInput";
import DateInput from "../../../common/components/dateInput/DateInput";
import { validatePhoneNumber } from "../../../utils/phoneFormatter";

const SignUpPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailCode: "",
    birth: "",
    phone: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [checkDuplicateId, setCheckDuplicateId] = useState(false);
  const [checkVerificationEmail, setCheckVerificationEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if(name === 'loginId') setCheckDuplicateId(false);
    if(name === 'email') setCheckVerificationEmail(false);

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!validateInput()) {
      return;
    };

    if(!checkDuplicateId) {
      triggerToastFail(t('signup.validation.duplicateIdCheck'));
      return;
    }

    if(!checkVerificationEmail) {
      triggerToastFail(t('signup.validation.emailVerification'));
      return;
    }
      
    signup({...form}).then((res) => {
      if (res.status === HttpStatusCode.Ok) {
        alert(t('signup.messages.success'));
        window.location.href = '/login';
      } else {
        onsole.log(`회원가입에 실패했습니다. ${res.status}`)
      }
    }).catch((err) => {
      if(err.response.data.message) {
        const message = err.response.data.message;
        triggerToastFail(message);
      }
      console.log(`회원가입에 실패했습니다. ${err}`)
    });
  };

  const validateInput = () => {
    if (form.name.length < 2 || form.name.length > 10) {
      triggerToastFail(t('signup.validation.nameLength'));
      return;
    }

    if(!validLoginIdFormat()) return;

    const password = form.password;
    if(password.length < 6 || password.length > 12) {
      triggerToastFail(t('signup.validation.passwordLength'));
      return;
    }

    if (password !== form.confirmPassword) {
      triggerToastFail(t('signup.validation.passwordMismatch'));
      return;
    }

    if(!validEmailFormat()) return;

    if(!form.phone || !validatePhoneNumber(form.phone)) {
      triggerToastFail(t('signup.validation.phoneFormat'));
      return;
    }

    const dateRegex = /^\d{4}\d{2}\d{2}$/;
    var birth = form.birth;
    if(!birth || !dateRegex.test(birth)) {
      triggerToastFail(t('signup.validation.birthFormat'));
      return;
    }

    return true;
  }

  const checkDuplicateInputLoginId = () => {
    if(!validLoginIdFormat()) return;

    checkDuplicateLoginId(form.loginId)
    .then((res) => {
      if(res.status === HttpStatusCode.Ok) {
        const isDuplicate = res.data.duplicate;
        console.log(isDuplicate);
        if(isDuplicate) {
          setCheckDuplicateId(false);
          triggerToastFail(t('signup.validation.duplicateId'));
        } else {
          setCheckDuplicateId(true);
          triggerToastSuccess(t('signup.validation.availableId'));
        }
      } else {
        triggerToastFail(t('signup.validation.duplicateCheckFailed'));
        console.log(`Fail to check duplicate login id. ${err}`);
      }
    })
  }

  const sendEmailForVerification = () => {
    if(!validEmailFormat()) return;

    sendVerificatiionEmail(VERIFICATION_TYPE.SIGNUP, form.email)
    .then(() => triggerToastSuccess(t('signup.messages.emailSent')))
    .catch((err) => triggerToastFail(t('signup.messages.emailSendFailed'), err));
  }

  const verifyEmailForVerification = () => {
    console.log(`request verification : ${form.email} ==> ${form.emailCode}`);
    verifyVerificationEmail('SIGNUP',form.email, form.emailCode)
    .then((res) => {
      if(res.status === HttpStatusCode.Ok) {
        triggerToastSuccess(t('signup.messages.verificationSuccess'));
        setCheckVerificationEmail(true);
      } else {
        triggerToastFail(response.data.message);
      }
    })
    .catch((err) => {
      const res = err.response;
      if(res.data?.message) {
        triggerToastFail(res.data.message);
      } else {
        triggerToastFail(t('signup.messages.verificationFailed'));
        console.log(`Fail to verify email verification. ${err}`);
      }
    });
  }

  const validLoginIdFormat = () => {
    const regLoginId = /^[a-zA-Z0-9]*$/;
    const loginId = form.loginId;
    if (loginId.length < 5 || loginId.length > 20 || !regLoginId.test(loginId)) {
      triggerToastFail(t('signup.validation.userIdFormat'));
      return false;
    }

    return true;
  }

  const validEmailFormat = () => {
    var regEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
    if(!form.email || regEmail.test(form.email)) {
      triggerToastFail(t('signup.validation.emailFormat'));
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
      <h2>{t('signup.title')}</h2>
      <form onSubmit={handleSubmit} className={styles.signUpForm}>
        <label>
          {t('signup.form.name')}
          <input
            name="name"
            placeholder={t('signup.form.namePlaceholder')}
            value={form.name}
            onChange={handleChange}
          />
        </label>
        <label>
          {t('signup.form.userId')}
          <div className={styles.rowInput}>
            <input
              name="loginId"
              placeholder={t('signup.form.userIdPlaceholder')}
              value={form.loginId}
              onChange={handleChange}
            />
            <button type="button" 
            className={checkDuplicateId ? styles.grayButton : styles.activeButton} 
            onClick={checkDuplicateInputLoginId}
            disabled={checkDuplicateId}
            >
              {t('signup.form.duplicateCheck')}
            </button>
          </div>
        </label>
        <label>
          {t('signup.form.password')}
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t('signup.form.passwordPlaceholder')}
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
        </label>
        <label>
          {t('signup.form.confirmPassword')}
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder={t('signup.form.confirmPasswordPlaceholder')}
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <AiOutlineEye />
              ) : (
                <AiOutlineEyeInvisible />
              )}
            </button>
          </div>
        </label>
        <label>
          {t('signup.form.email')}
          <div className={styles.rowInput}>
            <input
              name="email"
              placeholder={t('signup.form.emailPlaceholder')}
              value={form.email}
              onChange={handleChange}
            />
            <button type="button" 
            className={checkVerificationEmail ? styles.grayButton : styles.activeButton} 
            onClick={sendEmailForVerification}
            disabled={checkVerificationEmail}>
              {t('signup.form.sendVerification')}
            </button>
          </div>
        </label>
        <label>
          <div className={styles.rowInput}>
            <input
              name="emailCode"
              placeholder={t('signup.form.verificationCodePlaceholder')}
              value={form.emailCode}
              onChange={handleChange}
            />
            <button type="button" 
            className={checkVerificationEmail ? styles.grayButton : styles.activeButton} 
            onClick={verifyEmailForVerification}
            disabled={checkVerificationEmail}>
              {t('signup.form.verify')}
            </button>
          </div>
        </label>
        <label>
          {t('signup.form.birth')}
          <DateInput
            name="birth"
            value={form.birth}
            onChange={handleChange}
            format="YYYYMMDD"
            required
          />
        </label>
        <div className={styles.genderGroup}>
          <label>{t('signup.form.gender')}</label>
          <div className={styles.genderToggle}>
            <button
              name="gender"
              type="button"
              value="MALE"
              className={`${styles.genderBtn} ${styles.left} ${form.gender === 'MALE' ? styles.selected : ''}`}
              onClick={handleChange}
            >
              {t('signup.form.male')}
            </button>
            <div className={styles.divider}></div>
            <button
              name="gender"
              type="button"
              value="FEMALE"
              className={`${styles.genderBtn} ${styles.right} ${form.gender === 'FEMALE' ? styles.selected : ''}`}
              onClick={handleChange}
            >
              {t('signup.form.female')}
            </button>
          </div>
        </div>
        <label>
          {t('signup.form.phone')}
          <PhoneInput
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          {t('signup.form.submitButton')}
        </button>
      </form>
      <p className={styles.loginLink}>
        {t('signup.footer.alreadyHaveAccount')} <a href="/login">{t('signup.footer.login')}</a>
      </p>
      
      {showFailToast && <ToastFail message={failMessage}/>}
      {showSuccessToast && <ToastSuccess message={successMessage}/>}
    </AuthLayout>
  );
};

export default SignUpPage;

// src/pages/findPassword/FindPassword.jsx
import { useState } from "react";
import styles from "./FindPasswordPage.module.css";
import AuthLayout from "../../layout/AuthLayout";
import { findPassword, sendVerificatiionEmail, VERIFICATION_TYPE, verifyVerificationEmail } from "../../../api/service/auth/AuthService";
import ToastFail from "../../../common/components/toastFail/ToastFail";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import { HttpStatusCode } from "axios";

const FindPassword = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSendAuthCode = () => {
    // TODO: 인증 코드 이메일 발송 API 호출
    console.log("이메일 인증 발송:", form.email);

    if(!validEmailFormat()) return;

    sendVerificatiionEmail(VERIFICATION_TYPE.FIND_PASSWORD, form.email)
    .then(() => triggerToastSuccess('메일이 발송되었습니다.'))
    .catch((err) => triggerToastFail('메일 발송에 실패했습니다.', err));
  };

  const handleVerifyCode = () => {
    // TODO: 인증번호 확인 API 호출
    console.log("입력된 인증번호:", form.emailCode);
    verifyVerificationEmail(VERIFICATION_TYPE.FIND_PASSWORD, form.email, form.emailCode)
    .then((res) => {
      console.log('API 응답 객체 (res):', res);
      if(res.status === HttpStatusCode.Ok) {
        triggerToastSuccess('인증이 완료되었습니다.');
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
        triggerToastFail("인증에 실패했습니다.");
        console.log(`Fail to verify email verification. ${err}`);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 임시 비밀번호 발급 처리
    console.log("임시 비밀번호 발송");

    if(!form.name) {
      triggerToastFail('이름을 입력해주세요.');
      return;
    }

    if(!form.loginId) {
      triggerToastFail('로그인아이디를 입력해주세요.');
      return;
    }

    if(!validEmailFormat()) return;

    if(!checkVerificationEmail) {
      triggerToastFail('이메일 인증을 완료해주세요.');
      return;
    }

    findPassword(form.name, form.loginId, form.email)
    .then(res => {
      triggerToastSuccess('임시 비밀번호를 전송했습니다.');
    })
    .catch(err => {
      const res = err.response;
      if(res.data?.message) {
        triggerToastFail(res.data.message);
      } else {
        triggerToastFail('회원 정보를 찾을 수 없습니다.')
      }
    })
  };

  const validEmailFormat = () => {
    var regEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
    if(!form.email || regEmail.test(form.email)) {
      triggerToastFail('이메일 형식이 올바르지 않습니다.');
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
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          이름
          <input
            name="name"
            placeholder="이름을 입력하세요"
            value={form.name}
            onChange={handleChange}
          />
        </label>
        <label>
          아이디
          <input
            name="loginId"
            placeholder="아이디를 입력하세요"
            value={form.loginId}
            onChange={handleChange}
          />
        </label>
        <label>
          이메일
          <div className={styles.rowInput}>
            <input
              name="email"
              placeholder="가입시 사용한 이메일을 입력하세요"
              value={form.email}
              onChange={handleChange}
            />
            <button
              type="button"
              className={checkVerificationEmail ? styles.grayButton : styles.activeButton}
              onClick={handleSendAuthCode}
              disabled={checkVerificationEmail}
            >
              인증발송
            </button>
          </div>
        </label>
        <label>
          <div className={styles.rowInput}>
            <input
              name="emailCode"
              placeholder="인증번호를 입력하세요."
              value={form.emailCode}
              onChange={handleChange}
            />
            <button
              type="button"
              className={checkVerificationEmail ? styles.grayButton : styles.activeButton}
              onClick={handleVerifyCode}
              disabled={checkVerificationEmail}
            >
              확인
            </button>
          </div>
        </label>
        <button type="submit" className={styles.submitButton}>
          임시 비밀번호 발송
        </button>
      </form>
      <p className={styles.loginLink}>
        <a href="/login">로그인으로 돌아가기</a>
      </p>
      {showFailToast && <ToastFail message={failMessage}/>}
      {showSuccessToast && <ToastSuccess message={successMessage}/>}
    </AuthLayout>
  );
};

export default FindPassword;

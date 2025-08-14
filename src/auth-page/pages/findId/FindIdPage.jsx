import { useState } from "react";
import AuthLayout from "../../layout/AuthLayout";
import styles from "./FindIdPage.module.css";
import { findId, sendVerificatiionEmail, verifyVerificationEmail, VERIFICATION_TYPE } from "../../../api/service/auth/AuthService";
import ToastFail from "../../../common/components/toastFail/ToastFail";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import { HttpStatusCode } from "axios";
import IdFoundModal from "../../components/bannerCancelDetailModal/IdFoundModal";

function FindIdPage() {
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
      triggerToastFail('이름을 입력해주세요.');
      return;
    }

    if(!validEmailFormat()) return;

    if(!checkVerificationEmail) {
      triggerToastFail('이메일 인증을 완료해주세요.');
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
      else triggerToastFail('아이디를 찾을 수 없습니다.');
  });

    console.log("아이디 찾기 요청", { name, email, authCode });
  };

const sendEmailForVerification = () => {
    if(!validEmailFormat()) return;

    sendVerificatiionEmail(VERIFICATION_TYPE.FIND_ID, email)
    .then(() => triggerToastSuccess('메일이 발송되었습니다.'))
    .catch((err) => triggerToastFail('메일 발송에 실패했습니다.', err));
  }

  const verifyEmailForVerification = () => {
    console.log(`request verification : ${email} ==> ${authCode}`);
    verifyVerificationEmail(VERIFICATION_TYPE.FIND_ID, email, authCode)
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
  }

  const validEmailFormat = () => {
    var regEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
    if(!email || regEmail.test(email)) {
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

  const closeModal = () => {
    setIsModalOpen(false);
    setFoundId('');
    // 폼 초기화
    setFormData({ email: '', name: '' });
  };

  return (
    <AuthLayout title="아이디 찾기">
      <h2>아이디 찾기</h2>
      <form className={styles.signUpForm} onSubmit={handleSubmit}>
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">이메일</label>
        <div className={styles.rowInput}>
          <input
            id="email"
            type="email"
            placeholder="가입한 이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className={checkVerificationEmail ? styles.grayButton : styles.activeButton}
            onClick={sendEmailForVerification}
            disabled={checkVerificationEmail}
          >
            인증발송
          </button>
        </div>

        <div className={styles.rowInput}>
          <input
            type="text"
            placeholder="인증번호를 입력하세요."
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
          />
          <button
            type="button"
            className={checkVerificationEmail ? styles.grayButton : styles.activeButton}
            onClick={verifyEmailForVerification}
            disabled={checkVerificationEmail}
          >
            확인
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          아이디 찾기
        </button>

        <div className={styles.loginLink}>
          <a href="/login">로그인으로 돌아가기</a>
        </div>
      </form>

      
      {showFailToast && <ToastFail message={failMessage}/>}
      {showSuccessToast && <ToastSuccess message={successMessage}/>}
      {isModalOpen && <IdFoundModal isOpen={isModalOpen} onClose={closeModal} foundId={foundId}/>}
    </AuthLayout>
  );
}

export default FindIdPage;

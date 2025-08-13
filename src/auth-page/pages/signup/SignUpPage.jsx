import { useState } from "react";
import styles from "./SignUpPage.module.css";
import AuthLayout from "../../layout/AuthLayout";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { checkDuplicateLoginId, sendVerificatiionEmail, signup, verifyVerificationEmail } from "../../../api/service/auth/AuthService";
import { HttpStatusCode } from "axios";
import ToastFail from "../../../common/components/toastFail/ToastFail";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";

const SignUpPage = () => {
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
      triggerToastFail('아이디 중복 검사를 해주세요.');
      return;
    }

    if(!checkVerificationEmail) {
      triggerToastFail('이메일 검증을 해주세요.');
      return;
    }
      
    signup({...form}).then((res) => {
      if (res.status === HttpStatusCode.Ok) {
        alert('회원가입이 완료되었습니다.');
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
      triggerToastFail('이름은 2자 이상 10자 이하로 입력해주세요.');
      return;
    }

    if(!validLoginIdFormat()) return;

    const password = form.password;
    if(password.length < 6 || password.length > 12) {
      triggerToastFail('비밀번호는 6자 이상 12자 이하로 입력해주세요.');
      return;
    }

    if (password !== form.confirmPassword) {
      triggerToastFail('비밀번호가 일치하지 않습니다.');
      return;
    }

    if(!validEmailFormat()) return;

    var phone = /^\d{2,3}-\d{3,4}-\d{4}$/;
    if(!form.phone || !phone.test(form.phone)) {
      triggerToastFail('전화번호 형식이 올바르지 않습니다.');
      return;
    }

    const dateRegex = /^\d{4}\d{2}\d{2}$/;
    var birth = form.birth;
    if(!birth || !dateRegex.test(birth)) {
      triggerToastFail('생년월일 형식이 올바르지 않습니다.(YYYYMMDD)');
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
          triggerToastFail('이미 존재하는 아이디입니다.');
        } else {
          setCheckDuplicateId(true);
          triggerToastSuccess('사용 가능한 아이디입니다.');
        }
      } else {
        triggerToastFail('아이디 중복 검증에 실패했습니다.');
        console.log(`Fail to check duplicate login id. ${err}`);
      }
    })
  }

  const sendEmailForVerification = () => {
    if(!validEmailFormat()) return;

    sendVerificatiionEmail(form.email)
    .then(() => triggerToastSuccess('메일이 발송되었습니다.'))
    .catch((err) => triggerToastFail('메일 발송에 실패했습니다.', err));
  }

  const verifyEmailForVerification = () => {
    console.log(`request verification : ${form.email} ==> ${form.emailCode}`);
    verifyVerificationEmail(form.email, form.emailCode)
    .then((res) => {
      if(res.status === HttpStatusCode.Ok) {
        triggerToastSuccess('인증이 완료되었습니다.');
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
        triggerToastFail("인증에 실패했습니다.");
        console.log(`Fail to verify email verification. ${err}`);
      }
    });
  }

  const validLoginIdFormat = () => {
    const regLoginId = /^[a-zA-Z0-9]*$/;
    const loginId = form.loginId;
    if (loginId.length < 5 || loginId.length > 20 || !regLoginId.test(loginId)) {
      triggerToastFail('로그인 아이디는 5자 이상 20자 이하의 영어와 숫자로만 입력해주세요.');
      return false;
    }

    return true;
  }

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
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className={styles.signUpForm}>
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
          <div className={styles.rowInput}>
            <input
              name="loginId"
              placeholder="아이디를 입력하세요"
              value={form.loginId}
              onChange={handleChange}
            />
            <button type="button" 
            className={checkDuplicateId ? styles.grayButton : styles.activeButton} 
            onClick={checkDuplicateInputLoginId}
            disabled={checkDuplicateId}
            >
              중복확인
            </button>
          </div>
        </label>
        <label>
          비밀번호
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="비밀번호를 입력하세요"
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
          비밀번호 확인
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
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
          이메일
          <div className={styles.rowInput}>
            <input
              name="email"
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={handleChange}
            />
            <button type="button" 
            className={checkVerificationEmail ? styles.grayButton : styles.activeButton} 
            onClick={sendEmailForVerification}
            disabled={checkVerificationEmail}>
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
            <button type="button" 
            className={checkVerificationEmail ? styles.grayButton : styles.activeButton} 
            onClick={verifyEmailForVerification}
            disabled={checkVerificationEmail}>
              확인
            </button>
          </div>
        </label>
        <label>
          생년월일
          <input
            name="birth"
            placeholder="예: 20011231"
            value={form.birth}
            onChange={handleChange}
          />
        </label>
        <div className={styles.genderGroup}>
          <label>성별</label>
          <div className={styles.genderToggle}>
            <button
              name="gender"
              type="button"
              value="MALE"
              className={`${styles.genderBtn} ${styles.left} ${form.gender === 'MALE' ? styles.selected : ''}`}
              onClick={handleChange}
            >
              남자
            </button>
            <div className={styles.divider}></div>
            <button
              name="gender"
              type="button"
              value="FEMALE"
              className={`${styles.genderBtn} ${styles.right} ${form.gender === 'FEMALE' ? styles.selected : ''}`}
              onClick={handleChange}
            >
              여자
            </button>
          </div>
        </div>
        <label>
          핸드폰번호
          <input
            name="phone"
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>
      <p className={styles.loginLink}>
        이미 계정이 있으신가요? <a href="/login">로그인</a>
      </p>
      
      {showFailToast && <ToastFail message={failMessage}/>}
      {showSuccessToast && <ToastSuccess message={successMessage}/>}
    </AuthLayout>
  );
};

export default SignUpPage;

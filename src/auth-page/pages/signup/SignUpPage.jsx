// src/pages/signup/SignUpPage.jsx
import { useState } from "react";
import styles from "./SignUpPage.module.css";
import AuthLayout from "../../layout/AuthLayout";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignUpPage = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailCode: "",
    birthdate: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 회원가입 처리 로직
  };

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
          <input
            name="username"
            placeholder="아이디를 입력하세요"
            value={form.username}
            onChange={handleChange}
          />
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
            <button type="button" className={styles.grayButton}>
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
            <button type="button" className={styles.grayButton}>
              확인
            </button>
          </div>
        </label>
        <label>
          생년월일
          <input
            name="birthdate"
            placeholder="예: 20011231"
            value={form.birthdate}
            onChange={handleChange}
          />
        </label>
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
    </AuthLayout>
  );
};

export default SignUpPage;

// src/pages/findPassword/FindPassword.jsx
import { useState } from "react";
import styles from "./FindPasswordPage.module.css";
import AuthLayout from "../../layout/AuthLayout";

const FindPassword = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    emailCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSendAuthCode = () => {
    // TODO: 인증 코드 이메일 발송 API 호출
    console.log("이메일 인증 발송:", form.email);
  };

  const handleVerifyCode = () => {
    // TODO: 인증번호 확인 API 호출
    console.log("입력된 인증번호:", form.emailCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 임시 비밀번호 발급 처리
    console.log("임시 비밀번호 발송");
  };

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
            name="username"
            placeholder="아이디를 입력하세요"
            value={form.username}
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
              className={styles.grayButton}
              onClick={handleSendAuthCode}
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
              className={styles.grayButton}
              onClick={handleVerifyCode}
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
    </AuthLayout>
  );
};

export default FindPassword;

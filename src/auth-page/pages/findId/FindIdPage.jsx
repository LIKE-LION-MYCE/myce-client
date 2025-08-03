import React, { useState } from "react";
import AuthLayout from "../../layout/AuthLayout";
import styles from "./FindIdPage.module.css";

function FindIdPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");

  const handleSendAuthCode = () => {
    console.log("인증 발송:", email);
  };

  const handleVerifyCode = () => {
    console.log("인증코드 확인:", authCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("아이디 찾기 요청", { name, email, authCode });
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
            className={styles.grayButton}
            onClick={handleSendAuthCode}
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
            className={styles.grayButton}
            onClick={handleVerifyCode}
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
    </AuthLayout>
  );
}

export default FindIdPage;

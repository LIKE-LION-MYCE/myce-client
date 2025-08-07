import { useState } from "react";
import styles from "./LoginPage.module.css";
import AuthLayout from "../../layout/AuthLayout";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { login } from "../../../api/service/auth/AuthService";
import { HttpStatusCode } from "axios";

const LOGIN_TYPE = {
  MEMBER: 'MEMBER',
  ADMIN_CODE: 'ADMIN_CODE'
};

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState(LOGIN_TYPE.MEMBER);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if(!userId) {
        alert('아이디를 입력해주세요.');
        return;
    }
    if(!password) {
      activeTab === LOGIN_TYPE.MEMBER ? 
        alert("비밀번호를 입력해주세요.") 
      : alert("사용자 코드를 입력해주세요.");
      return;
    }

    userLogin();
  };

  const userLogin = () => {
    login(activeTab, userId, password).then((res) => {
      if(res.status === HttpStatusCode.Ok) {
        alert('로그인이 완료되었습니다.');
        window.location.href = '/';

        // TODO 관리자 로그인 시 해당 박람회의 관리페이지로 바로 이동
        // 관리자의 박람회 id 조회하기
      }
    }).catch((err) => {
      alert('로그인에 실패했습니다.');
      console.log(`로그인에 실패했습니다. ${err}`)
    })
  }

  return (
    <AuthLayout>
      <h2>로그인</h2>
      <div className={styles.tab}>
        <button
          className={`${styles.tabButton} ${
            activeTab === LOGIN_TYPE.MEMBER ? styles.active : ""
          }`}
          onClick={() => setActiveTab(LOGIN_TYPE.MEMBER)}
        >
          일반 회원
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === LOGIN_TYPE.ADMIN_CODE ? styles.active : ""
          }`}
          onClick={() => setActiveTab(LOGIN_TYPE.ADMIN_CODE)}
        >
          관리자
        </button>
      </div>

      {activeTab === LOGIN_TYPE.MEMBER && (
        <>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <label>
              아이디
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={styles.inputText}
              />
            </label>
            <label>
              비밀번호
              <div className={styles.passwordInputWrapper}>
                <div className={styles.passwordInputInner}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputPassword}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </button>
                </div>
              </div>
            </label>
            <button type="submit" className={styles.loginButton}>
              로그인
            </button>
          </form>

          <div className={styles.socialLogin}>
            <div className={styles.divider}>
              <span className={styles.line}></span>
              <span className={styles.orText}>또는</span>
              <span className={styles.line}></span>
            </div>
            <button className={styles.socialButton}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/KakaoTalk_logo.svg/120px-KakaoTalk_logo.svg.png"
                alt="카카오"
                className={styles.socialIcon}
              />
              카카오로 로그인
            </button>
            <button className={styles.socialButton}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png"
                alt="구글"
                className={styles.socialIcon}
              />
              Google로 로그인
            </button>
            <button className={styles.socialButton}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/120px-Octicons-mark-github.svg.png"
                alt="깃허브"
                className={styles.socialIcon}
              />
              GitHub로 로그인
            </button>
          </div>

          <div className={styles.loginFooter}>
            <a href="/findId">아이디 찾기</a>
            <span>|</span>
            <a href="/findPassword">비밀번호 찾기</a>
            <span>|</span>
            <a href="/signup">회원가입</a>
          </div>
        </>
      )}

      {activeTab === LOGIN_TYPE.ADMIN_CODE && (
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <label>
            관리자 아이디
            <input
              type="text"
              placeholder="최상위 관리자 아이디를 입력하세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={styles.inputText}
            />
          </label>
          <label>
            관리자 코드
            <div className={styles.passwordInputWrapper}>
              <div className={styles.passwordInputInner}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="관리자 코드를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputPassword}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
              </div>
            </div>
          </label>
          <button type="submit" className={styles.loginButton}>
            관리자 로그인
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
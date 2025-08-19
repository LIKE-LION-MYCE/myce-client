import { useState } from "react";
import styles from "./LoginPage.module.css";
import AuthLayout from "../../layout/AuthLayout";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { googleLogin, kakaoLogin, login } from "../../../api/service/auth/AuthService";
import { getMyPermission } from "../../../api/service/expo-admin/permission/PermissionService";
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

  const handleGoogleLogin = () => {
    googleLogin();
  }

  const handleKakaoLogin = () => {
    kakaoLogin();
  }

  const userLogin = async () => {
    try {
      const res = await login(activeTab, userId, password);
      if (res.status === HttpStatusCode.Ok) {
        movePage();
      }
    } catch (err) {
      alert('로그인에 실패했습니다.');
      console.log(`로그인에 실패했습니다. ${err}`);
    }

     const movePage = async () => {
    // 관리자 코드 로그인인 경우 박람회 관리 페이지로 리다이렉트
        if (activeTab === LOGIN_TYPE.ADMIN_CODE) {
          try {
            const permissionData = await getMyPermission();
            if (permissionData.expoIds && permissionData.expoIds.length > 0) {
              const firstExpoId = permissionData.expoIds[0];
              window.location.href = `/expos/${firstExpoId}/admin`;
              return;
            }
          } catch (permissionError) {
            console.error('권한 조회 실패:', permissionError);
            alert('박람회 정보를 불러오는데 실패했습니다. 메인 페이지로 이동합니다.');
          }
        }
        
        // 일반 로그인이거나 관리자 권한 조회 실패시 메인 페이지로
        window.location.href = '/';
  }
  };

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
            <button className={styles.socialButton} onClick={handleKakaoLogin}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/KakaoTalk_logo.svg/120px-KakaoTalk_logo.svg.png"
                alt="카카오"
                className={styles.socialIcon}
              />
              카카오로 로그인
            </button>
            <button className={styles.socialButton} onClick={handleGoogleLogin}>
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
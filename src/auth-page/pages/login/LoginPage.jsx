import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LoginPage.module.css";
import AuthLayout from "../../layout/AuthLayout";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { googleLogin, kakaoLogin, login } from "../../../api/service/auth/AuthService";
import { getMyPermission } from "../../../api/service/expo-admin/permission/PermissionService";
import { HttpStatusCode } from "axios";
import ToastFail from "../../../common/components/toastFail/ToastFail";

const LOGIN_TYPE = {
  MEMBER: 'MEMBER',
  ADMIN_CODE: 'ADMIN_CODE'
};

const LoginPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(LOGIN_TYPE.MEMBER);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if(!userId) {
        triggerToastFail(t('login.validation.userIdRequired'));
        return;
    }
    if(!password) {
      activeTab === LOGIN_TYPE.MEMBER ? 
        triggerToastFail(t('login.validation.passwordRequired'))
      : triggerToastFail(t('login.validation.adminCodeRequired'));
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
        await movePage();
      }
    } catch (err) {
      triggerToastFail(t('login.messages.loginFailed'));
      console.log(`로그인에 실패했습니다. ${err}`);
    }
  };

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
            triggerToastFail(t('login.messages.expoInfoLoadFailed'));
          }
        }
        
        // 일반 로그인이거나 관리자 권한 조회 실패시 메인 페이지로
        window.location.href = '/';
  }

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  return (
    <AuthLayout>
      <h2>{t('login.title')}</h2>
      <div className={styles.tab}>
        <button
          className={`${styles.tabButton} ${
            activeTab === LOGIN_TYPE.MEMBER ? styles.active : ""
          }`}
          onClick={() => setActiveTab(LOGIN_TYPE.MEMBER)}
        >
          {t('login.tabs.member')}
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === LOGIN_TYPE.ADMIN_CODE ? styles.active : ""
          }`}
          onClick={() => setActiveTab(LOGIN_TYPE.ADMIN_CODE)}
        >
          {t('login.tabs.admin')}
        </button>
      </div>

      {activeTab === LOGIN_TYPE.MEMBER && (
        <>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <label>
              {t('login.form.userId')}
              <input
                type="text"
                placeholder={t('login.form.userIdPlaceholder')}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={styles.inputText}
              />
            </label>
            <label>
              {t('login.form.password')}
              <div className={styles.passwordInputWrapper}>
                <div className={styles.passwordInputInner}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('login.form.passwordPlaceholder')}
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
              {t('login.form.loginButton')}
            </button>
          </form>

          <div className={styles.socialLogin}>
            <div className={styles.divider}>
              <span className={styles.line}></span>
              <span className={styles.orText}>{t('login.social.or')}</span>
              <span className={styles.line}></span>
            </div>
            <button className={styles.socialButton} onClick={handleKakaoLogin}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/KakaoTalk_logo.svg/120px-KakaoTalk_logo.svg.png"
                alt={t('login.social.kakaoAlt')}
                className={styles.socialIcon}
              />
              {t('login.social.kakaoLogin')}
            </button>
            <button className={styles.socialButton} onClick={handleGoogleLogin}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png"
                alt={t('login.social.googleAlt')}
                className={styles.socialIcon}
              />
              {t('login.social.googleLogin')}
            </button>
          </div>

          <div className={styles.loginFooter}>
            <a href="/findId">{t('login.footer.findId')}</a>
            <span>|</span>
            <a href="/findPassword">{t('login.footer.findPassword')}</a>
            <span>|</span>
            <a href="/signup">{t('login.footer.signup')}</a>
          </div>
        </>
      )}

      {activeTab === LOGIN_TYPE.ADMIN_CODE && (
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <label>
            {t('login.admin.adminId')}
            <input
              type="text"
              placeholder={t('login.admin.adminIdPlaceholder')}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={styles.inputText}
            />
          </label>
          <label>
            {t('login.admin.adminCode')}
            <div className={styles.passwordInputWrapper}>
              <div className={styles.passwordInputInner}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('login.admin.adminCodePlaceholder')}
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
            {t('login.admin.adminLoginButton')}
          </button>
        </form>
      )}
      {showFailToast && <ToastFail message={failMessage} />}
    </AuthLayout>
  );
};

export default LoginPage;
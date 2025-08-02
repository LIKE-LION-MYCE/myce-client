// auth-page/layout/AuthLayout.jsx
import styles from "./AuthLayout.module.css";

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {/* 로고 이미지 삽입 */}
        <div className={styles.logo}>
          <img src="/assets/MYCE_LOGO.png" alt="MYCE 로고" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

import React, { useState } from 'react';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa'; // react-icons
import styles from './PlatformAdminLogin.module.css'; // Import the CSS module

const PlatformAdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해주세요!');
    } else {
      // Handle login logic here
      console.log('로그인 성공');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>관리자 로그인</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">관리자 아이디</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="관리자 아이디를 입력하세요"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.loginButton}>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlatformAdminLogin;

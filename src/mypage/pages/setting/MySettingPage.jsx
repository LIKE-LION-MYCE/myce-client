import React, { useState } from "react";
import styles from "./MySettingPage.module.css";

const MySettingPage = () => {
  const [language, setLanguage] = useState("ko");
  const [fontSize, setFontSize] = useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("설정이 저장되었습니다.");
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>시스템 설정</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>언어 설정</div>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="language"
                value="ko"
                checked={language === "ko"}
                onChange={() => setLanguage("ko")}
              />
              한국어
            </label>
            <label>
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === "en"}
                onChange={() => setLanguage("en")}
              />
              English
            </label>
            <label>
              <input
                type="radio"
                name="language"
                value="jp"
                checked={language === "jp"}
                onChange={() => setLanguage("jp")}
              />
              日本語
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>폰트 크기</div>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="fontSize"
                value="small"
                checked={fontSize === "small"}
                onChange={() => setFontSize("small")}
              />
              작게
            </label>
            <label>
              <input
                type="radio"
                name="fontSize"
                value="medium"
                checked={fontSize === "medium"}
                onChange={() => setFontSize("medium")}
              />
              보통
            </label>
            <label>
              <input
                type="radio"
                name="fontSize"
                value="large"
                checked={fontSize === "large"}
                onChange={() => setFontSize("large")}
              />
              크게
            </label>
          </div>
        </div>

        <button type="submit" className={styles.applyBtn}>
          적용
        </button>
      </form>
    </div>
  );
};

export default MySettingPage;

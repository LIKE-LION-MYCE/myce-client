import React, { useState, useEffect } from "react";
import styles from "./MySettingPage.module.css";
import { getSettings, updateSettings } from "../../../api/service/user/memberApi";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import ToastFail from "../../../common/components/toastFail/ToastFail";

const MySettingPage = () => {
  const [language, setLanguage] = useState("ko");
  const [fontSize, setFontSize] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        const settings = response.data;
        setLanguage(settings.language || "ko");
        setFontSize(settings.fontSize || "medium");
      } catch (error) {
        console.error('설정 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const showSuccessMessage = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showFailMessage = (message) => {
    setToastMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({ language, fontSize });
      showSuccessMessage("설정이 저장되었습니다.");
    } catch (error) {
      console.error('설정 저장 실패:', error);
      showFailMessage("설정 저장에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className={styles.wrapper}>로딩 중...</div>;
  }

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
      
      {showSuccessToast && <ToastSuccess message={toastMessage} />}
      {showFailToast && <ToastFail message={toastMessage} />}
    </div>
  );
};

export default MySettingPage;

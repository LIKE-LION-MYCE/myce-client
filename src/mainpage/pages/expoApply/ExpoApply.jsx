import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpoForm from "../../components/expoForm/ExpoForm";
import styles from "./ExpoApply.module.css";

const ExpoApply = () => {
  const navigate = useNavigate();

  const handleNextPage = (formData) => {
    // 폼 데이터를 sessionStorage에 저장
    sessionStorage.setItem("expoFormData1", JSON.stringify(formData));
    // 다음 페이지로 이동
    navigate("/expo-apply2");
  };

  return (
    <div className={styles["expo-apply-container"]}>
      {/* onNextPage prop으로 다음 페이지 이동 함수 전달 */}
      <ExpoForm onNextPage={handleNextPage} />
    </div>
  );
};

export default ExpoApply;

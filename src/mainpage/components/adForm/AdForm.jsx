// src/mainpage/components/adForm/AdForm.jsx
import React, { useState, useRef } from "react";
import styles from "./AdForm.module.css";

const AdForm = ({ onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    adName: "",
    adLocation: "",
    bannerFile: null, // 이미지 파일 자체를 저장할 상태
    redirectUrl: "",
    adDescription: "",
    startDate: "",
    endDate: "",
    companyName: "",
    businessNumber: "",
    companyAddress: "",
    representativeName: "",
    representativeContact: "",
    representativeEmail: "",
  });

  // 파일 input에 접근하기 위한 ref
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        bannerFile: file,
      });
      console.log("선택된 파일:", file.name);
    }
  };

  // 이미지 업로드 버튼 클릭 시 숨겨진 input을 클릭하도록 하는 함수
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFormSubmit) {
      onFormSubmit(formData);
    }
  };

  return (
    <div className={styles["form-container"]}>
      <form onSubmit={handleSubmit}>
        <h1 className={styles["title"]}>광고 신청</h1>
        <p className={styles["subtitle"]}>광고 정보를 입력해주세요.</p>

        {/* 광고명 */}
        <div className={styles["form-group"]}>
          <label htmlFor="adName">광고명</label>
          <input
            type="text"
            id="adName"
            name="adName"
            value={formData.adName}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder="광고명을 입력해주세요"
          />
        </div>

        {/* 광고 배너 위치 */}
        <div className={styles["form-group"]}>
          <label htmlFor="adLocation">광고 배너 위치</label>
          <select
            id="adLocation"
            name="adLocation"
            value={formData.adLocation}
            onChange={handleChange}
            className={styles["select-field"]}
          >
            <option value="" disabled>
              광고 배너 위치를 선택해주세요
            </option>
            <option value="main-top">메인 페이지 상단</option>
            <option value="main-middle">메인 페이지 중간</option>
          </select>
        </div>

        {/* 광고 배너 */}
        <div className={styles["form-group"]}>
          <label htmlFor="adBanner">광고 배너</label>
          <div className={styles["ad-banner-upload"]}>
            <button
              type="button"
              className={styles["upload-button"]}
              onClick={handleFileUploadClick}
            >
              {/* 파일이 선택되면 파일명 표시 */}
              {formData.bannerFile ? formData.bannerFile.name : "이미지 업로드"}
            </button>
            <p className={styles["upload-info"]}>
              JPG, PNG 파일들을 업로드해주세요 (최대 10MB)
            </p>

            {/* 숨겨진 파일 input */}
            <input
              type="file"
              id="adBannerFile"
              name="adBannerFile"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* 광고 배너 클릭 시 이동할 페이지 URL */}
        <div className={styles["form-group"]}>
          <label htmlFor="redirectUrl">
            광고 배너 클릭 시 이동할 페이지 URL
          </label>
          <input
            type="text"
            id="redirectUrl"
            name="redirectUrl"
            value={formData.redirectUrl}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder="예: https://www.myce.link"
          />
        </div>

        {/* 광고 소개 */}
        <div className={styles["form-group"]}>
          <label htmlFor="adDescription">광고 소개</label>
          <textarea
            id="adDescription"
            name="adDescription"
            value={formData.adDescription}
            onChange={handleChange}
            className={styles["textarea-field"]}
          ></textarea>
        </div>

        {/* 광고 기간 */}
        <div className={styles["form-group"]}>
          <label>광고 기간</label>
          <div className={styles["date-range-group"]}>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={styles["input-field"]}
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={styles["input-field"]}
            />
          </div>
        </div>

        {/* 회사 정보 */}
        <div className={styles["section-title"]}>회사 정보</div>
        <div className={styles["form-group"]}>
          <div className={styles["inline-input-group"]}>
            <div className={styles["inline-input-item"]}>
              <label htmlFor="companyName">회사명</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={styles["input-field"]}
              />
            </div>
            <div className={styles["inline-input-item"]}>
              <label htmlFor="businessNumber">사업자 번호</label>
              <input
                type="text"
                id="businessNumber"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleChange}
                className={styles["input-field"]}
              />
            </div>
          </div>
        </div>

        {/* 회사 주소 */}
        <div className={styles["form-group"]}>
          <label htmlFor="companyAddress">회사 주소</label>
          <input
            type="text"
            id="companyAddress"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            className={styles["input-field"]}
          />
        </div>

        {/* 대표자 정보 */}
        <div className={styles["form-group"]}>
          <div className={styles["inline-input-group"]}>
            <div className={styles["inline-input-item"]}>
              <label htmlFor="representativeName">대표자명</label>
              <input
                type="text"
                id="representativeName"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleChange}
                className={styles["input-field"]}
              />
            </div>
            <div className={styles["inline-input-item"]}>
              <label htmlFor="representativeContact">대표자 연락처</label>
              <input
                type="text"
                id="representativeContact"
                name="representativeContact"
                value={formData.representativeContact}
                onChange={handleChange}
                className={styles["input-field"]}
              />
            </div>
          </div>
        </div>

        {/* 대표자 이메일 */}
        <div className={styles["form-group"]}>
          <label htmlFor="representativeEmail">대표자 이메일</label>
          <input
            type="email"
            id="representativeEmail"
            name="representativeEmail"
            value={formData.representativeEmail}
            onChange={handleChange}
            className={styles["input-field"]}
          />
        </div>

        {/* 버튼 그룹 */}
        <div className={styles["button-group"]}>
          <button
            type="button"
            className={styles["cancel-button"]}
            onClick={onCancel}
          >
            취소
          </button>
          <button type="submit" className={styles["submit-button"]}>
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdForm;

// src/mainpage/components/adForm/AdForm.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "./AdForm.module.css";
import { getAdPositions } from "../../../api/service/user/adPositionApi";
import { saveAdvertisement } from "../../../api/service/user/advertisementApi";
import ImageUpload from "../../../common/components/imageUpload/ImageUpload";

const AdForm = ({ onFormSubmit, onCancel }) => {
  // 서버에 보낼 정보만 유지
  const [formData, setFormData] = useState({
    adPositionId: "", // 광고 위치 id (select)
    title: "", // 광고명
    imageUrl: "", // 광고 이미지 URL (업로드 결과)
    linkUrl: "", // 광고 클릭 시 이동 URL
    description: "", // 광고 소개
    displayStartDate: "", // 광고 게시 시작일
    displayEndDate: "", // 광고 게시 종료일
    // 회사 정보
    companyName: "",
    businessRegistrationNumber: "",
    address: "",
    ceoName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const [adPositions, setAdPositions] = useState([]); // 광고 위치 리스트 추가
  const [submitting, setSubmitting] = useState(false);

  // 광고 위치 리스트 불러오기
  useEffect(() => {
    async function fetchAdPositions() {
      try {
        const positions = await getAdPositions();
        setAdPositions(positions);
      } catch (error) {
        console.error("광고 위치 불러오기 실패:", error);
      }
    }
    fetchAdPositions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 이미지 업로드 성공 시 imageUrl에 저장
  const handleImageUploadSuccess = (cdnUrl) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: cdnUrl,
    }));
  };

  // 이미지 업로드 실패 시
  const handleImageUploadError = (error) => {
    alert("이미지 업로드에 실패했습니다.");
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 서버 요구에 맞게 변환
    const adData = {
      adPositionId: Number(formData.adPositionId),
      title: formData.title,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl,
      description: formData.description,
      displayStartDate: formData.displayStartDate,
      displayEndDate: formData.displayEndDate,
      registrationCompanyRequest: {
        companyName: formData.companyName,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        address: formData.address,
        ceoName: formData.ceoName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
      },
    };

    // 중복 제출 방지
    if (submitting) return;

    setSubmitting(true);
    try {
      await saveAdvertisement(adData);
      alert("광고가 성공적으로 등록되었습니다.");
    } catch (error) {
      alert("광고 등록에 실패했습니다. 입력값을 확인해 주세요.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles["form-container"]}>
      <form onSubmit={handleSubmit}>
        <h1 className={styles["title"]}>광고 신청</h1>
        <p className={styles["subtitle"]}>광고 정보를 입력해주세요.</p>

        {/* 광고명 */}
        <div className={styles["form-group"]}>
          <label htmlFor="title">광고명</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder="광고명을 입력해주세요"
            required
          />
        </div>

        {/* 광고 배너 위치 */}
        <div className={styles["form-group"]}>
          <label htmlFor="adPositionId">광고 배너 위치</label>
          <select
            id="adPositionId"
            name="adPositionId"
            value={formData.adPositionId}
            onChange={handleChange}
            className={styles["select-field"]}
            required
          >
            <option value="" disabled>
              광고 배너 위치를 선택해주세요
            </option>
            {adPositions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.name}
              </option>
            ))}
          </select>
        </div>

        {/* 광고 이미지 (S3 업로드) */}
        <div className={styles["form-group"]}>
          <label>광고 배너 이미지</label>
          <ImageUpload
            onUploadSuccess={handleImageUploadSuccess}
            onUploadError={handleImageUploadError}
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="광고 미리보기"
              style={{
                maxWidth: "200px",
                maxHeight: "100px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            />
          )}
        </div>

        {/* 광고 배너 클릭 시 이동할 페이지 URL */}
        <div className={styles["form-group"]}>
          <label htmlFor="linkUrl">광고 배너 클릭 시 이동할 페이지 URL</label>
          <input
            type="text"
            id="linkUrl"
            name="linkUrl"
            value={formData.linkUrl}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder="예: https://www.myce.link"
            required
          />
        </div>

        {/* 광고 소개 */}
        <div className={styles["form-group"]}>
          <label htmlFor="description">광고 소개</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles["textarea-field"]}
            required
          ></textarea>
        </div>

        {/* 광고 기간 */}
        <div className={styles["form-group"]}>
          <label>광고 기간</label>
          <div className={styles["date-range-group"]}>
            <input
              type="date"
              name="displayStartDate"
              value={formData.displayStartDate}
              onChange={handleChange}
              className={styles["input-field"]}
              required
            />
            <input
              type="date"
              name="displayEndDate"
              value={formData.displayEndDate}
              onChange={handleChange}
              className={styles["input-field"]}
              required
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
                required
              />
            </div>
            <div className={styles["inline-input-item"]}>
              <label htmlFor="businessRegistrationNumber">사업자 번호</label>
              <input
                type="text"
                id="businessRegistrationNumber"
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleChange}
                className={styles["input-field"]}
                required
              />
            </div>
          </div>
        </div>

        {/* 회사 주소 */}
        <div className={styles["form-group"]}>
          <label htmlFor="address">회사 주소</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={styles["input-field"]}
            required
          />
        </div>

        {/* 대표자 정보 */}
        <div className={styles["form-group"]}>
          <div className={styles["inline-input-group"]}>
            <div className={styles["inline-input-item"]}>
              <label htmlFor="ceoName">대표자명</label>
              <input
                type="text"
                id="ceoName"
                name="ceoName"
                value={formData.ceoName}
                onChange={handleChange}
                className={styles["input-field"]}
                required
              />
            </div>
            <div className={styles["inline-input-item"]}>
              <label htmlFor="contactPhone">대표자 연락처</label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className={styles["input-field"]}
                required
              />
            </div>
          </div>
        </div>

        {/* 대표자 이메일 */}
        <div className={styles["form-group"]}>
          <label htmlFor="contactEmail">대표자 이메일</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className={styles["input-field"]}
            required
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

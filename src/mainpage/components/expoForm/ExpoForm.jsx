// ExpoForm.jsx
import React, { useState } from "react";
import styles from "./ExpoForm.module.css";
import { MdAccessTime } from "react-icons/md";
import ImageUpload from "../../../common/components/imageUpload/ImageUpload";

const ExpoForm = ({ onNextPage, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      posterUrl: "",
      expoName: "",
      startDate: "",
      endDate: "",
      displayStartDate: "",
      displayEndDate: "",
      location: "",
      locationDetail: "",
      startTime: "",
      endTime: "",
    }
  );
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // ImageUpload -> 업로드 성공 시 CDN URL 저장
  const handlePosterSuccess = (cdnUrl) => {
    setFormData((prev) => ({
      ...prev,
      posterUrl: cdnUrl,
    }));
    setFormErrors((prev) => ({
      ...prev,
      posterUrl: "", // 에러 제거
    }));
  };

  // 업로드 실패
  const handlePosterError = (error) => {
    setFormErrors((prev) => ({
      ...prev,
      posterUrl: "이미지 업로드에 실패했습니다. 다시 시도해 주세요.",
    }));
  };

  // **전체 폼 검증 함수**
  const validateAll = (data = formData) => {
    const errors = {};

    // 1. 필수값
    if (!data.posterUrl) errors.posterUrl = "포스터 이미지를 업로드해주세요.";
    if (!data.expoName.trim()) errors.expoName = "박람회 이름을 입력해주세요.";
    if (!data.startDate) errors.startDate = "개최 시작일을 입력해주세요.";
    if (!data.endDate) errors.endDate = "개최 종료일을 입력해주세요.";
    if (!data.displayStartDate)
      errors.displayStartDate = "게시 시작일을 입력해주세요.";
    if (!data.displayEndDate)
      errors.displayEndDate = "게시 종료일을 입력해주세요.";
    if (!data.location.trim()) errors.location = "박람회 장소를 입력해주세요.";
    if (!data.locationDetail.trim())
      errors.locationDetail = "박람회 세부장소를 입력해주세요.";
    if (!data.startTime) errors.startTime = "운영 시작시간을 선택해주세요.";
    if (!data.endTime) errors.endTime = "운영 종료시간을 선택해주세요.";

    // 2. 날짜/시간 논리
    // 개최기간 논리
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      errors.startDate = "시작일은 종료일보다 이전이어야 합니다.";
      errors.endDate = "종료일은 시작일보다 이후여야 합니다.";
    }

    // 게시기간 논리 (게시 시작 <= 게시 종료)
    if (
      data.displayStartDate &&
      data.displayEndDate &&
      data.displayStartDate > data.displayEndDate
    ) {
      errors.displayStartDate =
        "게시 시작일은 게시 종료일보다 이전이어야 합니다.";
      errors.displayEndDate = "게시 종료일은 게시 시작일보다 이후여야 합니다.";
    }

    // 게시 종료일이 개최 종료일보다 늦을 수 없음
    if (
      data.displayEndDate &&
      data.endDate &&
      data.displayEndDate > data.endDate
    ) {
      errors.displayEndDate = "게시 종료일은 개최 종료일보다 늦을 수 없습니다.";
    }

    // 운영시간 논리
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      errors.startTime = "운영 시작 시간은 종료 시간보다 이전이어야 합니다.";
      errors.endTime = "운영 종료 시간은 시작 시간보다 이후여야 합니다.";
    }
    return errors;
  };

  // **단일 필드 검증**
  const validateField = (name, value) => {
    const data = { ...formData, [name]: value };
    const errors = validateAll(data);
    setFormErrors((prev) => ({
      ...prev,
      [name]: errors[name] || "",
    }));
  };

  // **input 변경 처리**
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  // **파일 변경 처리**
  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      posterFile: file,
    }));
    validateField("posterFile", file);
  };

  // **제출 처리**
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateAll();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      // 에러가 있으면 제출 막기
      alert("필수 정보를 모두 올바르게 입력해주세요.");
      return;
    }
    onNextPage && onNextPage(formData);
  };

  // 시간 옵션 생성
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 21; hour++) {
      const time = hour.toString().padStart(2, "0") + ":00";
      times.push(time);
    }
    return times;
  };

  return (
    <div className={styles["form-container"]}>
      <form onSubmit={handleSubmit}>
        <h1 className={styles["title"]}>박람회 신청</h1>
        <p className={styles["subtitle"]}>박람회 기본정보를 입력해주세요.</p>
        {/* 포스터 */}
        {/* ImageUpload 사용 */}
        <h2 className={styles["section-title"]}>박람회 포스터</h2>
        <div className={styles["poster-upload-group"]}>
          <ImageUpload
            onUploadSuccess={handlePosterSuccess}
            onUploadError={handlePosterError}
            disabled={uploading}
          />
          <p className={styles["upload-info"]}>
            JPG, PNG, GIF, WebP (10MB 이하)
          </p>
          {formErrors.posterUrl && (
            <p className={styles["error-text"]}>{formErrors.posterUrl}</p>
          )}
          {/* 미리보기 */}
          {formData.posterUrl && (
            <img
              src={formData.posterUrl}
              alt="포스터 미리보기"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            />
          )}
        </div>
        {/* 이름 */}
        <div className={styles["form-group"]}>
          <label htmlFor="expoName">박람회 이름</label>
          <input
            type="text"
            id="expoName"
            name="expoName"
            value={formData.expoName}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder="박람회 이름을 입력해주세요."
          />
          {formErrors.expoName && (
            <p className={styles["error-text"]}>{formErrors.expoName}</p>
          )}
        </div>
        {/* 개최기간 */}
        <div className={styles["form-group"]}>
          <label>박람회 개최기간</label>
          <div className={styles["date-range-group"]}>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={styles["input-field"]}
            />
            <span>-</span>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={styles["input-field"]}
            />
          </div>
          {(formErrors.startDate || formErrors.endDate) && (
            <p className={styles["error-text"]}>
              {formErrors.startDate || formErrors.endDate}
            </p>
          )}
        </div>
        {/* 게시기간 */}
        <div className={styles["form-group"]}>
          <label>박람회 게시기간</label>
          <div className={styles["date-range-group"]}>
            <input
              type="date"
              name="displayStartDate"
              value={formData.displayStartDate}
              onChange={handleChange}
              className={styles["input-field"]}
            />
            <span>-</span>
            <input
              type="date"
              name="displayEndDate"
              value={formData.displayEndDate}
              onChange={handleChange}
              className={styles["input-field"]}
            />
          </div>
          {(formErrors.displayStartDate || formErrors.displayEndDate) && (
            <p className={styles["error-text"]}>
              {formErrors.displayStartDate || formErrors.displayEndDate}
            </p>
          )}
        </div>
        {/* 장소 */}
        <div className={styles["form-group"]}>
          <label htmlFor="location">박람회 장소</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder="박람회 장소를 입력해주세요."
          />
          {formErrors.location && (
            <p className={styles["error-text"]}>{formErrors.location}</p>
          )}
        </div>
        {/* 세부 장소 */}
        <div className={styles["form-group"]}>
          <label htmlFor="locationDetail">세부 장소</label>
          <input
            type="text"
            id="locationDetail"
            name="locationDetail"
            value={formData.locationDetail}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder="예: 코엑스 A홀"
          />
          {formErrors.locationDetail && (
            <p className={styles["error-text"]}>{formErrors.locationDetail}</p>
          )}
        </div>
        {/* 운영시간 */}
        <div className={styles["form-group"]}>
          <label>박람회 운영시간</label>
          <div className={styles["time-select-group"]}>
            <div className={styles["select-button-wrapper"]}>
              <select
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={styles["select-button"]}
              >
                <option value="">시작 시간</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span className={styles["icon-inside"]}>
                <MdAccessTime />
              </span>
            </div>
            <span>~</span>
            <div className={styles["select-button-wrapper"]}>
              <select
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={styles["select-button"]}
              >
                <option value="">종료 시간</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span className={styles["icon-inside"]}>
                <MdAccessTime />
              </span>
            </div>
          </div>
          {(formErrors.startTime || formErrors.endTime) && (
            <p className={styles["error-text"]}>
              {formErrors.startTime || formErrors.endTime}
            </p>
          )}
        </div>
        {/* 제출 버튼 */}
        <div className={styles["submit-button-group"]}>
          <button type="submit" className={styles["submit-button"]}>
            다음 페이지
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpoForm;

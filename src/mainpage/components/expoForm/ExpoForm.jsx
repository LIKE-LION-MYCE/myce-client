// ExpoForm.jsx
import React, { useState } from "react";
import styles from "./ExpoForm.module.css";
import { MdAccessTime } from "react-icons/md";
import ImageUpload from "../../../common/components/imageUpload/ImageUpload";
import DaumPostcode from "react-daum-postcode";
import UsageGuidelines from "../../../common/components/usageGuidelines/UsageGuidelines";
import PricingInfo from "../../../common/components/pricingInfo/PricingInfo";

// .env 환경변수에서 구글맵 API 키 불러오기
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const ExpoForm = ({ onNextPage, initialData }) => {
  // 폼에 입력되는 모든 값(상태)을 한 번에 관리 (useState)
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
      latitude: "",
      longitude: "",
    }
  );
  // 각 입력 항목별 에러 메시지 (유효성 검사 결과)
  const [formErrors, setFormErrors] = useState({});
  // 업로드 중 여부 (이미지 업로드 버튼 비활성화용)
  const [uploading, setUploading] = useState(false);
  // 주소 검색 팝업 표시 여부
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // 주소 선택 시 실행됨
  const handleAddressComplete = (data) => {
    console.log("[주소 선택 완료]", data.address);
    // data.address에 선택된 도로명 주소가 담겨있음
    setFormData((prev) => ({
      ...prev,
      location: data.address,
    }));
    setIsPostcodeOpen(false);

    // 주소 선택 후 위도/경도 자동 변환
    geocodeAddress(data.address);
  };

  // 이미지 업로드 성공 시 CDN URL 저장
  const handlePosterSuccess = (cdnUrl) => {
    setFormData((prev) => ({
      ...prev,
      posterUrl: cdnUrl, // cdn 주소 저장
    }));
    setFormErrors((prev) => ({
      ...prev,
      posterUrl: "", // 이미지 에러 제거
    }));
  };

  // 이미지 업로드 실패
  const handlePosterError = (error) => {
    setFormErrors((prev) => ({
      ...prev,
      posterUrl: "이미지 업로드에 실패했습니다. 다시 시도해 주세요.",
    }));
  };

  // 전체 입력값 유효성 검사
  // 제출 직전 + 각 입력 시 호출
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

    // 2. 날짜/시간 체크
    // 개최기간: 시작 > 종료 불가
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      errors.startDate = "시작일은 종료일보다 이전이어야 합니다.";
      errors.endDate = "종료일은 시작일보다 이후여야 합니다.";
    }

    // 게시기간: 시작 > 종료 불가
    if (
      data.displayStartDate &&
      data.displayEndDate &&
      data.displayStartDate > data.displayEndDate
    ) {
      errors.displayStartDate =
        "게시 시작일은 게시 종료일보다 이전이어야 합니다.";
      errors.displayEndDate = "게시 종료일은 게시 시작일보다 이후여야 합니다.";
    }

    // 운영시간: 시작 >= 종료 불가
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      errors.startTime = "운영 시작 시간은 종료 시간보다 이전이어야 합니다.";
      errors.endTime = "운영 종료 시간은 시작 시간보다 이후여야 합니다.";
    }
    return errors;
  };

  // 단일 필드 유효성 검사
  // 각 인풋에 입력할 때마다 실시간 검증용
  const validateField = (name, value) => {
    const data = { ...formData, [name]: value };
    const errors = validateAll(data);
    setFormErrors((prev) => ({
      ...prev,
      [name]: errors[name] || "",
    }));
  };

  // 도로명 주소를 통해 위도/경도 변환
  const geocodeAddress = async (address) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        console.log("[좌표 변환] 위도:", location.lat, "경도:", location.lng);
        setFormData((prev) => ({
          ...prev,
          latitude: location.lat,
          longitude: location.lng,
        }));
      } else {
        console.warn("[좌표 변환 실패]", data.status, data.error_message);
        setFormData((prev) => ({
          ...prev,
          latitude: "",
          longitude: "",
        }));
      }
    } catch (e) {
      console.error("[좌표 변환 예외]", e);
      setFormData((prev) => ({
        ...prev,
        latitude: "",
        longitude: "",
      }));
    }
  };

  // 모든 input에 공통 적용: 값 변경 => 상태 반영 + 실시간 유효성 검사
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);

    // 주소 변경 시 위도/경도 자동 변환
    if (name === "location") {
      if (value.trim()) {
        geocodeAddress(value);
      } else {
        setFormData((prev) => ({
          ...prev,
          latitude: "",
          longitude: "",
        }));
      }
    }
  };

  // 파일 변경 처리
  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      posterFile: file,
    }));
    validateField("posterFile", file);
  };

  // 제출 버튼 클릭 시
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

  // 운영 시간 드롭다운용 시간 옵션
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 22; hour++) {
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

        {/* 주의사항 및 요금제 안내 */}
        <UsageGuidelines type="expo" />
        <PricingInfo type="expo" />
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

        {/* ========== 박람회 이름 입력 ========== */}
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

        {/* ========== 개최기간(시작/종료) ========== */}
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

        {/* ========== 게시기간(시작/종료) ========== */}
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

        {/* ========== 박람회 장소 ========== */}
        <div className={styles["form-group"]}>
          <label htmlFor="location">박람회 장소</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              readOnly
              className={styles["input-field"]}
              placeholder="주소 검색 버튼을 클릭하세요."
            />
            <button
              type="button"
              onClick={() => setIsPostcodeOpen(true)}
              className={styles["address-search-btn"]}
            >
              주소 검색
            </button>
          </div>
          {formErrors.location && (
            <p className={styles["error-text"]}>{formErrors.location}</p>
          )}
          {/* 주소 검색 팝업 오픈 시 */}
          {isPostcodeOpen && (
            <>
              {/* 오버레이 */}
              <div
                className={styles["address-popup-overlay"]}
                onClick={() => setIsPostcodeOpen(false)}
              />
              {/* 팝업 컨테이너 */}
              <div
                className={styles["address-popup-container"]}
                onClick={(e) => e.stopPropagation()}
              >
                {/* 닫기 버튼을 우측 하단에 */}
                <button
                  type="button"
                  className={styles["address-popup-close-bottom"]}
                  onClick={() => setIsPostcodeOpen(false)}
                >
                  검색창 닫기
                </button>
                <DaumPostcode
                  onComplete={handleAddressComplete}
                  autoClose
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* ========== 세부 장소 입력 ========== */}
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

        {/* ========== 운영시간(시작/종료) ========== */}
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

        {/* ========== 제출 버튼 ========== */}
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdForm.module.css";
import { getAdPositions } from "../../../api/service/user/adPositionApi";
import { saveAdvertisement, validatePeriod } from "../../../api/service/user/advertisementApi";
import ImageUpload from "../../../common/components/imageUpload/ImageUpload";
import DaumPostcode from "react-daum-postcode";
import UsageGuidelines from "../../../common/components/usageGuidelines/UsageGuidelines";
import PricingInfo from "../../../common/components/pricingInfo/PricingInfo";
import PhoneInput from "../../../common/components/phoneInput/PhoneInput";
import BusinessNumberInput from "../../../common/components/businessNumberInput/BusinessNumberInput";
import EstimatedAdCostModal from "../../../common/components/estimatedAdCostModal/EstimatedAdCostModal";

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
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 주소 검색 팝업
  const [isPeriodValid, setIsPeriodValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); // 폼 유효성 상태
  const [errorMessage, setErrorMessage] = useState(""); // 유효성 검사 오류 메시지 상태
  const [showEstimatedCostModal, setShowEstimatedCostModal] = useState(false); // 예상 이용료 모달 상태
  const navigate = useNavigate();

  // 주소 선택 시 호출
  const handleAddressComplete = (data) => {
    setFormData((prev) => ({
      ...prev,
      address: data.address, // 도로명 주소로 저장
    }));
    setIsPostcodeOpen(false);
  };

  // 예상 이용료 모달 열기
  const handleEstimatedCostClick = () => {
    if (!formData.adPositionId) {
      alert("광고 위치를 먼저 선택해주세요.");
      return;
    }
    
    if (!formData.displayStartDate || !formData.displayEndDate) {
      alert("광고 기간을 먼저 입력해주세요.");
      return;
    }
    
    setShowEstimatedCostModal(true);
  };

  // 예상 이용료 모달 닫기
  const handleCloseEstimatedCostModal = () => {
    setShowEstimatedCostModal(false);
  };

  const checkPeriodValidity = async () => {
    try {
      const today = new Date();
      const localeDate = today.toLocaleDateString("en-CA");
      if(!formData.displayStartDate || !formData.displayEndDate){
        setIsFormValid(false)
        setErrorMessage("");
        return;
      }else if(formData.displayStartDate > formData.displayEndDate) {
        setIsFormValid(false);
        setErrorMessage("시작일은 종료일보다 이전이어야 합니다.");
        return;
      }else if(formData.displayStartDate < localeDate) {
        setIsFormValid(false);
        setErrorMessage("시작일은 오늘 이후여야 합니다.");
        return;
      }else if(formData.displayEndDate < localeDate) {
        setIsFormValid(false);
        setErrorMessage("종료일은 오늘 이후여야 합니다.");
        return;
      }

      const response = await validatePeriod({
        displayStartDate: formData.displayStartDate,
        displayEndDate: formData.displayEndDate,
        adPositionId: formData.adPositionId,
      });

      if (response.status === 200) {
        setIsPeriodValid(true);
        setErrorMessage(""); // 유효성 검사 성공 시 오류 메시지 초기화
      } else {
        setIsPeriodValid(false);
        setErrorMessage("유효하지 않은 날짜입니다."); // 유효하지 않은 날짜일 때 오류 메시지 표시
      }
    } catch (error) {
      if (error.status === 409) {
        const { errorCode, message } = error.response.data;
        console.error(`Error Code: ${errorCode}, Message: ${message}`);
        setIsFormValid(false);
        setErrorMessage(message); // 409 에러에서 받은 메시지로 설정
      } else {
        console.error("기간 유효성 검사 실패:", error);
        setIsFormValid(false);
        setErrorMessage("유효하지 않은 날짜입니다."); // 다른 오류 발생 시 기본 오류 메시지 설정
      }
    }
  };


  // 광고 위치 리스트 불러오기
  useEffect(() => {
    async function fetchAdPositions() {
      try {
        const positions = await getAdPositions();
        console.log("광고 위치 리스트:", positions);
        setAdPositions(positions);
      } catch (error) {
        console.error("광고 위치 불러오기 실패:", error);
      }
    }
    fetchAdPositions();
  }, []);

  // formData 값이 바뀔 때마다 유효성 검사 실행
  useEffect(() => {
    console.log("adPositionId = ", formData.adPositionId);
    validateForm();
  }, [formData]);

  useEffect(() => {
    checkPeriodValidity();
  }, [formData.displayStartDate, formData.displayEndDate, formData.adPositionId]);

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

  // 유효성 검사
  const validateForm = () => {
    const {
      adPositionId,
      title,
      imageUrl,
      linkUrl,
      description,
      displayStartDate,
      displayEndDate,
      companyName,
      businessRegistrationNumber,
      address,
      ceoName,
      contactPhone,
      contactEmail,
    } = formData;

    const isValid =
      adPositionId &&
      title &&
      imageUrl &&
      linkUrl &&
      description &&
      displayStartDate &&
      displayEndDate &&
      companyName &&
      businessRegistrationNumber &&
      address &&
      ceoName &&
      contactPhone &&
      contactEmail &&
      displayStartDate < displayEndDate;// 시작일이 종료일보다 이전이어야 함

    setIsFormValid(isValid);
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
      navigate("/mypage/ads-status");
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
        
        {/* 주의사항 및 요금제 안내 */}
        <UsageGuidelines type="ad" />
        <PricingInfo type="ad" />

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

        {/* 광고 기간 */}
        <div className={styles["form-group"]}>
          <label>광고 기간</label>
          <div className={styles["date-range-group"]}>
            <input
              type="date"
              name="displayStartDate"
              value={formData.displayStartDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={styles["input-field"]}
              required
            />
            <input
              type="date"
              name="displayEndDate"
              value={formData.displayEndDate}
              onChange={handleChange}
              min={formData.displayStartDate || new Date().toISOString().split('T')[0]}
              className={styles["input-field"]}
              required
            />
          </div>
          {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}
          
          {/* 예상 이용료 확인 버튼 */}
          <div className={styles["estimated-cost-section"]}>
            <button
              type="button"
              className={`${styles["estimated-cost-button"]} ${
                !formData.adPositionId || !formData.displayStartDate || !formData.displayEndDate 
                  ? styles["disabled"] 
                  : ""
              }`}
              onClick={handleEstimatedCostClick}
              disabled={!formData.adPositionId || !formData.displayStartDate || !formData.displayEndDate}
            >
              💰 예상 이용료 확인
            </button>
            <p className={styles["estimated-cost-description"]}>
              {!formData.adPositionId || !formData.displayStartDate || !formData.displayEndDate
                ? "광고 위치와 기간을 먼저 선택해주세요."
                : "선택하신 위치와 기간을 바탕으로 예상 이용료를 확인할 수 있습니다."
              }
            </p>
          </div>
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
              <BusinessNumberInput
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* 회사 주소 */}
        <div className={styles["form-group"]}>
          <label htmlFor="address">회사 주소</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              readOnly
              className={styles["input-field"]}
              placeholder="주소 검색 버튼을 눌러주세요"
            />
            <button
              type="button"
              className={styles["search-button"]}
              onClick={() => setIsPostcodeOpen(true)}
            >
              주소 검색
            </button>
          </div>
          {isPostcodeOpen && (
            <div className={styles["postcode-modal"]}>
              <DaumPostcode
                onComplete={handleAddressComplete}
                autoClose={false}
                animation
              />
              <button
                type="button"
                onClick={() => setIsPostcodeOpen(false)}
                className={styles["close-modal"]}
              >
                닫기
              </button>
            </div>
          )}
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
              <PhoneInput
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
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
            placeholder="예: hello@myce.com"
            required
          />
        </div>

        {/* 버튼 그룹 */}
        <div className={styles["button-group"]}>
          <button
            type="button"
            className={styles["cancel-button"]}
            onClick={() => navigate("/")}
          >
            취소
          </button>
          <button
            type="submit"
            className={`${styles["submit-button"]} ${!(isFormValid && isPeriodValid) ? styles["disabled"] : ""}`}
            disabled={!(isFormValid && isPeriodValid)}
          >
            등록
          </button>
        </div>
      </form>

      {/* 예상 이용료 모달 */}
      <EstimatedAdCostModal
        isOpen={showEstimatedCostModal}
        onClose={handleCloseEstimatedCostModal}
        displayStartDate={formData.displayStartDate}
        displayEndDate={formData.displayEndDate}
        selectedPositionId={formData.adPositionId}
      />
    </div>
  );
};

export default AdForm;

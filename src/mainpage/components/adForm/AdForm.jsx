import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      alert(t('mainpage.adForm.messages.selectPositionFirst'));
      return;
    }
    
    if (!formData.displayStartDate || !formData.displayEndDate) {
      alert(t('mainpage.adForm.messages.enterPeriodFirst'));
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
        setErrorMessage(t('mainpage.adForm.messages.startDateAfterEndDate'));
        return;
      }else if(formData.displayStartDate < localeDate) {
        setIsFormValid(false);
        setErrorMessage(t('mainpage.adForm.messages.startDateAfterToday'));
        return;
      }else if(formData.displayEndDate < localeDate) {
        setIsFormValid(false);
        setErrorMessage(t('mainpage.adForm.messages.endDateAfterToday'));
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
        setErrorMessage(t('mainpage.adForm.messages.invalidDate')); // 유효하지 않은 날짜일 때 오류 메시지 표시
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
        setErrorMessage(t('mainpage.adForm.messages.invalidDate')); // 다른 오류 발생 시 기본 오류 메시지 설정
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
    alert(t('mainpage.adForm.messages.imageUploadFailed'));
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
      alert(t('mainpage.adForm.messages.adRegistered'));
      navigate("/mypage/ads-status");
    } catch (error) {
      alert(t('mainpage.adForm.messages.adRegistrationFailed'));
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className={styles["form-container"]}>
      <form onSubmit={handleSubmit}>
        <h1 className={styles["title"]}>{t('mainpage.adForm.title')}</h1>
        <p className={styles["subtitle"]}>{t('mainpage.adForm.subtitle')}</p>
        
        {/* 주의사항 및 요금제 안내 */}
        <UsageGuidelines type="ad" />
        <PricingInfo type="ad" />

        {/* 광고명 */}
        <div className={styles["form-group"]}>
          <label htmlFor="title">{t('mainpage.adForm.fields.adTitle')}</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder={t('mainpage.adForm.fields.adTitlePlaceholder')}
            required
          />
        </div>

        {/* 광고 배너 위치 */}
        <div className={styles["form-group"]}>
          <label htmlFor="adPositionId">{t('mainpage.adForm.fields.adPosition')}</label>
          <select
            id="adPositionId"
            name="adPositionId"
            value={formData.adPositionId}
            onChange={handleChange}
            className={styles["select-field"]}
            required
          >
            <option value="" disabled>
              {t('mainpage.adForm.fields.adPositionPlaceholder')}
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
          <label>{t('mainpage.adForm.fields.adPeriod')}</label>
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
              {t('mainpage.adForm.buttons.estimatedCost')}
            </button>
            <p className={styles["estimated-cost-description"]}>
              {!formData.adPositionId || !formData.displayStartDate || !formData.displayEndDate
                ? t('mainpage.adForm.messages.selectPositionAndPeriod')
                : t('mainpage.adForm.messages.estimatedCostDescription')
              }
            </p>
          </div>
        </div>

        {/* 광고 이미지 (S3 업로드) */}
        <div className={styles["form-group"]}>
          <label>{t('mainpage.adForm.fields.adImage')}</label>
          <ImageUpload
            onUploadSuccess={handleImageUploadSuccess}
            onUploadError={handleImageUploadError}
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt={t('mainpage.adForm.fields.adImageAlt')}
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
          <label htmlFor="linkUrl">{t('mainpage.adForm.fields.linkUrl')}</label>
          <input
            type="text"
            id="linkUrl"
            name="linkUrl"
            value={formData.linkUrl}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder={t('mainpage.adForm.fields.linkUrlPlaceholder')}
            required
          />
        </div>

        {/* 광고 소개 */}
        <div className={styles["form-group"]}>
          <label htmlFor="description">{t('mainpage.adForm.fields.adDescription')}</label>
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
        <div className={styles["section-title"]}>{t('mainpage.adForm.fields.companyInfo')}</div>
        <div className={styles["form-group"]}>
          <div className={styles["inline-input-group"]}>
            <div className={styles["inline-input-item"]}>
              <label htmlFor="companyName">{t('mainpage.adForm.fields.companyName')}</label>
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
              <label htmlFor="businessRegistrationNumber">{t('mainpage.adForm.fields.businessNumber')}</label>
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
          <label htmlFor="address">{t('mainpage.adForm.fields.companyAddress')}</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              readOnly
              className={styles["input-field"]}
              placeholder={t('mainpage.adForm.fields.companyAddressPlaceholder')}
            />
            <button
              type="button"
              className={styles["search-button"]}
              onClick={() => setIsPostcodeOpen(true)}
            >
              {t('mainpage.adForm.fields.addressSearch')}
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
                {t('mainpage.adForm.fields.addressSearchClose')}
              </button>
            </div>
          )}
        </div>

        {/* 대표자 정보 */}
        <div className={styles["form-group"]}>
          <div className={styles["inline-input-group"]}>
            <div className={styles["inline-input-item"]}>
              <label htmlFor="ceoName">{t('mainpage.adForm.fields.ceoName')}</label>
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
              <label htmlFor="contactPhone">{t('mainpage.adForm.fields.ceoContact')}</label>
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
          <label htmlFor="contactEmail">{t('mainpage.adForm.fields.ceoEmail')}</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className={styles["input-field"]}
            placeholder={t('mainpage.adForm.fields.ceoEmailPlaceholder')}
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
            {t('mainpage.adForm.buttons.cancel')}
          </button>
          <button
            type="submit"
            className={`${styles["submit-button"]} ${!(isFormValid && isPeriodValid) ? styles["disabled"] : ""}`}
            disabled={!(isFormValid && isPeriodValid)}
          >
            {t('mainpage.adForm.buttons.submit')}
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

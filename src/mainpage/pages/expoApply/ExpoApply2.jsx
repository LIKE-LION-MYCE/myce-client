import React, { useState, useEffect } from "react";
import styles from "./ExpoApply2.module.css";
import { saveExpo } from "../../../api/service/user/expoApi";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { getCategories } from "../../../api/service/user/categoryApi";

const ExpoApply2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    maxCapacity: "",
    description: "",
    companyName: "",
    businessNumber: "",
    companyAddress: "",
    representativeName: "",
    representativeContact: "",
    representativeEmail: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]); // 카테고리 선택
  const [isPremiumChecked, setIsPremiumChecked] = useState(false); // 프리미엄 노출 서비스 체크
  const [initialExpoData, setInitialExpoData] = useState(null); // 이전 페이지에서 받아온 데이터
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 주소 검색 팝업
  const [formErrors, setFormErrors] = useState({}); // 입력값별 에러 메시지
  const [categoryOptions, setCategoryOptions] = useState([]); // 카테고리 목록을 동적으로 관리할 상태 추가

  // 모든 폼 입력값 검증 (제출 시/입력 시)
  const validateAll = (data = formData) => {
    const errors = {};

    // 필수값 체크
    if (!data.maxCapacity.trim())
      errors.maxCapacity = "최대 수용 인원을 입력해주세요.";
    if (!/^\d+$/.test(data.maxCapacity.trim()))
      errors.maxCapacity = "숫자만 입력 가능합니다.";
    if (!data.description.trim())
      errors.description = "박람회 상세 소개를 입력해주세요.";
    if (!data.companyName.trim()) errors.companyName = "회사명을 입력해주세요.";
    if (!data.businessNumber.trim())
      errors.businessNumber = "사업자 번호를 입력해주세요.";
    if (!data.companyAddress.trim())
      errors.companyAddress = "회사 주소를 입력해주세요.";
    if (!data.representativeName.trim())
      errors.representativeName = "대표자명을 입력해주세요.";
    if (!data.representativeContact.trim())
      errors.representativeContact = "대표자 연락처를 입력해주세요.";
    if (!data.representativeEmail.trim())
      errors.representativeEmail = "대표자 이메일을 입력해주세요.";

    // 이메일 형식 검사 (간단 버전)
    if (
      data.representativeEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.representativeEmail)
    )
      errors.representativeEmail = "올바른 이메일 형식이 아닙니다.";

    // 카테고리 필수 선택
    if (!selectedCategories.length)
      errors.categoryIds = "카테고리를 1개 이상 선택해주세요.";

    return errors;
  };

  // 주소 선택 시 호출
  const handleAddressComplete = (data) => {
    setFormData((prev) => ({
      ...prev,
      companyAddress: data.address, // 도로명 주소로 저장
    }));
    setIsPostcodeOpen(false);
  };

  useEffect(() => {
    // (이전 페이지 폼 데이터 불러오는 부분은 그대로)
    const storedData = sessionStorage.getItem("expoFormData1");
    if (storedData) {
      const prevData = JSON.parse(storedData);
      setInitialExpoData(prevData);
      console.log("이전 페이지 폼 데이터:", prevData);
    }

    // 카테고리 목록을 API로 불러오기
    getCategories()
      .then((categories) => setCategoryOptions(categories))
      .catch((error) => {
        console.error("카테고리 목록 조회 실패:", error);
        setCategoryOptions([]);
      });
  }, []);

  // 입력값 변경 시 호출
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 유효성 검사
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateAll({ ...formData, [name]: value })[name] || "",
    }));
  };

  // 카테고리 선택 검사
  const handleCategoryChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    if (!selectedCategories.includes(selectedId)) {
      setSelectedCategories([...selectedCategories, selectedId]);
      const newCategories = [...selectedCategories, selectedId];
      setSelectedCategories(newCategories);
      console.log("카테고리 추가됨:", newCategories); // 카테고리 확인
      setFormErrors((prev) => ({
        ...prev,
        categoryIds: "",
      }));
    }
  };

  // 카테고리 x버튼 눌렀을 때
  const handleRemoveCategory = (categoryId) => {
    const nextCategories = selectedCategories.filter((id) => id !== categoryId);
    setSelectedCategories(nextCategories);
    // 카테고리 하나도 안 선택하면
    if (!nextCategories.length) {
      setFormErrors((prev) => ({
        ...prev,
        categoryIds: "카테고리를 1개 이상 선택해주세요.",
      }));
    }
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initialExpoData) {
      alert("이전 페이지 데이터가 없습니다.");
      return;
    }

    const errors = validateAll();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      // 에러가 있으면 제출 막기
      alert("필수 정보를 모두 올바르게 입력해주세요.");
      return;
    }

    // =============== 서버 전송 데이터 구조 ===============
    const requestData = {
      thumbnailUrl: initialExpoData.posterUrl,
      title: initialExpoData.expoName,
      startDate: initialExpoData.startDate,
      endDate: initialExpoData.endDate,
      displayStartDate: initialExpoData.displayStartDate,
      displayEndDate: initialExpoData.displayEndDate,
      location: initialExpoData.location,
      locationDetail: initialExpoData.locationDetail,
      latitude: initialExpoData.latitude,
      longitude: initialExpoData.longitude,
      startTime: initialExpoData.startTime,
      endTime: initialExpoData.endTime,
      maxReserverCount: parseInt(formData.maxCapacity, 10),
      description: formData.description,
      categoryIds: selectedCategories,
      isPremium: isPremiumChecked,
      registrationCompanyRequest: {
        companyName: formData.companyName,
        businessRegistrationNumber: formData.businessNumber,
        address: formData.companyAddress,
        ceoName: formData.representativeName,
        contactPhone: formData.representativeContact,
        contactEmail: formData.representativeEmail,
      },
    };

    console.log("최종 전송 데이터:", requestData);

    try {
      await saveExpo(requestData);
      alert("박람회 등록 완료!");
      navigate("/mypage/expo-status"); // 등록 후 이동할 페이지
    } catch (error) {
      console.error("등록 오류:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles["page-background"]}>
      <div className={styles["form-container"]}>
        <form onSubmit={handleSubmit}>
          {/* ---------------- 최대 수용 인원 ---------------- */}
          <div className={styles["form-group"]}>
            <label htmlFor="maxCapacity">최대 수용 인원</label>
            <input
              type="text"
              id="maxCapacity"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              className={styles["input-field"]}
              placeholder="예: 1000"
            />
            {/* [유효성 검사 추가] */}
            {formErrors.maxCapacity && (
              <p className={styles["error-text"]}>{formErrors.maxCapacity}</p>
            )}
          </div>

          {/* ---------------- 박람회 상세 소개 ---------------- */}
          <div className={styles["form-group"]}>
            <label htmlFor="description">박람회 상세 소개</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles["textarea-field"]}
            ></textarea>
            {/* [유효성 검사 추가] */}
            {formErrors.description && (
              <p className={styles["error-text"]}>{formErrors.description}</p>
            )}
          </div>

          {/* ---------------- 카테고리 선택 ---------------- */}
          <div className={styles["form-group"]}>
            <label htmlFor="category">카테고리</label>
            <select
              id="category"
              className={styles["select-field"]}
              onChange={handleCategoryChange}
              value=""
            >
              <option value="" disabled>
                카테고리를 선택해주세요
              </option>
              {/* 동적 카테고리 옵션 사용 */}
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* 선택된 카테고리 보여주기 */}
            <div className={styles["selected-categories"]}>
              {/* 동적 카테고리 옵션 */}
              {selectedCategories.map((id) => {
                const category = categoryOptions.find((cat) => cat.id === id);
                return (
                  <span key={id} className={styles["category-tag"]}>
                    {category?.name ?? id}
                    <span onClick={() => handleRemoveCategory(id)}> ×</span>
                  </span>
                );
              })}
            </div>
            {/* [유효성 검사 추가] */}
            {formErrors.categoryIds && (
              <p className={styles["error-text"]}>{formErrors.categoryIds}</p>
            )}
          </div>

          {/* ---------------- 프리미엄 토글 ---------------- */}
          <div className={styles["form-group"]}>
            <div className={styles["wrapper"]}>
              <label htmlFor="premium-toggle" className={styles["textLabel"]}>
                프리미엄 상위 노출 서비스 신청
              </label>
              <label className={styles["toggleSwitch"]}>
                <input
                  type="checkbox"
                  id="premium-toggle"
                  checked={isPremiumChecked}
                  onChange={() => setIsPremiumChecked(!isPremiumChecked)}
                  className={styles["toggleInput"]}
                />
                <span className={styles["toggleSlider"]}></span>
              </label>
            </div>
          </div>

          {/* ---------------- 회사 정보 ---------------- */}
          <div className={styles["form-group"]}>
            <label className={styles["company-title"]}>회사 정보</label>
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
                {/* [유효성 검사 추가] */}
                {formErrors.companyName && (
                  <p className={styles["error-text"]}>
                    {formErrors.companyName}
                  </p>
                )}
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
                  placeholder="숫자만 입력하세요"
                />
                {/* [유효성 검사 추가] */}
                {formErrors.businessNumber && (
                  <p className={styles["error-text"]}>
                    {formErrors.businessNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ---------------- 회사 주소 ---------------- */}
          <div className={styles["form-group"]}>
            <label htmlFor="companyAddress">회사 주소</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
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
            {/* [유효성 검사 추가] */}
            {formErrors.companyAddress && (
              <p className={styles["error-text"]}>
                {formErrors.companyAddress}
              </p>
            )}
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

          {/* ---------------- 대표자 정보 ---------------- */}
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
                {/* [유효성 검사 추가] */}
                {formErrors.representativeName && (
                  <p className={styles["error-text"]}>
                    {formErrors.representativeName}
                  </p>
                )}
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
                  placeholder="숫자만 입력하세요"
                />
                {/* [유효성 검사 추가] */}
                {formErrors.representativeContact && (
                  <p className={styles["error-text"]}>
                    {formErrors.representativeContact}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ---------------- 대표자 이메일 ---------------- */}
          <div className={styles["form-group"]}>
            <label htmlFor="representativeEmail">대표자 이메일</label>
            <input
              type="email"
              id="representativeEmail"
              name="representativeEmail"
              value={formData.representativeEmail}
              onChange={handleChange}
              className={styles["input-field"]}
              placeholder="예: hello@myce.com"
            />
            {/* [유효성 검사 추가] */}
            {formErrors.representativeEmail && (
              <p className={styles["error-text"]}>
                {formErrors.representativeEmail}
              </p>
            )}
          </div>

          {/* ---------------- 제출/취소 버튼 ---------------- */}
          <div className={styles["button-group"]}>
            <button
              type="button"
              className={styles["cancel-button"]}
              onClick={() => navigate("/")}
            >
              취소
            </button>
            <button type="submit" className={styles["submit-button"]}>
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpoApply2;

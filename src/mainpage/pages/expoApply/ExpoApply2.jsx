import React, { useState, useEffect } from "react";
import styles from "./ExpoApply2.module.css";
import { registerExpo } from "../../../api/user/expoApi";
import { useNavigate } from "react-router-dom";

// 임시 카테고리 목록 (ID와 이름)
const CATEGORY_OPTIONS = [
  { id: 1, name: "IT" },
  { id: 2, name: "창업" },
  { id: 3, name: "디자인" },
];

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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isPremiumChecked, setIsPremiumChecked] = useState(false);
  const [initialExpoData, setInitialExpoData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("expoFormData1");
    if (storedData) {
      const prevData = JSON.parse(storedData);
      setInitialExpoData(prevData);
      console.log("이전 페이지 폼 데이터:", prevData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    if (!selectedCategories.includes(selectedId)) {
      setSelectedCategories([...selectedCategories, selectedId]);
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initialExpoData) {
      alert("이전 페이지 데이터가 없습니다.");
      return;
    }

    const requestData = {
      memberId: 1, // TODO: 로그인 정보 연동 시 교체
      thumbnailUrl: initialExpoData.posterUrl,
      title: initialExpoData.expoName,
      startDate: initialExpoData.startDate,
      endDate: initialExpoData.endDate,
      displayStartDate: initialExpoData.displayStartDate,
      displayEndDate: initialExpoData.displayEndDate,
      location: initialExpoData.location,
      locationDetail: initialExpoData.locationDetail,
      latitude: 36.3,
      longitude: 171.5,
      startTime: initialExpoData.startTime,
      endTime: initialExpoData.endTime,
      maxReserverCount: parseInt(formData.maxCapacity, 10),
      description: formData.description,
      categoryIds: selectedCategories,
      isPremium: isPremiumChecked,
      expoRegistrationCompanyRequest: {
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
      await registerExpo(requestData);
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
          {/* 최대 수용 인원 */}
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
          </div>

          {/* 상세 소개 */}
          <div className={styles["form-group"]}>
            <label htmlFor="description">박람회 상세 소개</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles["textarea-field"]}
            ></textarea>
          </div>

          {/* 카테고리 */}
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
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className={styles["selected-categories"]}>
              {selectedCategories.map((id) => {
                const category = CATEGORY_OPTIONS.find((cat) => cat.id === id);
                return (
                  <span key={id} className={styles["category-tag"]}>
                    {category?.name ?? id}
                    <span onClick={() => handleRemoveCategory(id)}> ×</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* 프리미엄 토글 */}
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

          {/* 회사 정보 */}
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

          {/* 주소 */}
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

          {/* 이메일 */}
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

          {/* 버튼 */}
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

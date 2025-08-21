import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  FaUserTie,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import styles from "./OperatorSection.module.css";
import {
  getMyBusinessProfile,
  updateMyBusinessProfile,
} from "../../../api/service/expo-admin/operation/operationService";
import OperatorImageUpload from "../operatorImageUpload/OperatorImageUpload";
import ToastSuccess from "../../../common/components/toastSuccess/ToastSuccess";
import ToastFail from "../../../common/components/toastFail/ToastFail";

const FIXED_LOGO_URL = "https://cdn.example.com/placeholder-logo.png";
const HIDE_LOGO_PREVIEW = true;
const DAUM_POSTCODE_URL =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

function OperatorSection() {
  const { expoId } = useParams();

  const [form, setForm] = useState({});
  const [originalForm, setOriginalForm] = useState({});
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");

  const postcodeScriptLoaded = useRef(false);

  const triggerSuccessToast = (message) => {
    setSuccessMessage(message || "성공적으로 처리되었습니다.");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 2000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getMyBusinessProfile(expoId);
        setForm(profileData || {});
        setOriginalForm(profileData || {});
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "프로필 조회 중 오류가 발생했습니다.";
        triggerToastFail(msg);
      }
    };

    const loadDaumPostcode = () => {
      if (postcodeScriptLoaded.current) return;
      if (document.querySelector(`script[src="${DAUM_POSTCODE_URL}"]`)) {
        postcodeScriptLoaded.current = true;
        return;
      }
      const script = document.createElement("script");
      script.src = DAUM_POSTCODE_URL;
      script.async = true;
      script.onload = () => {
        postcodeScriptLoaded.current = true;
      };
      script.onerror = () => {
        triggerToastFail("주소 검색 스크립트 로드에 실패했습니다.");
      };
      document.body.appendChild(script);
    };

    fetchProfile();
    loadDaumPostcode();
  }, [expoId]);

  const runValidation = (data) => {
    const e = {};
    if (!data.companyName?.trim()) e.companyName = "회사명은 필수입니다.";
    else if (data.companyName.length > 100)
      e.companyName = "회사명은 100자 이하여야 합니다.";

    if (!data.ceoName?.trim()) e.ceoName = "대표명은 필수입니다.";
    else if (data.ceoName.length > 20)
      e.ceoName = "대표명은 20자 이하여야 합니다.";

    if (!data.contactEmail?.trim())
      e.contactEmail = "대표 이메일은 필수입니다.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail))
      e.contactEmail = "유효한 이메일 형식이어야 합니다.";
    else if (data.contactEmail.length > 100)
      e.contactEmail = "이메일 길이는 100자 이하여야 합니다.";

    if (!data.contactPhone?.trim())
      e.contactPhone = "대표 연락처는 필수입니다.";
    else if (!/^[0-9-]+$/.test(data.contactPhone))
      e.contactPhone = "연락처는 숫자와 하이픈(-)만 포함해야 합니다.";
    else if (data.contactPhone.length > 13)
      e.contactPhone = "연락처 길이는 13자 이하여야 합니다.";

    if (!data.address?.trim()) e.address = "회사 주소는 필수입니다.";
    else if (data.address.length > 300)
      e.address = "주소는 300자 이하여야 합니다.";

    if (!data.businessRegistrationNumber?.trim())
      e.businessRegistrationNumber = "사업자 번호는 필수입니다.";
    else if (data.businessRegistrationNumber.length > 50)
      e.businessRegistrationNumber = "사업자 번호는 50자 이하여야 합니다.";
    else if (!/^\d{3}-\d{2}-\d{5}$/.test(data.businessRegistrationNumber))
      e.businessRegistrationNumber =
        "사업자 번호 형식이 올바르지 않습니다. (xxx-xx-xxxxx)";

    return e;
  };

  const handleSubmit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const e = runValidation(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      const payload = { ...form, logoUrl: FIXED_LOGO_URL };
      await updateMyBusinessProfile(expoId, payload);
      triggerSuccessToast("운영사 정보가 수정되었습니다.");
      setOriginalForm(payload);
      setForm(payload);
      setIsEditing(false);
    } catch (error) {
      const msg =
        error?.response?.status === 403
          ? "수정 권한이 없습니다."
          : error?.response?.data?.message ||
            error?.message ||
            "수정 중 오류가 발생했습니다.";
      triggerToastFail(msg);
    }
  };

  const handleCancel = () => {
    setForm(originalForm || {});
    setErrors({});
    setIsEditing(false);
  };

  const formatPhoneNumber = (value) => {
    const onlyNums = String(value || "").replace(/[^0-9]/g, "");
    if (onlyNums.startsWith("02")) {
      if (onlyNums.length <= 2) return onlyNums;
      if (onlyNums.length <= 5)
        return onlyNums.replace(/(\d{2})(\d{1,3})/, "$1-$2");
      if (onlyNums.length <= 9)
        return onlyNums.replace(/(\d{2})(\d{3})(\d{1,4})/, "$1-$2-$3");
      return onlyNums.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 6)
      return onlyNums.replace(/(\d{3})(\d{1,3})/, "$1-$2");
    if (onlyNums.length <= 10)
      return onlyNums.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3");
    return onlyNums.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3").slice(0, 13);
  };

  const formatBusinessNumber = (value) => {
    const nums = String(value || "").replace(/\D/g, "");
    if (nums.length <= 3) return nums;
    if (nums.length <= 5) return nums.replace(/(\d{3})(\d{1,2})/, "$1-$2");
    return nums.replace(/(\d{3})(\d{2})(\d{1,5})/, "$1-$2-$3").slice(0, 12);
  };

  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    let newValue = value;
    if (name === "contactPhone") newValue = formatPhoneNumber(value);
    else if (name === "businessRegistrationNumber")
      newValue = formatBusinessNumber(value);
    setForm((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = () => {};

  // 카카오 도로명 주소 검색
  const openAddressSearch = () => {
    if (!isEditing) return;
    if (
      !postcodeScriptLoaded.current ||
      !(window && window.daum && window.daum.Postcode)
    ) {
      triggerToastFail(
        "주소 검색을 아직 사용할 수 없습니다. 잠시 후 다시 시도해 주세요."
      );
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        const roadAddr = data.roadAddress || "";
        setForm((prev) => ({
          ...prev,
          address: roadAddr, // 도로명 주소만 저장
          // postcode: data.zonecode // 필요시 사용
        }));
        setErrors((prev) => ({ ...prev, address: "" }));
      },
    }).open();
  };

  const renderField = (name, label, IconComp) => {
    const val = form[name] ?? "";
    return (
      <>
        <label className={styles.label}>{label}</label>

        {isEditing ? (
          <div className={styles.inputWrap}>
            <input
              className={styles.inputField}
              name={name}
              value={val}
              onChange={handleChange}
              placeholder={`${label} 입력`}
            />
            <IconComp className={styles.icon} />
          </div>
        ) : (
          <div className={styles.readOnlyWrap}>
            <div className={styles.readOnlyBox}>
              <span className={styles.readOnlyText}>{val || "-"}</span>
            </div>
            <IconComp className={styles.icon} />
          </div>
        )}

        {isEditing && errors[name] && (
          <p className={styles.errorText}>{errors[name]}</p>
        )}
      </>
    );
  };

  // 주소 전용 렌더 (도로명 주소 input 클릭 시 팝업)
  const renderAddressField = () => {
    const addr = form.address ?? "";
    return (
      <>
        <label className={styles.label}>주소</label>

        {isEditing ? (
          <div className={styles.inputWrap}>
            <input
              className={styles.inputField}
              name="address"
              value={addr}
              placeholder="도로명 주소를 검색해 주세요"
              readOnly
              onClick={openAddressSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openAddressSearch();
                }
              }}
              title="클릭하여 도로명 주소를 검색"
              style={{ cursor: "pointer" }}
              autoComplete="off"
            />
            <FaMapMarkerAlt className={styles.icon} />
          </div>
        ) : (
          <div className={styles.readOnlyWrap}>
            <div className={styles.readOnlyBox}>
              <span className={styles.readOnlyText}>{addr || "-"}</span>
            </div>
            <FaMapMarkerAlt className={styles.icon} />
          </div>
        )}

        {errors.address && <p className={styles.errorText}>{errors.address}</p>}
      </>
    );
  };

  return (
    <div className={styles.container}>
      {!HIDE_LOGO_PREVIEW && (
        <OperatorImageUpload
          onUploadSuccess={handleImageUpload}
          onUploadError={(msg) => triggerToastFail(msg)}
          initialImageUrl={form.logoUrl}
        />
      )}

      <div className={styles.formGrid}>
        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField("companyName", "회사명", FaUserTie)}
        </div>

        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField("ceoName", "대표명", FaUserFriends)}
        </div>

        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField("contactEmail", "이메일", FaEnvelope)}
        </div>

        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField("contactPhone", "연락처", FaPhone)}
        </div>

        <div className={`${styles.formGroup} ${styles.full}`}>
          {renderAddressField()}
        </div>

        <div className={`${styles.formGroup} ${styles.half}`}>
          {renderField("businessRegistrationNumber", "사업자번호", FaBuilding)}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        {!isEditing ? (
          <button
            className={`${styles.actionBtn} ${styles.submitBtn}`}
            onClick={handleSubmit}
          >
            <FaEdit className={styles.iconBtn} /> 수정
          </button>
        ) : (
          <>
            <button
              className={`${styles.actionBtn} ${styles.submitBtn}`}
              onClick={handleSubmit}
            >
              <FaCheckCircle className={styles.iconBtn} /> 저장
            </button>
            <button
              className={`${styles.actionBtn} ${styles.cancelBtn}`}
              onClick={handleCancel}
            >
              <FaTimesCircle className={styles.iconBtn} /> 취소
            </button>
          </>
        )}
      </div>

      {showSuccessToast && <ToastSuccess message={successMessage} />}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default OperatorSection;

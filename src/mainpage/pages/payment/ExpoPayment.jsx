import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./ExpoPayment.module.css";
import ReservationPaymentCardButton from "../../components/paymentButton/ReservationPaymentCardButton";
import PaymentVirtualBankButton from "../../components/paymentButton/PaymentVirtualBankButton";
import PaymentTransferButton from "../../components/paymentButton/PaymentTransferButton";
import { isTokenExpired } from "../../../api/utils/jwtUtils";
import { getMyInfo, getMyMileage } from "../../../api/service/user/memberApi";
import { getExpoBasicInfo } from "../../../api/service/expo/expoDetailApi";
import { getPaymentSummary } from "../../../api/service/reservation/reservationApi";
import PhoneInput from "../../../common/components/phoneInput/PhoneInput";
import DateInput from "../../../common/components/dateInput/DateInput";
import PaymentSpinner from "../../../common/components/spinner/PaymentSpinner";

export default function ExpoPayment() {
  const { t } = useTranslation();
  const SERVICE_FEE_PER_TICKET = 1000;
  const TARGET_TYPE = "RESERVATION";
  const { expoId } = useParams();
  const [searchParams] = useSearchParams();

  const reservationId = searchParams.get("preReservationId");
  const sessionId = searchParams.get("sessionId");

  const [paymentSummary, setPaymentSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const {
    ticketId,
    ticketName,
    ticketQuantity: quantity = 1,
    ticketPrice: unitPrice = 0,
  } = paymentSummary || {};

  useEffect(() => {
    const fetchPaymentSummary = async () => {
      if (!reservationId) {
        setError(
          t(
            "expoDetail.expoPayment.errors.reservationNotFound",
            "예약 정보를 찾을 수 없습니다."
          )
        );
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getPaymentSummary(reservationId, sessionId);
        setPaymentSummary(data);
        setError(null);
      } catch (err) {
        console.error("결제 요약 정보 로드 실패:", err);
        setError(
          err.response?.data?.message ||
            t(
              "expoDetail.expoPayment.errors.paymentInfoLoadFailed",
              "결제 정보를 불러오지 못했습니다."
            )
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentSummary();
  }, [reservationId, sessionId]);

  const [expoInfo, setExpoInfo] = useState(null);
  const [personalInfo, setPersonalInfo] = useState([]);

  const reserverInfos = useMemo(
    () =>
      personalInfo.map(({ name, email, birthdate, phone, gender }) => ({
        name,
        email,
        birth: birthdate || "",
        phone,
        gender: gender ? gender.toUpperCase() : null,
      })),
    [personalInfo]
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mileage, setMileage] = useState(null);
  const [mileageError, setMileageError] = useState(null);
  const [usedMileageInput, setUsedMileageInput] = useState("");
  const [appliedMileage, setAppliedMileage] = useState(0);
  const [mileageRate, setMileageRate] = useState(0.01);

  const baseTotal = useMemo(() => {
    const price = Number(unitPrice) || 0;
    const numQuantity = Number(quantity) || 0;
    return numQuantity * price + numQuantity * SERVICE_FEE_PER_TICKET;
  }, [quantity, unitPrice]);

  const maxUsableMileage = useMemo(() => {
    return Math.min(mileage ?? 0, baseTotal);
  }, [mileage, baseTotal]);

  const totalAfterApply = useMemo(() => {
    return Math.max(0, baseTotal - appliedMileage);
  }, [baseTotal, appliedMileage]);

  const remainingMileageAfterApply = useMemo(() => {
    if (mileage === null) return null;
    return Math.max(0, (mileage || 0) - appliedMileage);
  }, [mileage, appliedMileage]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const tokenExpired = isTokenExpired(token);
    setIsLoggedIn(!!(token && !tokenExpired));

    if (quantity > 0) {
      setPersonalInfo(
        Array.from({ length: quantity }).map(() => ({
          name: "",
          email: "",
          birthdate: "",
          phone: "",
          gender: "",
          rememberInfo: false,
        }))
      );
    }

    const loadExpoInfo = async () => {
      if (expoId) {
        try {
          const basicInfo = await getExpoBasicInfo(expoId);
          setExpoInfo(basicInfo);
        } catch (error) {
          console.error("박람회 정보 로드 실패:", error);
        }
      }
    };

    loadExpoInfo();
  }, [quantity, expoId]);

  useEffect(() => {
    const fetchMileage = async () => {
      if (!isLoggedIn) {
        setMileage(null);
        setAppliedMileage(0);
        setUsedMileageInput("");
        return;
      }
      try {
        setMileageError(null);
        const res = await getMyMileage();
        const value = typeof res === "number" ? res : res?.data;
        const parsed = Number(value) || 0;
        setMileage(parsed);

        const maxUse = Math.min(parsed, baseTotal);
        if (appliedMileage > maxUse) {
          setAppliedMileage(maxUse);
        }
      } catch (e) {
        console.error("보유 마일리지 조회 실패:", e);
        setMileage(0);
        setAppliedMileage(0);
        setUsedMileageInput("");
        setMileageError(
          e?.response?.data?.message ||
            t(
              "expoDetail.expoPayment.mileage.loadFailed",
              "보유 마일리지를 불러오지 못했습니다."
            )
        );
      }
    };
    fetchMileage();
  }, [isLoggedIn, baseTotal]);

  useEffect(() => {
    const maxUse = Math.min(mileage ?? 0, baseTotal);
    if (appliedMileage > maxUse) {
      setAppliedMileage(maxUse);
    }
  }, [mileage, baseTotal, appliedMileage]);

  const handlePersonalInfoChange = (index, field, value) => {
    setPersonalInfo((prevInfo) => {
      const newInfo = [...prevInfo];
      newInfo[index] = { ...newInfo[index], [field]: value };
      return newInfo;
    });
  };

  const loadMemberInfo = async () => {
    const token = localStorage.getItem("access_token");
    if (token && !isTokenExpired(token)) {
      try {
        const response = await getMyInfo();
        const userInfo = response.data;

        if (userInfo) {
          setPersonalInfo((prevInfo) => {
            const newInfo = [...prevInfo];
            newInfo[0] = {
              ...newInfo[0],
              name: userInfo.name || "",
              email: userInfo.email || "",
              birthdate: userInfo.birth || "",
              phone: userInfo.phone || "",
              gender: userInfo.gender?.toLowerCase() || "",
            };
            return newInfo;
          });
          setMileageRate(userInfo?.mileageRate || 0.01);
          alert(
            t(
              "expoDetail.expoPayment.alerts.memberInfoLoaded",
              "회원 정보가 불러와졌습니다."
            )
          );
        } else {
          alert(
            t(
              "expoDetail.expoPayment.alerts.memberInfoLoadFailed",
              "회원 정보를 불러오는데 실패했습니다. (데이터 없음)"
            )
          );
        }
      } catch (error) {
        console.error("회원 정보 불러오기 API 호출 실패:", error);
        alert(
          t(
            "expoDetail.expoPayment.alerts.memberInfoLoadError",
            "회원 정보를 불러오는데 실패했습니다. 오류: {{error}}",
            { error: error.response?.data?.message || error.message }
          )
        );
      }
    } else {
      alert(
        t(
          "expoDetail.expoPayment.alerts.loginRequired",
          "로그인 상태가 아닙니다."
        )
      );
    }
  };

  const handleUseAllMileage = () => {
    if (!isLoggedIn || mileage === null) return;
    const maxUse = Math.min(mileage || 0, baseTotal);
    setUsedMileageInput(String(maxUse));
  };

  const handleApplyMileage = () => {
    if (!isLoggedIn) {
      setMileageError(
        t(
          "expoDetail.expoPayment.mileage.loginRequired",
          "로그인 후 이용 가능합니다."
        )
      );
      return;
    }
    if (mileage === null) {
      setMileageError(
        t(
          "expoDetail.expoPayment.mileage.loadingError",
          "보유 마일리지 조회 중입니다. 잠시 후 다시 시도해주세요."
        )
      );
      return;
    }
    const raw = Number(usedMileageInput);
    if (!Number.isFinite(raw) || raw < 0) {
      setMileageError(
        t(
          "expoDetail.expoPayment.mileage.validNumberRequired",
          "사용할 마일리지는 0 이상의 숫자여야 합니다."
        )
      );
      return;
    }
    const rounded = Math.floor(raw);
    const maxUse = Math.min(mileage, baseTotal);
    if (rounded > maxUse) {
      setMileageError(
        t(
          "expoDetail.expoPayment.mileage.maxUsageExceeded",
          "최대 {{maxUse}} M 까지 사용할 수 있습니다.",
          { maxUse: maxUse.toLocaleString() }
        )
      );
      setAppliedMileage(maxUse);
      setUsedMileageInput(String(maxUse));
      return;
    }
    setMileageError(null);
    setAppliedMileage(rounded);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>
          {t("expoDetail.expoPayment.loading", "결제 정보를 불러오는 중...")}
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.errorText}>
          {t("expoDetail.expoPayment.error", "오류: {{error}}", { error })}
        </h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {paymentProcessing && <PaymentSpinner />}
      {/* 왼쪽 개인 정보 입력 */}
      <section className={styles.leftSection}>
        <form className={styles.form}>
          {Array.from({ length: quantity }).map((_, index) => (
            <div key={index} className={styles.personInfoCard}>
              <div className={styles.cardHeader}>
                <h2>
                  {t(
                    "expoDetail.expoPayment.personalInfo.title",
                    "개인정보 입력"
                  )}{" "}
                  {quantity > 1 ? `${index + 1}` : ""}
                </h2>
                {index === 0 && isLoggedIn && (
                  <button
                    type="button"
                    onClick={loadMemberInfo}
                    className={styles.loadMemberInfoButton}
                  >
                    {t(
                      "expoDetail.expoPayment.personalInfo.loadMemberInfo",
                      "회원 정보 불러오기"
                    )}
                  </button>
                )}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.inputGrid}>
                  <div className={styles.inputField}>
                    <label htmlFor={`name-${index}`}>
                      {t("expoDetail.expoPayment.personalInfo.name", "이름")}
                    </label>
                    <input
                      type="text"
                      id={`name-${index}`}
                      value={personalInfo[index]?.name || ""}
                      onChange={(e) =>
                        handlePersonalInfoChange(index, "name", e.target.value)
                      }
                      placeholder={t(
                        "expoDetail.expoPayment.personalInfo.namePlaceholder",
                        "이름을 입력하세요"
                      )}
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor={`email-${index}`}>
                      {t(
                        "expoDetail.expoPayment.personalInfo.email",
                        "이메일 주소"
                      )}
                    </label>
                    <input
                      type="email"
                      id={`email-${index}`}
                      value={personalInfo[index]?.email || ""}
                      onChange={(e) =>
                        handlePersonalInfoChange(index, "email", e.target.value)
                      }
                      placeholder={t(
                        "expoDetail.expoPayment.personalInfo.emailPlaceholder",
                        "example@email.com"
                      )}
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor={`birthdate-${index}`}>
                      {t(
                        "expoDetail.expoPayment.personalInfo.birthdate",
                        "생년월일"
                      )}
                    </label>
                    <DateInput
                      name={`birthdate-${index}`}
                      value={personalInfo[index]?.birthdate || ""}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          index,
                          "birthdate",
                          e.target.value
                        )
                      }
                      format="YYYY-MM-DD"
                      required
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor={`phone-${index}`}>
                      {t(
                        "expoDetail.expoPayment.personalInfo.phone",
                        "전화번호"
                      )}
                    </label>
                    <PhoneInput
                      name={`phone-${index}`}
                      value={personalInfo[index]?.phone || ""}
                      onChange={(e) =>
                        handlePersonalInfoChange(index, "phone", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className={styles.genderSelection}>
                  <label>
                    {t("expoDetail.expoPayment.personalInfo.gender", "성별")}
                  </label>
                  <div className={styles.genderOptions}>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name={`gender-${index}`}
                        value="male"
                        checked={personalInfo[index]?.gender === "male"}
                        onChange={(e) =>
                          handlePersonalInfoChange(
                            index,
                            "gender",
                            e.target.value
                          )
                        }
                      />
                      {t("expoDetail.expoPayment.personalInfo.male", "남자")}
                    </label>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name={`gender-${index}`}
                        value="female"
                        checked={personalInfo[index]?.gender === "female"}
                        onChange={(e) =>
                          handlePersonalInfoChange(
                            index,
                            "gender",
                            e.target.value
                          )
                        }
                      />
                      {t("expoDetail.expoPayment.personalInfo.female", "여자")}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </form>
      </section>

      {/* 오른쪽 결제 정보 영역 */}
      <section className={styles.rightSection}>
        <div className={styles.thumbnailBox}>
          <img
            src={
              expoInfo?.thumbnailUrl ||
              "https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg"
            }
            alt={
              expoInfo?.title ||
              t("expoDetail.expoPayment.expoInfo.eventTitle", "행사 제목")
            }
            className={styles.thumbnail}
            onError={(e) => {
              e.target.src =
                "https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg";
            }}
          />
          <div className={styles.details}>
            <h3 className={styles.expoTitle}>
              {expoInfo?.title || "로딩 중..."}
            </h3>
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="currentColor"
                    />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <div className={styles.infoMain}>
                    {expoInfo?.location || "장소 정보 없음"}
                  </div>
                  {expoInfo?.locationDetail && (
                    <div className={styles.infoSub}>
                      {expoInfo.locationDetail}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="currentColor"
                    />
                    <line
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="6"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <line
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="6"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <line
                      x1="3"
                      y1="10"
                      x2="21"
                      y2="10"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <div className={styles.infoMain}>
                    {expoInfo?.startDate && expoInfo?.endDate
                      ? `${new Date(expoInfo.startDate).toLocaleDateString(
                          "ko-KR"
                        )} ~ ${new Date(expoInfo.endDate).toLocaleDateString(
                          "ko-KR"
                        )}`
                      : "일정 정보 없음"}
                  </div>
                  {expoInfo?.startTime && expoInfo?.endTime && (
                    <div className={styles.infoSub}>
                      {expoInfo.startTime.substring(0, 5)} ~{" "}
                      {expoInfo.endTime.substring(0, 5)}
                    </div>
                  )}
                </div>
              </div>

              {expoInfo?.categories && expoInfo.categories.length > 0 && (
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <svg
                      className={styles.icon}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="currentColor"
                      />
                      <line
                        x1="7"
                        y1="7"
                        x2="7.01"
                        y2="7"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <div className={styles.categories}>
                      {expoInfo.categories.map((category, index) => (
                        <span key={index} className={styles.categoryTag}>
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoggedIn && (
          <div className={styles.mileageSection}>
            <div className={styles.mileageHeader}>
              <h2>{t("expoDetail.expoPayment.mileage.title", "마일리지")}</h2>
              <div className={styles.currentMileage}>
                <span>
                  {t(
                    "expoDetail.expoPayment.mileage.available",
                    "보유 마일리지"
                  )}
                </span>
                <strong>
                  {mileage === null
                    ? t(
                        "expoDetail.expoPayment.mileage.loading",
                        "불러오는 중..."
                      )
                    : `${mileage.toLocaleString()} M`}
                </strong>
              </div>
            </div>

            <div className={styles.mileageControls}>
              <div className={styles.mileageInputContainer}>
                <input
                  type="number"
                  placeholder={t(
                    "expoDetail.expoPayment.mileage.usagePlaceholder",
                    "사용할 마일리지"
                  )}
                  className={styles.mileageInput}
                  value={usedMileageInput}
                  onChange={(e) => setUsedMileageInput(e.target.value)}
                  min={0}
                />
                <button
                  type="button"
                  className={styles.useAllButton}
                  onClick={handleUseAllMileage}
                >
                  {t("expoDetail.expoPayment.mileage.useAll", "전액사용")}
                </button>
              </div>
              <button
                type="button"
                className={styles.applyMileageButton}
                onClick={handleApplyMileage}
                disabled={mileage === null || (mileage || 0) === 0}
              >
                {t("expoDetail.expoPayment.mileage.apply", "마일리지 적용")}
              </button>
            </div>

            <div className={styles.mileageFooter}>
              {mileageError ? (
                <div className={styles.errorText}>{mileageError}</div>
              ) : (
                <div className={styles.remainingMileage}>
                  <span>
                    {t(
                      "expoDetail.expoPayment.mileage.afterApply",
                      "적용 후 마일리지"
                    )}
                  </span>
                  <strong>
                    {remainingMileageAfterApply === null
                      ? "-"
                      : `${remainingMileageAfterApply.toLocaleString()} M`}
                  </strong>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.summary}>
          <h3>{t("expoDetail.expoPayment.summary.title", "결제 요약")}</h3>
          <div className={styles.reciept}>
            <div className={styles.row}>
              <span>
                {t("expoDetail.expoPayment.summary.ticketCount", "티켓 매수")}
              </span>
              <span>
                {quantity} x {ticketName}
              </span>
            </div>
            <div className={styles.row}>
              <span>
                {t("expoDetail.expoPayment.summary.ticketPrice", "티켓 가격")}
              </span>
              <span>
                {quantity} x {unitPrice?.toLocaleString()}
                {t("expoDetail.expoPayment.summary.currency", "원")}
              </span>
            </div>
            <div className={styles.row}>
              <span>
                {t(
                  "expoDetail.expoPayment.summary.serviceFee",
                  "서비스 수수료"
                )}
              </span>
              <span>
                {quantity} x {SERVICE_FEE_PER_TICKET.toLocaleString()}
              </span>
            </div>
            <div className={styles.row}>
              <span>
                {t("expoDetail.expoPayment.summary.mileage", "마일리지")}
              </span>
              <span>
                - {appliedMileage.toLocaleString()}
                {t("expoDetail.expoPayment.summary.currency", "원")}
              </span>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <span>{t("expoDetail.expoPayment.summary.total", "총계")}</span>
              <span>
                {totalAfterApply.toLocaleString()}
                {t("expoDetail.expoPayment.summary.currency", "원")}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.payment}>
          <h3>
            {t("expoDetail.expoPayment.paymentMethod.title", "결제 방법 선택")}
          </h3>

          <div className={styles.methodGroup}>
            <ReservationPaymentCardButton
              targetType={TARGET_TYPE}
              expoId={expoId}
              ticketId={ticketId}
              quantity={quantity}
              name={ticketName}
              amount={totalAfterApply}
              usedMileage={appliedMileage}
              savedMileage={Math.floor(totalAfterApply * mileageRate)}
              reserverInfos={reserverInfos}
              sessionId={sessionId}
              onPaymentStart={() => setPaymentProcessing(true)}
              onPaymentEnd={() => setPaymentProcessing(false)}
            />
            <PaymentVirtualBankButton
              targetType={TARGET_TYPE}
              expoId={expoId}
              ticketId={ticketId}
              quantity={quantity}
              name={ticketName}
              amount={totalAfterApply}
              usedMileage={appliedMileage}
              savedMileage={Math.floor(totalAfterApply * mileageRate)}
              reserverInfos={reserverInfos}
              sessionId={sessionId}
              onPaymentStart={() => setPaymentProcessing(true)}
              onPaymentEnd={() => setPaymentProcessing(false)}
            />
            <PaymentTransferButton
              targetType={TARGET_TYPE}
              expoId={expoId}
              ticketId={ticketId}
              quantity={quantity}
              name={ticketName}
              amount={totalAfterApply}
              usedMileage={appliedMileage}
              savedMileage={Math.floor(totalAfterApply * mileageRate)}
              reserverInfos={reserverInfos}
              sessionId={sessionId}
              onPaymentStart={() => setPaymentProcessing(true)}
              onPaymentEnd={() => setPaymentProcessing(false)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

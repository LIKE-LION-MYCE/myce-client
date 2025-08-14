import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import styles from "./ExpoPayment.module.css";
import ReservationPaymentCardButton from "../../components/paymentButton/ReservationPaymentCardButton"; // 카드 결제 버튼
import PaymentVirtualBankButton from "../../components/paymentButton/PaymentVirtualBankButton"; // 가상계좌 버튼
import PaymentTransferButton from "../../components/paymentButton/PaymentTransferButton";
import { isTokenExpired } from "../../../api/utils/jwtUtils";
import { getMyInfo, getMyMileage } from "../../../api/service/user/memberApi";
import { getExpoBasicInfo } from "../../../api/service/expo/expoDetailApi";

export default function ExpoPayment() {
  const SERVICE_FEE_PER_TICKET = 1000;
  const TARGET_TYPE = "RESERVATION";
  const { expoId } = useParams();
  const [searchParams] = useSearchParams();
  
  // URL 파라미터에서 결제 정보 추출
  const reservationId = searchParams.get('reservationId');
  const ticketId = searchParams.get('ticketId');
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const totalPrice = parseInt(searchParams.get('totalPrice') || '0');
  const unitPrice = Math.floor(totalPrice / quantity); // 단가 계산
  const ticketName = decodeURIComponent(searchParams.get('ticketName') || '티켓');
  
  // 박람회 정보 상태
  const [expoInfo, setExpoInfo] = useState(null);

  const [personalInfo, setPersonalInfo] = useState(
    Array.from({ length: quantity }).map(() => ({
      name: "",
      email: "",
      birthdate: "",
      phone: "",
      gender: "",
      rememberInfo: false,
    }))
  );

  // personalInfo -> reserverInfos로 매핑 (서버 DTO 형태 맞춤)
  const reserverInfos = useMemo(
    () =>
      personalInfo.map(({ name, email, birthdate, phone, gender }) => ({
        name,
        email,
        // 서버가 LocalDate 'birth' 를 기대한다면 키를 birth로 맞추고 형식도 YYYY-MM-DD 유지
        birth: birthdate || "",
        phone,
        // 서버 enum이 MALE/FEMALE이면 대문자로 변환
        gender: gender ? gender.toUpperCase() : null,
        // rememberInfo는 서버에 필요 없으면 제거(필요하면 포함)
      })),
    [personalInfo]
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mileage, setMileage] = useState(null); // 보유 마일리지 상태
  const [mileageError, setMileageError] = useState(null); // 마일리지 에러 표시용

  // 마일리지 적용 관련 상태
  const [usedMileageInput, setUsedMileageInput] = useState(""); // 입력창 값(문자열 유지)
  const [appliedMileage, setAppliedMileage] = useState(0);

  // 기본 합계/최대 사용 가능 마일리지/적용 후 금액을 계산
  const baseTotal = useMemo(() => {
    const price = Number(unitPrice) || 0;
    return quantity * price + quantity * SERVICE_FEE_PER_TICKET;
  }, [quantity, unitPrice]);

  const maxUsableMileage = useMemo(() => {
    // 결제 금액을 초과해서는 사용 불가
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
    // 로그인 여부 체크
    const token = localStorage.getItem("access_token");
    const tokenExpired = isTokenExpired(token);
    if (token && !tokenExpired) {
      setIsLoggedIn(true);
      console.log("User is logged in.");
    } else {
      setIsLoggedIn(false);
      console.log("User is NOT logged in.");
    }

    setPersonalInfo((prevInfo) => {
      const newInfo = Array.from({ length: quantity }).map((_, index) => {
        return (
          prevInfo[index] || {
            name: "",
            email: "",
            birthdate: "",
            phone: "",
            gender: "",
            rememberInfo: false,
          }
        );
      });
      return newInfo;
    });
    
    // 박람회 정보 로드
    const loadExpoInfo = async () => {
      if (expoId) {
        try {
          const basicInfo = await getExpoBasicInfo(expoId);
          setExpoInfo(basicInfo);
        } catch (error) {
          console.error('박람회 정보 로드 실패:', error);
        }
      }
    };
    
    loadExpoInfo();
  }, [quantity, expoId]);

  // 로그인 시 보유 마일리지 불러오기
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

        // 현재 적용된 마일리지가 보유치/최대 가능치보다 크면 보정
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
          e?.response?.data?.message || "보유 마일리지를 불러오지 못했습니다."
        );
      }
    };
    fetchMileage();
  }, [isLoggedIn, baseTotal]);

  // 수량/가격/보유마일리지 변경 시, 적용 마일리지가 최대 사용 가능치 초과하지 않도록 보정
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

  // 개인 정보 입력칸
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
          alert("회원 정보가 불러와졌습니다.");
        } else {
          alert("회원 정보를 불러오는데 실패했습니다. (데이터 없음)");
        }
      } catch (error) {
        console.error("회원 정보 불러오기 API 호출 실패:", error);
        alert(
          "회원 정보를 불러오는데 실패했습니다. 오류: " +
            (error.response?.data?.message || error.message)
        );
      }
    } else {
      alert("로그인 상태가 아닙니다.");
    }
  };

  // 전액사용 버튼 핸들러
  const handleUseAllMileage = () => {
    if (!isLoggedIn || mileage === null) return;
    const maxUse = Math.min(mileage || 0, baseTotal);
    setUsedMileageInput(String(maxUse));
  };

  // 적용 버튼 핸들러
  const handleApplyMileage = () => {
    if (!isLoggedIn) {
      setMileageError("로그인 후 이용 가능합니다.");
      return;
    }
    if (mileage === null) {
      setMileageError(
        "보유 마일리지 조회 중입니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }
    const raw = Number(usedMileageInput);
    if (!Number.isFinite(raw) || raw < 0) {
      setMileageError("사용할 마일리지는 0 이상의 숫자여야 합니다.");
      return;
    }
    const rounded = Math.floor(raw);
    const maxUse = Math.min(mileage, baseTotal);
    if (rounded > maxUse) {
      setMileageError(
        `최대 ${maxUse.toLocaleString()} M 까지 사용할 수 있습니다.`
      );
      setAppliedMileage(maxUse);
      setUsedMileageInput(String(maxUse));
      return;
    }
    setMileageError(null);
    setAppliedMileage(rounded);
  };

  return (
    <div className={styles.container}>
      {/* 왼쪽 개인 정보 입력 */}
      <section className={styles.leftSection}>
        <form className={styles.form}>
          {Array.from({ length: quantity }).map((_, index) => (
            <div key={index} className={styles.personInfoCard}>
              <div className={styles.cardHeader}>
                <h2>개인정보 입력 {quantity > 1 ? `${index + 1}` : ""}</h2>
                {index === 0 && isLoggedIn && (
                  <button
                    type="button"
                    onClick={loadMemberInfo}
                    className={styles.loadMemberInfoButton}
                  >
                    회원 정보 불러오기
                  </button>
                )}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.inputGrid}>
                  <div className={styles.inputField}>
                    <label htmlFor={`name-${index}`}>이름</label>
                    <input
                      type="text"
                      id={`name-${index}`}
                      value={personalInfo[index].name}
                      onChange={(e) =>
                        handlePersonalInfoChange(index, "name", e.target.value)
                      }
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor={`email-${index}`}>이메일 주소</label>
                    <input
                      type="email"
                      id={`email-${index}`}
                      value={personalInfo[index].email}
                      onChange={(e) =>
                        handlePersonalInfoChange(index, "email", e.target.value)
                      }
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor={`birthdate-${index}`}>생년월일</label>
                    <input
                      type="text"
                      id={`birthdate-${index}`}
                      value={personalInfo[index].birthdate}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          index,
                          "birthdate",
                          e.target.value
                        )
                      }
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor={`phone-${index}`}>전화번호</label>
                    <input
                      type="tel"
                      id={`phone-${index}`}
                      value={personalInfo[index].phone}
                      onChange={(e) =>
                        handlePersonalInfoChange(index, "phone", e.target.value)
                      }
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>

                <div className={styles.genderSelection}>
                  <label>성별</label>
                  <div className={styles.genderOptions}>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name={`gender-${index}`}
                        value="male"
                        checked={personalInfo[index].gender === "male"}
                        onChange={(e) =>
                          handlePersonalInfoChange(
                            index,
                            "gender",
                            e.target.value
                          )
                        }
                      />
                      남자
                    </label>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name={`gender-${index}`}
                        value="female"
                        checked={personalInfo[index].gender === "female"}
                        onChange={(e) =>
                          handlePersonalInfoChange(
                            index,
                            "gender",
                            e.target.value
                          )
                        }
                      />
                      여자
                    </label>
                  </div>
                </div>
              </div>
              {index < quantity - 1 && <hr className={styles.divider} />}{" "}
            </div>
          ))}
        </form>
      </section>

      {/* 오른쪽 결제 정보 영역 */}
      <section className={styles.rightSection}>
        <div className={styles.thumbnailBox}>
          <div className={styles.details}>
            <h3>{expoInfo?.title || '로딩 중...'}</h3>
            <div className={styles.info}>
              <p>📍 {expoInfo?.location || '장소 정보 없음'}</p>
              <p>🗓 {expoInfo?.startDate && expoInfo?.endDate ? 
                  `${new Date(expoInfo.startDate).toLocaleDateString('ko-KR')} ~ ${new Date(expoInfo.endDate).toLocaleDateString('ko-KR')}` 
                  : '일정 정보 없음'}</p>
            </div>
          </div>
          <img
            src={expoInfo?.thumbnailUrl || "https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg"}
            alt={expoInfo?.title || "행사 제목"}
            className={styles.thumbnail}
            onError={(e) => {
              e.target.src = 'https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg';
            }}
          />
        </div>

        {isLoggedIn && (
          <div className={styles.mileageSection}>
            <div className={styles.mileageHeader}>
              <h2>마일리지</h2>
              <div className={styles.currentMileage}>
                <span>보유 마일리지</span>
                <strong>
                  {/* 보유 마일리지 표시 */}
                  {mileage === null
                    ? "불러오는 중..."
                    : `${mileage.toLocaleString()} M`}
                </strong>
              </div>
            </div>

            <div className={styles.mileageControls}>
              <div className={styles.mileageInputContainer}>
                {/* 입력 상태와 연결 */}
                <input
                  type="number"
                  placeholder="사용할 마일리지"
                  className={styles.mileageInput}
                  value={usedMileageInput}
                  onChange={(e) => setUsedMileageInput(e.target.value)}
                  min={0}
                />
                {/* 전액사용 핸들러 연결 */}
                <button
                  type="button"
                  className={styles.useAllButton}
                  onClick={handleUseAllMileage}
                >
                  전액사용
                </button>
              </div>
              {/* 적용 버튼 핸들러 연결 */}
              <button
                type="button"
                className={styles.applyMileageButton}
                onClick={handleApplyMileage}
                disabled={mileage === null || (mileage || 0) === 0}
              >
                마일리지 적용
              </button>
            </div>

            <div className={styles.mileageFooter}>
              {/* 에러 문구 또는 적용 후 마일리지 동적 표시 */}
              {mileageError ? (
                <div className={styles.errorText}>{mileageError}</div>
              ) : (
                <div className={styles.remainingMileage}>
                  <span>적용 후 마일리지</span>
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
          <h3>결제 요약</h3>
          <div className={styles.reciept}>
            <div className={styles.row}>
              <span>티켓 매수</span>
              <span>
                {quantity} x {ticketName}
              </span>
            </div>
            <div className={styles.row}>
              <span>티켓 가격</span>
              <span>
                {quantity} x {unitPrice?.toLocaleString()}원
              </span>
            </div>
            <div className={styles.row}>
              <span>서비스 수수료</span>
              <span>
                {quantity} x {SERVICE_FEE_PER_TICKET}
              </span>
            </div>
            <div className={styles.row}>
              <span>마일리지</span>
              {/* 적용된 마일리지 금액 차감 표시 */}
              <span>- {appliedMileage.toLocaleString()}원</span>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <span>총계</span>
              {/* 적용 후 총액 표시 */}
              <span>{totalAfterApply.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <div className={styles.payment}>
          <h3>결제 방법 선택</h3>

          <div className={styles.methodGroup}>
            {/* 결제 금액에 적용 후 총액을 전달 */}
            <ReservationPaymentCardButton
              targetType={TARGET_TYPE}
              expoId={expoId}
              ticketId={ticketId}
              quantity={quantity}
              name={ticketName}
              amount={totalAfterApply}
              buyerName={personalInfo[0]?.name}
              buyerEmail={personalInfo[0]?.email}
              buyerTel={personalInfo[0]?.phone}
              usedMileage={usedMileageInput}
              savedMileage={totalAfterApply * 0.03} // 일단 결제 금액의 3퍼로 설정
              reserverInfos={reserverInfos}
            />
            <PaymentVirtualBankButton
              amount={totalAfterApply}
              name={ticketName}
              buyerName={personalInfo[0]?.name}
              buyerEmail={personalInfo[0]?.email}
              buyerTel={personalInfo[0]?.phone}
              savedMileage={remainingMileageAfterApply}
            />
            <PaymentTransferButton
              amount={totalAfterApply}
              name={ticketName}
              buyerName={personalInfo[0]?.name}
              buyerEmail={personalInfo[0]?.email}
              buyerTel={personalInfo[0]?.phone}
              savedMileage={remainingMileageAfterApply}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

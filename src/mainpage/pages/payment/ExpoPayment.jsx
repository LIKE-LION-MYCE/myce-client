import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./ExpoPayment.module.css";
import PaymentCardButton from "../../components/paymentButton/PaymentCardButton"; // 카드 결제 버튼
import PaymentVirtualBankButton from "../../components/paymentButton/PaymentVirtualBankButton"; // 가상계좌 버튼
import PaymentTransferButton from "../../components/paymentButton/PaymentTransferButton";
import {
  getUserInfoFromToken,
  isTokenExpired,
} from "../../../api/utils/jwtUtils";
import { getMyInfo } from "../../../api/service/user/memberApi";

export default function ExpoPayment() {
  const location = useLocation();
  const {
    quantity = 1,
    ticketName,
    unitPrice,
    ticketId,
  } = location.state || {};

  const [activeMethod, setActiveMethod] = useState("toss");
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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

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
  }, [quantity]);

  const handlePersonalInfoChange = (index, field, value) => {
    setPersonalInfo((prevInfo) => {
      const newInfo = [...prevInfo];
      newInfo[index] = { ...newInfo[index], [field]: value };
      return newInfo;
    });
  };

  // 개인 정보 입력칸
  const loadMemberInfo = async () => {
    const token = localStorage.getItem("access_token"); // User confirmed this is correct
    if (token && !isTokenExpired(token)) {
      try {
        const response = await getMyInfo(); // Call the API
        const userInfo = response.data; // Assuming data is in response.data

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

  return (
    <div className={styles.container}>
      {/* 왼쪽 개인 정보 입력 */}
      <section className={styles.leftSection}>
        <form className={styles.form}>
          {Array.from({ length: quantity }).map((_, index) => (
            <div key={index} className={styles.personInfoGroup}>
              <h2>개인정보 입력 {quantity > 1 ? `${index + 1}` : ""}</h2>
              {index === 0 &&
                isLoggedIn && ( // 로그인한 사람만 보이는 회원 정보 불러오기 버튼
                  <button
                    type="button"
                    onClick={loadMemberInfo}
                    className={styles.loadMemberInfoButton}
                  >
                    회원 정보 불러오기
                  </button>
                )}
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <label>이름</label>
                  <input
                    type="text"
                    value={personalInfo[index].name}
                    onChange={(e) =>
                      handlePersonalInfoChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>이메일 주소</label>
                  <input
                    type="email"
                    value={personalInfo[index].email}
                    onChange={(e) =>
                      handlePersonalInfoChange(index, "email", e.target.value)
                    }
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>생년월일</label>
                  <input
                    type="text"
                    value={personalInfo[index].birthdate}
                    onChange={(e) =>
                      handlePersonalInfoChange(
                        index,
                        "birthdate",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>전화번호</label>
                  <input
                    type="tel"
                    value={personalInfo[index].phone}
                    onChange={(e) =>
                      handlePersonalInfoChange(index, "phone", e.target.value)
                    }
                  />
                </div>

                <div className={styles.radioGroup}>
                  <label>성별</label>
                  <div className={styles.genderGroup}>
                    <label className={styles.radioItem}>
                      <input
                        type="radio"
                        name={`gender-${index}`} // Unique name for each person's gender radio group
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
                    <label className={styles.radioItem}>
                      <input
                        type="radio"
                        name={`gender-${index}`} // Unique name for each person's gender radio group
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

          <div className={styles.mileageSection}>
            <h2>마일리지 적용</h2>
            <div className={styles.formGroup}>
              <div className={styles.inputGroup}>
                <label>현재 마일리지</label>
                <input type="text" readOnly value="10000" />
              </div>
              <div className={styles.inputGroup}>
                <label>사용 마일리지</label>
                <input type="text" />
              </div>
              <button className={styles.applyButton}>적용하기</button>
              <div className={styles.inputGroup}>
                <label>남은 마일리지</label>
                <input type="text" readOnly value="3000" />
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* 오른쪽 결제 정보 영역 */}
      <section className={styles.rightSection}>
        <div className={styles.thumbnailBox}>
          <div className={styles.details}>
            <h3>행사 제목</h3>
            <div className={styles.info}>
              <p>📍 행사 장소</p>
              <p>🗓 행사 일정</p>
            </div>
          </div>
          <img
            src="https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg"
            alt="행사 제목"
            className={styles.thumbnail}
          />
        </div>

        <div className={styles.summary}>
          <h3>결제 요약</h3>
          <div className={styles.reciept}>
            <div className={styles.row}>
              <span>티켓 매수</span>
              <span>2 x 입장권</span>
            </div>
            <div className={styles.row}>
              <span>티켓 가격</span>
              <span>2 x 20,000원</span>
            </div>
            <div className={styles.row}>
              <span>행사 가격</span>
              <span>-</span>
            </div>
            <div className={styles.row}>
              <span>서비스 수수료</span>
              <span>-</span>
            </div>
            <div className={styles.row}>
              <span>마일리지</span>
              <span>7,000</span>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <span>총계</span>
              <span>33,000원</span>
            </div>
          </div>
        </div>

        <div className={styles.payment}>
          <h3>결제 방법 선택</h3>

          <div className={styles.methodGroup}>
            <label>신용카드</label>
            <button
              className={`${styles.cardButton} ${
                activeMethod === "toss" ? styles.active : ""
              }`}
              onClick={() => setActiveMethod("toss")}
            >
              <img
                src="https://i.namu.wiki/i/jL9Lqnp602cit034mt0ujqwaJChigNoIenR1vuFxK6eoov67MvOsWgMIIbbspQfdpRMOL1X5se-P5bHX4mweoA.webp"
                alt="토스페이"
              />
              토스페이로 결제
            </button>
            <PaymentCardButton
              amount={33000}
              name="박람회 티켓"
              buyerName={personalInfo[0]?.name}
              buyerEmail={personalInfo[0]?.email}
              buyerTel={personalInfo[0]?.phone}
            />
            <PaymentVirtualBankButton
              amount={33000}
              name="박람회 티켓"
              buyerName={personalInfo[0]?.name}
              buyerEmail={personalInfo[0]?.email}
              buyerTel={personalInfo[0]?.phone}
            />
            <PaymentTransferButton
              amount={33000}
              name="박람회 티켓"
              buyerName={personalInfo[0]?.name}
              buyerEmail={personalInfo[0]?.email}
              buyerTel={personalInfo[0]?.phone}
            />
          </div>

          <div className={styles.methodGroup}>
            <label>기타 결제수단</label>
            <button
              className={`${styles.cardButton} ${
                activeMethod === "account" ? styles.active : ""
              }`}
              onClick={() => setActiveMethod("account")}
            >
              계좌이체
            </button>
            <button
              className={`${styles.cardButton} ${
                activeMethod === "bank" ? styles.active : ""
              }`}
              onClick={() => setActiveMethod("bank")}
            >
              무통장입금
            </button>
            <button
              className={`${styles.cardButton} ${
                activeMethod === "simple" ? styles.active : ""
              }`}
              onClick={() => setActiveMethod("simple")}
            >
              간편 결제
            </button>
          </div>
          <Link to="/reservation-success">
            <button className={styles.confirmButton}>결제 계속하기</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

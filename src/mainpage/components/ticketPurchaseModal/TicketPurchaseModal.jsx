import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TicketPurchaseModal.module.css";
import { FiX, FiMinus, FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { getUserIdFromToken } from "../../../api/utils/jwtUtils";
import { savePreReservation } from "../../../api/service/reservation/reservationApi";
import { getActiveRefundPolicy, formatRefundPolicy } from "../../../api/service/system/refundPolicyApi";

export default function TicketPurchaseModal({
  ticket,
  expoId,
  expoTitle,
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const [refundPolicies, setRefundPolicies] = useState([]);

  // 환불 정책 로드
  useEffect(() => {
    const loadRefundPolicy = async () => {
      try {
        const policyData = await getActiveRefundPolicy();
        const formattedPolicies = formatRefundPolicy(policyData.policies || []);
        setRefundPolicies(formattedPolicies);
      } catch (error) {
        console.error("환불 정책 로드 실패:", error);
        // 에러 시에도 기본 정책을 표시
        setRefundPolicies([]);
      }
    };

    if (isOpen) {
      loadRefundPolicy();
    }
  }, [isOpen]);

  if (!isOpen || !ticket) return null;

  const maxQuantity = 4;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (
      newQuantity >= 1 &&
      newQuantity <= ticket.remainingQuantity &&
      newQuantity <= maxQuantity
    ) {
      setQuantity(newQuantity);
    }
  };

  const handleDirectQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (
      !isNaN(value) &&
      value >= 1 &&
      value <= ticket.remainingQuantity &&
      value <= maxQuantity
    ) {
      setQuantity(value);
    }
  };

  const getTotalPrice = () => {
    return (ticket.price * quantity).toLocaleString();
  };

  const handlePurchase = async () => {
    // Added async
    setIsLoading(true);

    // 로그인된 사용자 정보 확인
    const token = localStorage.getItem("access_token");
    const userId = getUserIdFromToken(token); // Get userId

    try {
      const preReservationData = {
        ticketId: ticket.ticketId,
        expoId: expoId,
        userType: "MEMBER",
        userId: userId,
        quantity: quantity,
      };

      console.log("회원 구매: 결제 페이지 이동 전 reservation 대기 위해", {
        expoId,
        preReservationData: {
          ticketId: ticket.ticketId,
          userType: "MEMBER",
          userId: userId,
          quantity: quantity,
        },
      });

      // preReservation Id 반환하는 POST
      const response = await savePreReservation(preReservationData);
      console.log("preReservation 이후 응답: ", response);

      // 세션 ID가 있으면 추가로 전달
      const queryParams = new URLSearchParams({
        preReservationId: response.reservationId
      });
      
      if (response.sessionId) {
        queryParams.set('sessionId', response.sessionId);
      }

      navigate(`/detail/${expoId}/payment?${queryParams.toString()}`);
      onClose();
    } catch (error) {
      console.error("사전 예약 생성 실패:", error);
      alert("티켓 구매 준비에 실패했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>티켓 구매</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.ticketInfo}>
            <h4>{ticket.name}</h4>
            <p className={styles.ticketType}>
              {ticket.type === "EARLY_BIRD" ? "얼리버드" : "일반"}
            </p>
            <p className={styles.price}>{ticket.price?.toLocaleString()}원</p>
            {ticket.description && (
              <p className={styles.description}>{ticket.description}</p>
            )}
            <p className={styles.remaining}>
              남은 수량:{" "}
              <strong>{ticket.remainingQuantity?.toLocaleString()}매</strong>
            </p>
          </div>

          <div className={styles.quantitySection}>
            <label>구매 수량</label>
            <div className={styles.quantityControls}>
              <button
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <FiMinus />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleDirectQuantityChange}
                min="1"
                max={Math.min(ticket.remainingQuantity, maxQuantity)}
                className={styles.quantityInput}
              />
              <button
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange(1)}
                disabled={
                  quantity >= ticket.remainingQuantity ||
                  quantity >= maxQuantity
                }
              >
                <FiPlus />
              </button>
            </div>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.priceRow}>
              <span>단가</span>
              <span>{ticket.price?.toLocaleString()}원</span>
            </div>
            <div className={styles.priceRow}>
              <span>수량</span>
              <span>{quantity}매</span>
            </div>
            <div className={styles.totalRow}>
              <span>총 결제 금액</span>
              <span className={styles.totalPrice}>{getTotalPrice()}원</span>
            </div>
          </div>

          <div className={styles.noticesSection}>
            <div className={styles.noticesHeader} onClick={() => setShowNotices(!showNotices)}>
              <span>구매 유의사항</span>
              {showNotices ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {showNotices && (
              <div className={styles.noticesContent}>
                <div className={styles.noticeItem}>
                  <strong>환불 및 취소 정책</strong>
                  <ul>
                    {refundPolicies.length > 0 ? (
                      refundPolicies.map((policy) => (
                        <li key={policy.id}>{policy.displayText}</li>
                      ))
                    ) : (
                      <>
                        <li>박람회 시작 7일 전까지: 100% 환불</li>
                        <li>박람회 시작 3~6일 전까지: 80% 환불</li>
                        <li>박람회 시작 1~2일 전까지: 50% 환불</li>
                        <li>박람회 당일: 환불 불가</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className={styles.noticeItem}>
                  <strong>티켓 사용 안내</strong>
                  <ul>
                    <li>구매 완료 후 박람회 개최 2일 전부터 QR 코드가 생성됩니다.</li>
                    <li>티켓의 사용 개시 일자부터 QR 코드가 활성화 됩니다.</li>
                    <li>박람회 당일 QR 코드를 제시해 주세요</li>
                    <li>타인에게 양도/전매 시 입장이 제한될 수 있습니다</li>
                    <li>분실 시 재발급이 불가능하니 주의해 주세요</li>
                  </ul>
                </div>
                <div className={styles.noticeItem}>
                  <strong>기타 안내</strong>
                  <ul>
                    <li>박람회 일정 변경 시 사전 공지됩니다</li>
                    <li>1인당 최대 4매까지 구매 가능합니다</li>
                    <li>결제 완료 후 예매 확인서를 이메일로 발송됩니다</li>
                    <li>문의사항은 AI 상담사 찍찍이를 이용해 주세요</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              취소
            </button>
            <button
              className={styles.purchaseBtn}
              onClick={handlePurchase}
              disabled={
                ticket.remainingQuantity <= 0 || quantity <= 0 || isLoading
              }
            >
              {isLoading ? "처리 중..." : "구매하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

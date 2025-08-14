import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TicketPurchaseModal.module.css";
import { FiX, FiMinus, FiPlus } from "react-icons/fi";
import { getUserIdFromToken } from "../../../api/utils/jwtUtils";
import { savePreReservation } from "../../../api/service/reservation/reservationApi";

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
    if (!token || !userId) {
      // Check userId
      alert("로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/auth/login");
      setIsLoading(false);
      return;
    }

    try {
      const preReservationData = {
        ticketId: ticket.ticketId,
        expoId: expoId,
        userType: "MEMBER",
        userId: userId,
        quantity: quantity,
      };

      const response = await savePreReservation(preReservationData);
      // Assuming the response contains a reservationId or similar for the next step
      // If the payment page needs data from this pre-reservation, it should be passed here.
      // For now, I'll just navigate.

      // API 호출 없이 바로 결제 페이지로 이동 -> API 호출 후 결제 페이지로 이동
      navigate(
        `/detail/${expoId}/payment?preReservationId=${response.id}`
      );
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
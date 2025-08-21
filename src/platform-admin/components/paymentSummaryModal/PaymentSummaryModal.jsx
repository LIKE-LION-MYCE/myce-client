import { useEffect, useMemo, useState } from 'react';
import styles from './PaymentSummaryModal.module.css';
import { useParams } from 'react-router-dom';
import { getPaymentInfo, approveBanner } from '../../../api/service/platform-admin/banner/BannerService';

function PaymentSummaryModal({ isOpen, onClose, onSubmit }) {
  const { id } = useParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatWon = (v) => {
    const n = typeof v === 'number' ? v : Number(v ?? 0);
    return `${n.toLocaleString()}원`;
  };

  const handlePaymentConfirm = async (bannerId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPaymentInfo(bannerId);
      const data = res?.data ?? res; // axios/일반 fetch 모두 대응
      setPaymentInfo(data);
    } catch (e) {
      console.error(e);
      setError('결제 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    try {
      approveBanner(id, paymentInfo);
      console.log("승인 성공",id, paymentInfo);
    } catch (err) {
      console.log(err);
    }
    onSubmit?.();
  }

  // 모달이 열릴 때 & id가 바뀔 때마다 새로 로드
  useEffect(() => {
    if (isOpen && id) handlePaymentConfirm(id);
  }, [isOpen, id]);

  // priceMap: 배열/객체 모두 대응해서 [ [라벨, 금액], ... ] 형태로 변환
  const feeItems = useMemo(() => {
    const map = paymentInfo?.priceMap;
    if (!map) return [];
    if (Array.isArray(map)) {
      return map.flatMap((obj) => Object.entries(obj || {}));
    }
    if (typeof map === 'object') {
      return Object.entries(map);
    }
    return [];
  }, [paymentInfo]);

  if (!isOpen) return null;

  const title = paymentInfo?.title ?? '-';
  const requesterName = paymentInfo?.requesterName ?? '-';
  const startAt = paymentInfo?.startAt ?? '-';
  const endAt = paymentInfo?.endAt ?? '-';
  const totalDays = paymentInfo?.totalDays ?? '-';
  const totalPayment = paymentInfo?.totalPayment ?? 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>결제 내역</h2>

        {loading && (
          <div className={styles.loading} role="status" aria-live="polite" aria-busy="true">
            <span className={styles.spinner} />
            <span className={styles.visuallyHidden}>불러오는 중…</span>
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>박람회명</span>
            <span className={styles.value}>{title}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>신청자</span>
            <span className={styles.value}>{requesterName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>게시 기간</span>
            <span className={styles.value}>{startAt} ~ {endAt}</span>
          </div>
        </div>

        <div className={styles.feeBox}>
          <div className={styles.row}>
            <span className={styles.label}>이용 일수</span>
            <span className={styles.amount}>{totalDays}일</span>
          </div>

          {feeItems.map(([label, amount]) => (
            <div className={styles.row} key={label}>
              <span className={styles.label}>{label}</span>
              <span className={styles.amount}>{formatWon(amount)}</span>
            </div>
          ))}

          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>총 결제 금액</span>
            <span className={styles.totalAmount}>{formatWon(totalPayment)}</span>
          </div>
        </div>

        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          <button
            className={styles.submitBtn}
            onClick={() => handleSubmit()}
            disabled={loading || !paymentInfo}
          >
            결제 요청
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSummaryModal;

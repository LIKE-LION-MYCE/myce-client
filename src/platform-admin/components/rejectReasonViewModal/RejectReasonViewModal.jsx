import styles from './RejectReasonViewModal.module.css';

function RejectReasonViewModal({ isOpen, onClose, rejectReason }) {

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>거절 사유</h2>

        <div className={styles.reasonBox}>
          {rejectReason}
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default RejectReasonViewModal;

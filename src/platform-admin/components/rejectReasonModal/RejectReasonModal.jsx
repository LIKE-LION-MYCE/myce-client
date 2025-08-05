import { useState } from 'react';
import styles from './RejectReasonModal.module.css';

function RejectReasonModal({ isOpen, onClose, onSubmit }) {
  const [reason, setReason] = useState('');

  const handleSend = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>거절 사유를 입력해주세요.</h2>

        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={styles.inputField}
          placeholder="사유를 입력해주세요"
        />

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>취소</button>
          <button onClick={handleSend} className={styles.sendBtn}>전송</button>
        </div>
      </div>
    </div>
  );
}

export default RejectReasonModal;
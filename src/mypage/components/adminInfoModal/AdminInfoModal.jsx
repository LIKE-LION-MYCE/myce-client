import React from 'react';
import styles from './AdminInfoModal.module.css';

const AdminInfoModal = ({ 
  adminId = "ab12bc123A53", 
  subordinateCodes = [
    { code: "bba24a53ww351", action: "복사" },
    { code: "h135g35h5a53h", action: "복사" },
    { code: "twtu153aa55532", action: "복사" },
    { code: "fawuieoi23al5j", action: "복사" },
    { code: "3523u980wra5a", action: "복사" }
  ],
  onClose,
  onNavigateToAdminPage
}) => {
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert('코드가 복사되었습니다.');
    }).catch(() => {
      alert('복사에 실패했습니다.');
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>관리자 정보</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.label}>관리자 아이디</div>
            <div className={styles.adminId}>{adminId}</div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <div className={styles.label}>하위 관리자 코드</div>
            <div className={styles.codeList}>
              {subordinateCodes.map((item, index) => (
                <div key={index} className={styles.codeItem}>
                  <span className={styles.code}>{item.code}</span>
                  <button 
                    className={styles.copyButton}
                    onClick={() => handleCopyCode(item.code)}
                  >
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          className={styles.navigateButton}
          onClick={onNavigateToAdminPage}
        >
          관리자 페이지 이동
        </button>
      </div>
    </div>
  );
};

export default AdminInfoModal;
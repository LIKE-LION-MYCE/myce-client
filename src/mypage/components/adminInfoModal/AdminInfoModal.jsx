import React from 'react';
import styles from './AdminInfoModal.module.css';

const AdminInfoModal = ({ 
  adminName,
  codesData,
  onClose,
  onNavigateToAdminPage
}) => {
  // Use the passed adminName, with a fallback
  const adminId = adminName || "관리자 ID 없음";
  
  // Map over the codesData array to extract the code property
  const subordinateCodes = codesData?.map(item => ({
    code: item.code,
    action: "복사"
  })) || [];

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
              {subordinateCodes.length > 0 ? (
                subordinateCodes.map((item, index) => (
                  <div key={index} className={styles.codeItem}>
                    <span className={styles.code}>{item.code}</span>
                    <button 
                      className={styles.copyButton}
                      onClick={() => handleCopyCode(item.code)}
                    >
                      {item.action}
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.noCodeMessage}>하위 관리자 코드가 없습니다.</div>
              )}
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
import styles from './NotificationTemplateView.module.css';

export default function NotificationTemplateView({ template, editData, isEditing, onChange }) {
  return (
    <>
      {/* 기본 정보 */}
      <div className={styles.infoSection}>
        <h3 className={styles.sectionTitle}>기본 정보</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>템플릿 이름</label>
          {isEditing ? (
            <input
              name="name"
              type="text"
              value={editData.name}
              onChange={(e) => onChange(e)}
              className={styles.editInput}
              placeholder="템플릿 이름을 입력하세요"
            />
          ) : (
            <div className={styles.valueDisplay}>{template.name}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>알림 제목</label>
          {isEditing ? (
            <input
              name="subject"
              type="text"
              value={editData.subject}
              onChange={(e) => onChange(e)}
              className={styles.editInput}
              placeholder="알림 제목을 입력하세요"
            />
          ) : (
            <div className={styles.valueDisplay}>{template.subject}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>알림 내용</label>
          {isEditing ? (
            <textarea
              name="content"
              value={editData.content}
              onChange={(e) => onChange(e.target)}
              className={styles.editTextarea}
              placeholder="알림 내용을 입력하세요"
              rows={6}
            />
          ) : (
            <div className={styles.valueDisplay} style={{ whiteSpace: 'pre-wrap' }}>
              {template.content}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
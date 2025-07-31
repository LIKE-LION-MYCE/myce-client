import { useState } from 'react';
import styles from './EmailModal.module.css';

function EmailModal({ isOpen, onClose, selectedCount, onSend }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSend = () => {
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('body', body);
    if (file) formData.append('attachment', file);

    onSend(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h2 className={styles.title}>이메일 전송</h2>

      <table className={styles.infoTable}>
        <tbody>
          <tr>
            <td className={styles.label}>제목</td>
            <td>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={styles.inputField}
              />
            </td>
          </tr>
          <tr>
            <td className={styles.label}>수신자 수</td>
            <td>{selectedCount}명</td>
          </tr>
          <tr>
            <td className={styles.label}>내용</td>
            <td>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={styles.textarea}
              />
            </td>
          </tr>
          <tr>
            <td className={styles.label}>첨부파일</td>
            <td>
              <input type="file" onChange={handleFileChange} />
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles.actions}>
        <button onClick={onClose} className={styles.cancelBtn}>취소</button>
        <button onClick={handleSend} className={styles.sendBtn}>전송하기</button>
      </div>
    </div>
  </div>
  );
}

export default EmailModal;
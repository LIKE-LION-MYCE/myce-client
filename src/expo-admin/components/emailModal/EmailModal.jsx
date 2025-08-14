import { useMemo, useState, useEffect } from 'react';
import styles from './EmailModal.module.css';
import { sendExpoAdminEmail } from '../../../api/service/expo-admin/email/EmailService';

function EmailModal({
  isOpen,
  onClose,
  expoId,
  selectAllMatching,
  selectedRecipients = [],
  totalElements = 0,
  onAfterSend,
  onError,
}) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubject('');
      setBody('');
      setSubmitting(false);
    }
  }, [isOpen]);

  const effectiveRecipientCount = useMemo(() => {
    return selectAllMatching
      ? totalElements
      : selectedRecipients.filter((r) => !!r.email).length;
  }, [selectAllMatching, selectedRecipients, totalElements]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSubject('');
    setBody('');
    onClose?.();
  };

  const handleSend = async () => {
    const trimmedSubject = subject.trim();
    if (!trimmedSubject) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!body.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    let dto = {
      subject: trimmedSubject,
      content: body,
      selectAllMatching: !!selectAllMatching,
    };

    if (!selectAllMatching) {
      const recipientInfos = selectedRecipients
        .filter((x) => x?.email)
        .map((x) => ({ name: x?.name ?? '', email: x.email }));

      if (recipientInfos.length === 0) {
        alert('이메일 주소가 있는 수신자가 없습니다.');
        return;
      }
      dto = { ...dto, recipientInfos };
    } else {
      if (effectiveRecipientCount === 0) {
        alert('전체 선택 모드이지만 발송 대상이 없습니다.');
        return;
      }
    }

    try {
      setSubmitting(true);
      await sendExpoAdminEmail(expoId, dto);
      onAfterSend?.();
      handleClose(); // 닫으면서 초기화
    } catch (e) {
      const msg = e?.message || '이메일 전송에 실패했습니다.';
      onError?.(msg);
    } finally {
      setSubmitting(false);
    }
  };

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
                  placeholder="제목을 입력하세요"
                />
              </td>
            </tr>

            <tr>
              <td className={styles.label}>수신자 수</td>
              <td>
                {selectAllMatching ? (
                  <span title="검색 결과 전체 선택 모드">
                    전체 선택 · 총 {effectiveRecipientCount}명
                  </span>
                ) : (
                  <span>{effectiveRecipientCount}명</span>
                )}
              </td>
            </tr>

            <tr>
              <td className={styles.label}>내용</td>
              <td>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className={styles.textarea}
                  placeholder="이메일 내용을 입력하세요"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.actions}>
          <button
            onClick={handleClose}
            className={styles.cancelBtn}
            disabled={submitting}
          >
            취소
          </button>
          <button
            onClick={handleSend}
            className={styles.sendBtn}
            disabled={submitting || (!selectAllMatching && effectiveRecipientCount === 0)}
            title={!selectAllMatching && effectiveRecipientCount === 0 ? '수신자가 없습니다' : undefined}
          >
            {submitting ? '전송 중...' : '전송하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailModal;
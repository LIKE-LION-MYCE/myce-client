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
  triggerToastFail,
  triggerSuccessToast,
  entranceStatus,
  name,
  phone,
  reservationCode,
  ticketName,
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
    const trimmedBody = body.trim();

    if (!trimmedSubject) {
      triggerToastFail?.('제목을 입력해주세요.');
      return;
    }
    if (!trimmedBody) {
      triggerToastFail?.('내용을 입력해주세요.');
      return;
    }

    // DTO 구성
    let dto = {
      subject: trimmedSubject,
      content: trimmedBody,
      selectAllMatching: !!selectAllMatching,
    };

    if (!selectAllMatching) {
      const recipientInfos = selectedRecipients
        .filter((x) => x?.email)
        .map((x) => ({ name: x?.name ?? '', email: x.email }));

      if (recipientInfos.length === 0) {
        triggerToastFail?.('이메일 주소가 있는 수신자가 없습니다.');
        return;
      }
      dto = { ...dto, recipientInfos };
    } else {
      if (effectiveRecipientCount === 0) {
        triggerToastFail?.('전체 선택 모드이지만 발송 대상이 없습니다.');
        return;
      }
    }

    const params = {
      entranceStatus: entranceStatus || undefined,
      name: name || undefined,
      phone: phone || undefined,
      reservationCode: reservationCode || undefined,
      ticketName: ticketName || undefined,
    };

    try {
      setSubmitting(true);
      await sendExpoAdminEmail(expoId, dto, params);
      triggerSuccessToast?.('이메일이 성공적으로 발송되었습니다.');
      onAfterSend?.();
      handleClose();
    } catch (e) {
      const msg = e?.message || '이메일 전송에 실패했습니다.';
      triggerToastFail?.(msg);
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
            disabled={submitting}
          >
            {submitting ? '전송 중...' : '전송하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailModal;
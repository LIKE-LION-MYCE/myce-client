import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MessageTemplateDetail.module.css';

export default function MessageTemplateDetail() {
  const template = {
    title: '박람회 신청 승인 알림',
    content: '안녕하세요. 귀하의 박람회 신청이 승인되었습니다. 자세한 내용은 첨부파일을 확인해주세요.',
    createdAt: '2024-01-15',
    updatedAt: '2025-07-30',
    useImage: true,
    sendEmail: false,
    sendAlarm: true,
  };

  return (
    <main className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>발송 메시지 관리</h1>
      </div>

      <div className={styles.card}>
        <div className={styles.topRow}>
          <h2 className={styles.templateTitle}>{template.title}</h2>
          <div className={styles.actionButtons}>
            <Link to={`/platform/admin/settingMessage/${template.id}/edit`}>
              <button className={styles.editButton}>편집</button>
            </Link>
            <button className={styles.deleteButton}>삭제</button>
          </div>
        </div>

        <label className={styles.label}>내용</label>
        <textarea
          className={styles.textarea}
          readOnly
          value={template.content}
        />

        <div className={styles.buttonRow}>
          <span className={template.useImage ? styles.tagActive : styles.tagInactive}>이미지 사용</span>
          <span className={template.sendEmail ? styles.tagActive : styles.tagInactive}>이메일 발송</span>
          <span className={template.sendAlarm ? styles.tagActive : styles.tagInactive}>알림 발송</span>
        </div>

        <div className={styles.metaRow}>
          <span>생성: {template.createdAt}</span>
          <span>수정: {template.updatedAt}</span>
        </div>
      </div>
    </main>
  );
}

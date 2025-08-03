// src/pages/MessageTemplateNew.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MessageTemplateNew.module.css';

export default function MessageTemplateNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    useImage: false,
    sendEmail: false,
    sendAlarm: false,
  });

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.topRow}>
          <div className={styles.titleWithBack}>
            <button className={styles.backArrow} onClick={() => navigate(-1)}>←</button>
            <h2 className={styles.templateTitle}>발송 메시지 생성</h2>
          </div>
        </div>

        <label className={styles.label}>제목</label>
        <input
          className={styles.titleInput}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <label className={styles.label}>내용</label>
        <textarea
          className={styles.textarea}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />

        <div className={styles.toggleRow}>
          <label className={styles.toggleWrapper}>
            <input
              type="checkbox"
              checked={formData.useImage}
              onChange={() => handleToggle('useImage')}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
            <span className={styles.toggleText}>이미지 사용</span>
          </label>
          <label className={styles.toggleWrapper}>
            <input
              type="checkbox"
              checked={formData.sendEmail}
              onChange={() => handleToggle('sendEmail')}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
            <span className={styles.toggleText}>이메일 발송</span>
          </label>
          <label className={styles.toggleWrapper}>
            <input
              type="checkbox"
              checked={formData.sendAlarm}
              onChange={() => handleToggle('sendAlarm')}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
            <span className={styles.toggleText}>알림 발송</span>
          </label>
        </div>

        <div className={styles.buttonBottomRow}>
          <button className={styles.cancelButton}>취소</button>
          <button className={styles.saveButton}>저장하기</button>
        </div>
      </div>
    </main>
  );
}
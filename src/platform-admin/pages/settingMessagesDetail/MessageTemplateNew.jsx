// src/pages/MessageTemplateDetail.jsx
import React, { useState } from 'react';
import styles from './MessageTemplateNew.module.css';

export default function MessageTemplateNew() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        createdAt: '',
        updatedAt: '',
        useImage: false,
        sendEmail: false,
        sendAlarm: false,
    });

    const handleToggle = (key) => {
        setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <main className={styles.container}>
            <div className={styles.headerRow}>
                <h1 className={styles.pageTitle}>발송 메시지 관리</h1>
            </div>

            <div className={styles.card}>
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

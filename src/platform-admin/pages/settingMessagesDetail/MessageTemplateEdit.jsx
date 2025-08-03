// src/pages/MessageTemplateDetail.jsx
import React, { useState } from 'react';
import styles from './MessageTemplateEdit.module.css';

export default function MessageTemplateEdit() {
    const [formData, setFormData] = useState({
        title: '박람회 신청 승인 알림',
        content: '안녕하세요. 귀하의 박람회 신청이 승인되었습니다. 자세한 내용은 첨부파일을 확인해주세요.',
        createdAt: '2024-01-15',
        updatedAt: '2025-07-30',
        useImage: false,
        sendEmail: true,
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

                <div className={styles.metaRow}>
                    <span>생성: {formData.createdAt}</span>
                    <span>수정: {formData.updatedAt}</span>
                </div>

                <div className={styles.buttonBottomRow}>
                    <button className={styles.cancelButton}>취소</button>
                    <button className={styles.saveButton}>저장하기</button>
                </div>
            </div>
        </main>
    );
}

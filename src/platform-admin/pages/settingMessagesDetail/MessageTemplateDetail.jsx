import React, { useState } from 'react';
import styles from './MessageTemplateDetail.module.css';
import TemplateEditor from '../../components/templateEditor/TemplateEditor';

export default function MessageTemplateDetail() {
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const template = {
    id: 1,
    title: '박람회 신청 승인 알림',
    content: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>MYCE - 이메일 인증</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @media (max-width: 640px) {
            .container { width: 100% !important; }
            .px-32 { padding-left: 16px !important; padding-right: 16px !important; }
        }
        
        .copy-button {
            background: #111111;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            margin-top: 12px;
            transition: background-color 0.2s ease;
        }
    </style>
</head>
<body style="margin:0; padding:0; background:#f6f7f9;">
    <!-- 이메일 템플릿 내용 -->
</body>
</html>`,
    subject: '박람회 신청 승인 알림',
    createdAt: '2024-01-15',
    updatedAt: '2025-07-30',
    useImage: true,
    sendEmail: true,
    sendAlarm: false,
  };

  const handleSaveTemplate = (updatedTemplate) => {
    console.log('저장된 템플릿:', updatedTemplate);
    alert('템플릿이 저장되었습니다!');
    setShowEditor(false);
  };

  const handleEditClick = () => {
    if (template.sendEmail) {
      setShowEditor(true);
    } else {
      console.log('Navigate to edit page');
    }
  };

  const handleDeleteClick = () => {
    if (confirm('정말로 이 템플릿을 삭제하시겠습니까?')) {
      console.log('템플릿 삭제:', template.id);
    }
  };

  const handleBackClick = () => {
    console.log('Navigate back');
  };

  // 발송 타입 결정
  const getSendType = () => {
    if (template.sendEmail && template.sendAlarm) return '이메일 + 알림';
    if (template.sendEmail) return '이메일';
    if (template.sendAlarm) return '알림';
    return '미설정';
  };

  // 이메일 발송이 활성화되어 있고 에디터가 표시되어야 하는 경우
  if (template.sendEmail && showEditor) {
    return (
      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <button className={styles.backArrow} onClick={() => setShowEditor(false)}>←</button>
          <h2>{template.title} - 이메일 템플릿 편집</h2>
        </div>
        <TemplateEditor 
          template={template} 
          onSave={handleSaveTemplate}
        />
      </div>
    );
  }

  return (
    <main className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.titleWithBack}>
          <button className={styles.backArrow} onClick={handleBackClick}>←</button>
          <h1 className={styles.pageTitle}>메시지 템플릿</h1>
        </div>
      </div>

      {/* 제목 */}
      <div className={styles.section}>
        <label className={styles.label}>제목</label>
        <div className={styles.titleBox}>
          <h2 className={styles.templateTitle}>{template.title}</h2>
        </div>
      </div>

      {/* 발송 타입 & 이미지 사용 */}
      <div className={styles.inlineSection}>
        <div className={styles.inlineItem}>
          <label className={styles.label}>발송 타입</label>
          <div className={styles.sendTypeContainer}>
            <div className={`${styles.sendTypeBadge} ${
              template.sendEmail || template.sendAlarm ? styles.active : styles.inactive
            }`}>
              <div className={styles.statusDot}></div>
              {getSendType()}
            </div>
          </div>
        </div>
        
        <div className={styles.inlineItem}>
          <label className={styles.label}>이미지 사용</label>
          <div className={styles.toggleContainer}>
            <div className={`${styles.toggle} ${template.useImage ? styles.toggleActive : ''}`}>
              <span className={styles.toggleSlider}></span>
            </div>
            <span className={styles.toggleLabel}>
              {template.useImage ? '사용함' : '사용안함'}
            </span>
          </div>
        </div>
      </div>

      {/* 내용 */}
      <div className={styles.section}>
        <label className={styles.label}>내용</label>
        <div className={styles.contentTabs}>
          <button 
            className={`${styles.tabButton} ${!showPreview ? styles.tabActive : ''}`}
            onClick={() => setShowPreview(false)}
          >
            코드 보기
          </button>
          <button 
            className={`${styles.tabButton} ${showPreview ? styles.tabActive : ''}`}
            onClick={() => setShowPreview(true)}
          >
            미리보기
          </button>
        </div>
        <div className={styles.contentBox}>
          {showPreview ? (
            <iframe
              className={styles.preview}
              srcDoc={template.content}
              title="Email Preview"
            />
          ) : (
            <pre className={styles.codeContent}>{template.content}</pre>
          )}
        </div>
      </div>

      {/* 생성/수정 날짜 */}
      <div className={styles.dateSection}>
        <div className={styles.dateItem}>
          <label className={styles.label}>생성일</label>
          <div className={styles.dateBox}>
            <p className={styles.dateText}>{template.createdAt}</p>
          </div>
        </div>
        <div className={styles.dateItem}>
          <label className={styles.label}>최종 수정일</label>
          <div className={styles.dateBox}>
            <p className={styles.dateText}>{template.updatedAt}</p>
          </div>
        </div>
      </div>

      {/* 이메일 발송 안내 */}
      {template.sendEmail && (
        <div className={styles.emailInfo}>
          <div className={styles.emailInfoContent}>
            <svg className={styles.emailIcon} fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <div>
              <p className={styles.emailInfoTitle}>이메일 발송 활성화</p>
              <p className={styles.emailInfoDesc}>편집 시 이메일 템플릿 에디터가 열립니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className={styles.actionSection}>
        <button onClick={handleDeleteClick} className={styles.deleteButton}>
          <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          삭제
        </button>
        <button onClick={handleEditClick} className={styles.editButton}>
          <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {template.sendEmail ? '이메일 템플릿 편집' : '편집'}
        </button>
      </div>
    </main>
  );
}
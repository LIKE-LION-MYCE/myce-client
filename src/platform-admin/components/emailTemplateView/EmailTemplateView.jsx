import React, { useState } from 'react';
import styles from './EmailTemplateView.module.css';

export default function EmailTemplateView({ template, editData, isEditing, onSave, onChange }) {
  const [showPreview, setShowPreview] = useState(false);

  // JSON content를 파싱하여 변수들을 추출
  const parseContentVariables = (content = template.content) => {
    try {
      return JSON.parse(content || '{}');
    } catch (error) {
      console.error('Failed to parse content variables:', error);
      return {};
    }
  };

  // HTML 템플릿에 변수를 적용하여 미리보기용 HTML 생성
  const generatePreviewHTML = () => {
    if (!template.template) return '';
    
    const variables = parseContentVariables(isEditing ? editData.content : template.content);
    let previewHTML = template.template;

    // 각 변수를 실제 값으로 치환
    Object.entries(variables).forEach(([key, value]) => {
      if (key === 'securityContent') {
        previewHTML = previewHTML.replace(new RegExp(`"${value}"`, 'g'), value);
      } else {
        if (key === 'code') {
          previewHTML = previewHTML.replace(/123456/g, value);
        } else if (key === 'limitTime') {
          previewHTML = previewHTML.replace(/5분/g, `${value}분`);
        }
      }
    });

    return previewHTML;
  };

  const handleVariableChange = (key, value) => {
    const variables = parseContentVariables(editData.content);
    variables[key] = value;
    onChange({name: 'content', value: JSON.stringify(variables, null, 2)});
  };

  const handleSave = () => {
    onSave({
      ...template,
      ...editData
    });
  };

  const currentVariables = parseContentVariables(isEditing ? editData.content : template.content);

  return (
    <>
      {/* 기본 정보 */}
      <div className={styles.infoSection}>
        <h3 className={styles.sectionTitle}>기본 정보</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>템플릿 이름</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={(e) => onChange(e.target)}
              className={styles.editInput}
              placeholder="템플릿 이름을 입력하세요"
            />
          ) : (
            <div className={styles.valueDisplay}>{template.name}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>이메일 제목</label>
          {isEditing ? (
            <input
              type="text"
              name="subject"
              value={editData.subject}
              onChange={(e) => onChange(e.target)}
              className={styles.editInput}
              placeholder="이메일 제목을 입력하세요"
            />
          ) : (
            <div className={styles.valueDisplay}>{template.subject}</div>
          )}
        </div>

        <div className={styles.inlineSection}>
          <div className={styles.inlineItem}>
            <label className={styles.label}>발송 타입</label>
            <div className={styles.valueDisplay}>{template.channelType}</div>
          </div>
          
          <div className={styles.inlineItem}>
            <label className={styles.label}>이미지 사용</label>
            <div className={styles.valueDisplay}>{template.useImage ? '사용함' : '사용안함'}</div>
          </div>
        </div>
      </div>

      {/* 템플릿 변수 & 미리보기 */}
      <div className={styles.templateSection}>
        {/* 왼쪽: 템플릿 변수 */}
        {(template.content || isEditing) && (
          <div className={styles.variableSection}>
            <h3 className={styles.sectionTitle}>템플릿 변수</h3>
            <div className={styles.variablesContainer}>
              {Object.entries(currentVariables).map(([key, value]) => (
                <div key={key} className={styles.variableItem}>
                  <div className={styles.variableKey}>{key}</div>
                  {isEditing ? (
                    <textarea
                      value={typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      onChange={(e) => {
                        let newValue = e.target.value;
                        // JSON 형태인지 확인하여 파싱 시도
                        try {
                          if (newValue.startsWith('{') || newValue.startsWith('[')) {
                            newValue = JSON.parse(newValue);
                          }
                        } catch (error) {
                          // JSON이 아니면 문자열로 처리
                        }
                        handleVariableChange(key, newValue);
                      }}
                      className={styles.editTextarea}
                      rows={typeof value === 'string' && value.includes('<') ? 6 : 3}
                    />
                  ) : (
                    <div className={styles.variableValue}>
                      {typeof value === 'string' && value.includes('<') ? (
                        <div 
                          className={styles.variableHtml}
                          dangerouslySetInnerHTML={{ __html: value }}
                        />
                      ) : (
                        <span className={styles.variableText}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 오른쪽: 템플릿 미리보기 */}
        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h3 className={styles.sectionTitle}>템플릿 미리보기</h3>
            <div className={styles.previewTabs}>
              <button 
                className={`${styles.tabButton} ${!showPreview ? styles.tabActive : ''}`}
                onClick={() => setShowPreview(false)}
              >
                HTML 코드
              </button>
              <button 
                className={`${styles.tabButton} ${showPreview ? styles.tabActive : ''}`}
                onClick={() => setShowPreview(true)}
              >
                미리보기
              </button>
            </div>
          </div>
          
          <div className={styles.previewContainer}>
            <div className={styles.emailHeader}>
              제목: {isEditing ? editData.subject : template.subject}
            </div>
            
            <div className={styles.previewContent}>
              {showPreview ? (
                <div className={styles.emailContent}>
                  <div
                    dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }}
                    className={styles.emailScale}
                  />
                </div>
              ) : (
                <pre className={styles.codeContent}>{template.template}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
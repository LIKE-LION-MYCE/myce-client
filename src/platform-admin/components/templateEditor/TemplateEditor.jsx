import React, { useState, useEffect } from 'react';
import styles from './TemplateEditor.module.css';

const TemplateEditor = ({ template, onSave }) => {
  const [subject, setSubject] = useState(template.subject || 'MYCE - 이메일 인증');
  
  // Thymeleaf 템플릿 변수들
  const [templateVariables, setTemplateVariables] = useState({
    CODE: '123456',
    LIMIT_TIME: '5',
    VERIFICATION_NAME: '회원가입'
  });
  
  // 편집 가능한 텍스트 상태 (Thymeleaf 변수들)
  const [editableTexts, setEditableTexts] = useState(() => {
    if (template.editableTexts) {
      return template.editableTexts;
    }
    
    return {
      emailTitle: '이메일 인증번호 안내',
      preheader: '이메일 인증번호입니다.',
      greetingMessage: '안녕하세요.<br><strong>회원가입</strong>을 완료하기 위해 아래 인증번호를 입력해주세요.',
      codeLabel: '인증번호',
      warningPrefix: '중요:',
      warningMessage: '이 인증번호는',
      warningSuffix: '후에 만료됩니다.',
      securityTitle: '🔒 보안 안내',
      securityContent: '• 인증번호를 타인과 공유하지 마세요<br>• 본인이 요청하지 않은 인증이라면 즉시 무시해주세요<br>• 문제가 있으시면 고객센터로 문의해주세요'
    };
  });
  
  const [previewHtml, setPreviewHtml] = useState('');

  // 템플릿 변수 치환 함수
  const replaceTemplateVariables = (content, variables) => {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  // Thymeleaf 템플릿 HTML 생성 (원본 구조 유지)
  const generateTemplateContent = () => {
    return `<!DOCTYPE html>
<html lang="ko" xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8">
  <title th:text="|MYCE - \${emailTitle}|">MYCE - 이메일 인증</title>
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

    .copy-button:hover {
      background: #333333;
    }

    .myce-link-small {
      color: #666666;
      text-decoration: none;
      font-size: 10px;
      font-weight: 400;
      transition: color 0.2s ease;
    }

    .myce-link-small:hover {
      color: #111111;
      text-decoration: underline;
    }
  </style>
  <script>
    function copyVerificationCode() {
      const codeElement = document.getElementById('verificationCode');
      const code = codeElement.textContent;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function() {
          const button = document.getElementById('copyButton');
          const originalText = button.textContent;
          button.textContent = '복사됨!';
          button.style.background = '#28a745';

          setTimeout(function() {
            button.textContent = originalText;
            button.style.background = '#111111';
          }, 2000);
        }).catch(function() {
          fallbackCopyTextToClipboard(code);
        });
      } else {
        fallbackCopyTextToClipboard(code);
      }
    }

    function fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        const button = document.getElementById('copyButton');
        const originalText = button.textContent;
        button.textContent = '복사됨!';
        button.style.background = '#28a745';

        setTimeout(function() {
          button.textContent = originalText;
          button.style.background = '#111111';
        }, 2000);
      } catch (err) {
        console.error('복사 실패:', err);
      }

      document.body.removeChild(textArea);
    }
  </script>
</head>
<body style="margin:0; padding:0; background:#f6f7f9;">

<div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; mso-hide:all;"
     th:text="\${preheader}">\${preheader}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" class="container" cellpadding="0" cellspacing="0" style="width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
        <!-- Header -->
        <tr>
          <td class="px-32" style="padding:28px 32px 8px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="middle" style="font-size:28px; font-weight:800; letter-spacing:0.4px; color:#111111;">
                  <a href="https://myce.live" style="color:#111111; text-decoration:none;">MYCE</a>
                </td>
                <td valign="middle" align="right" style="font-size:12px; color:#666666;">
                  Manage Your Conferences & Expos<br>
                  <a href="https://myce.live" class="myce-link-small">myce.live 바로가기</a>
                </td>
              </tr>
            </table>
            <div style="height:12px;"></div>
            <div style="border-bottom:2px solid #111111; width:100%;"></div>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td class="px-32" style="padding:28px 32px 8px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
            <div style="font-size:23px; line-height:1.25; font-weight:800; color:#1a1a1a;"
                 th:text="\${emailTitle}">\${emailTitle}</div>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td class="px-32" style="padding:8px 32px 16px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
            <div style="font-size:15px; line-height:1.8; color:#222222;"
                 th:utext="\${greetingMessage}">\${greetingMessage}</div>
          </td>
        </tr>

        <!-- Code Section (Text Only) -->
        <tr>
          <td class="px-32" style="padding:8px 32px 16px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
            <div style="background:#f9fafb; border:1px solid #eceff3; border-radius:8px; padding:24px; text-align:center;">
              <div style="font-size:13px; color:#666666; margin-bottom:12px; font-weight:600;"
                   th:text="\${codeLabel}">\${codeLabel}</div>
              <div id="verificationCode" style="font-size:32px; font-weight:800; letter-spacing:8px; color:#111111; font-family:'SF Mono','Monaco','Roboto Mono',monospace; background:#ffffff; padding:16px 24px; border-radius:6px; border:2px solid #e9ebf0; display:inline-block;"
                   th:text="\${code}">\${code}</div>
            </div>
          </td>
        </tr>

        <!-- Warning -->
        <tr>
          <td class="px-32" style="padding:8px 32px 16px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
            <div style="background:#fff8e1; border:1px solid #ffd93d; border-radius:6px; padding:16px; font-size:14px; color:#856404;">
              ⚠️ <strong th:text="\${warningPrefix}">\${warningPrefix}</strong>
              <span th:text="\${warningMessage}">\${warningMessage}</span>
              <strong th:text="|\${limitTime}분|">\${limitTime}분</strong>
              <span th:text="\${warningSuffix}">\${warningSuffix}</span>
            </div>
          </td>
        </tr>

        <!-- Additional Info -->
        <tr>
          <td class="px-32" style="padding:8px 32px 16px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
            <div style="font-size:13px; line-height:1.7; color:#666666;">
              <div style="background:#f9fafb; border:1px solid #eceff3; border-radius:6px; padding:16px;">
                <p style="margin:0 0 8px 0; font-weight:600; color:#333;"
                   th:text="\${securityTitle}">\${securityTitle}</p>
                <div th:utext="\${securityContent}">
                  \${securityContent}
                </div>
              </div>
            </div>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 32px;">
            <div style="border-top:1px solid #e9ebf0; width:100%;"></div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="px-32" style="padding:18px 32px 8px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
            <div style="font-size:12px; line-height:1.7; color:#666666;">
              <p style="margin:0 0 8px 0;">본 메일은 발신전용입니다.</p>
              <p style="margin:0 0 8px 0;">
                MYCE는 티켓 중개(통신판매중개) 플랫폼으로, 행사 주최·운영의 책임은 각 주최자에게 있습니다.
              </p>
              <p style="margin:0 0 8px 0;">
                결제/취소/환불은 MYCE 고객센터를 통해 안내·처리됩니다.
              </p>
              <p style="margin:0 0 8px 0;">
                자세한 내용은 <a href="https://myce.live/terms" style="color:#111111;">이용약관</a>/<a href="https://myce.live/refund" style="color:#111111;">환불정책</a>/<a href="https://myce.live/privacy" style="color:#111111;">개인정보 처리방침</a>을 확인해 주세요.
              </p>
              <p style="margin:8px 0 12px 0;">
                <a href="https://myce.live" style="color:#111111; text-decoration:underline;">🌐 myce.live</a>
                &nbsp;|&nbsp;
                <a href="mailto:support@myce.live" style="color:#111111; text-decoration:underline;">📧 고객센터</a>
              </p>
              <p style="margin:0; color:#888888;">© MYCE Corp. All rights reserved.</p>
            </div>
          </td>
        </tr>

        <tr><td style="height:24px;"></td></tr>
      </table>

      <div style="height:24px;"></div>
    </td>
  </tr>
</table>
</body>
</html>`;
  };

  // 미리보기용 HTML 생성 (실제 값으로 치환)
  const generatePreviewHtml = () => {
    const template = generateTemplateContent();
    
    // Thymeleaf 변수를 실제 값으로 치환
    let preview = template
      .replace(/th:text="[^"]*"/g, '')
      .replace(/th:utext="[^"]*"/g, '')
      .replace(/xmlns:th="[^"]*"/g, '')
      .replace(/\$\{emailTitle\}/g, editableTexts.emailTitle)
      .replace(/\$\{preheader\}/g, editableTexts.preheader)
      .replace(/\$\{greetingMessage\}/g, editableTexts.greetingMessage)
      .replace(/\$\{codeLabel\}/g, editableTexts.codeLabel)
      .replace(/\$\{code\}/g, templateVariables.CODE)
      .replace(/\$\{warningPrefix\}/g, editableTexts.warningPrefix)
      .replace(/\$\{warningMessage\}/g, editableTexts.warningMessage)
      .replace(/\$\{limitTime\}/g, templateVariables.LIMIT_TIME)
      .replace(/\$\{warningSuffix\}/g, editableTexts.warningSuffix)
      .replace(/\$\{securityTitle\}/g, editableTexts.securityTitle)
      .replace(/\$\{securityContent\}/g, editableTexts.securityContent);
    
    return preview;
  };

  // 미리보기 업데이트
  useEffect(() => {
    const preview = generatePreviewHtml();
    setPreviewHtml(preview);
  }, [editableTexts, templateVariables]);

  // template prop이 변경될 때 상태 업데이트
  useEffect(() => {
    if (template.editableTexts) {
      setEditableTexts(template.editableTexts);
    }
    if (template.subject) {
      setSubject(template.subject);
    }
  }, [template]);

  // 변수 값 변경 처리
  const handleVariableChange = (key, value) => {
    setTemplateVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 편집 가능한 텍스트 변경 처리
  const handleTextChange = (key, value) => {
    setEditableTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 저장 처리
  const handleSave = () => {
    const updatedTemplate = {
      ...template,
      subject: subject,
      content: generateTemplateContent(),
      editableTexts: editableTexts
    };
    onSave(updatedTemplate);
  };

  return (
    <div className={styles.templateEditor}>
      {/* 좌측: 편집 영역 */}
      <div className={styles.editorPanel}>
        <h3 className={styles.panelTitle}>템플릿 편집</h3>

        {/* 제목 편집 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>이메일 제목</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="이메일 제목을 입력하세요"
            className={styles.input}
          />
        </div>

        {/* 템플릿 변수 (미리보기용) */}
        <div className={styles.variableSection}>
          <h4 className={styles.sectionTitle}>템플릿 변수 (미리보기용)</h4>
          
          <div className={styles.variableItem}>
            <label className={styles.variableLabel}>인증번호 (CODE)</label>
            <input
              type="text"
              value={templateVariables.CODE}
              onChange={(e) => handleVariableChange('CODE', e.target.value)}
              placeholder="123456"
              maxLength="6"
              className={styles.input}
            />
          </div>

          <div className={styles.variableItem}>
            <label className={styles.variableLabel}>유효시간 (LIMIT_TIME)</label>
            <select
              value={templateVariables.LIMIT_TIME}
              onChange={(e) => handleVariableChange('LIMIT_TIME', e.target.value)}
              className={styles.select}
            >
              <option value="3">3분</option>
              <option value="5">5분</option>
              <option value="10">10분</option>
              <option value="15">15분</option>
            </select>
          </div>
        </div>

        {/* 편집 가능한 텍스트 */}
        <div className={styles.variableSection}>
          <h4 className={styles.sectionTitle}>편집 가능한 텍스트</h4>
          
          {[
            { key: 'emailTitle', label: '이메일 제목 (헤더)', type: 'input' },
            { key: 'preheader', label: '미리보기 텍스트', type: 'input' },
            { key: 'greetingMessage', label: '인사말 메시지', type: 'textarea' },
            { key: 'codeLabel', label: '인증번호 라벨', type: 'input' },
            { key: 'warningPrefix', label: '경고 접두사', type: 'input' },
            { key: 'warningMessage', label: '경고 메시지', type: 'input' },
            { key: 'warningSuffix', label: '경고 접미사', type: 'input' },
            { key: 'securityTitle', label: '보안 안내 제목', type: 'input' },
            { key: 'securityContent', label: '보안 안내 내용', type: 'textarea' }
          ].map(({ key, label, type }) => (
            <div key={key} className={styles.variableItem}>
              <label className={styles.variableLabel}>{label}</label>
              {type === 'textarea' ? (
                <textarea
                  value={editableTexts[key]}
                  onChange={(e) => handleTextChange(key, e.target.value)}
                  rows={3}
                  className={styles.textarea}
                />
              ) : (
                <input
                  type="text"
                  value={editableTexts[key]}
                  onChange={(e) => handleTextChange(key, e.target.value)}
                  className={styles.input}
                />
              )}
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className={styles.buttonGroup}>
          <button onClick={handleSave} className={styles.btnSave}>
            저장
          </button>
          <button onClick={() => alert('테스트 메일 발송!')} className={styles.btnTest}>
            테스트 발송
          </button>
        </div>
      </div>

      {/* 우측: 미리보기 영역 */}
      <div className={styles.previewPanel}>
        <h3 className={styles.previewTitle}>미리보기</h3>
        
        <div className={styles.previewContainer}>
          <div className={styles.emailHeader}>
            제목: {subject}
          </div>
          
          <div className={styles.emailContent}>
            <div
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              className={styles.emailScale}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
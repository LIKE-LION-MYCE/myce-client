import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './MessageTemplateDetail.module.css';
import TemplateEditor from '../../components/templateEditor/TemplateEditor';

export default function MessageTemplateDetail() {
  const navigate = useNavigate();
  const [showEditor, setShowEditor] = useState(false);

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

<div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; mso-hide:all;">
    {{VERIFICATION_NAME}} 인증번호입니다.
</div>

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
                        <div style="font-size:23px; line-height:1.25; font-weight:800; color:#1a1a1a;">
                            이메일 인증번호 안내
                        </div>
                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td class="px-32" style="padding:8px 32px 16px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
                        <div style="font-size:15px; line-height:1.8; color:#222222;">
                            안녕하세요.<br>
                            <strong>{{VERIFICATION_NAME}}</strong>을 완료하기 위해 아래 인증번호를 입력해주세요.
                        </div>
                    </td>
                </tr>

                <!-- Code Section -->
                <tr>
                    <td class="px-32" style="padding:8px 32px 16px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
                        <div style="background:#f9fafb; border:1px solid #eceff3; border-radius:8px; padding:24px; text-align:center;">
                            <div style="font-size:13px; color:#666666; margin-bottom:12px; font-weight:600;">
                                인증번호
                            </div>
                            <div id="verificationCode" style="font-size:32px; font-weight:800; letter-spacing:8px; color:#111111; font-family:'SF Mono','Monaco','Roboto Mono',monospace; background:#ffffff; padding:16px 24px; border-radius:6px; border:2px solid #e9ebf0; display:inline-block;">
                                {{CODE}}
                            </div>
                            <div>
                                <button id="copyButton" class="copy-button" onclick="copyVerificationCode()">
                                    인증번호 복사
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>

                <!-- Warning -->
                <tr>
                    <td class="px-32" style="padding:8px 32px 16px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
                        <div style="background:#fff8e1; border:1px solid #ffd93d; border-radius:6px; padding:16px; font-size:14px; color:#856404;">
                            ⚠️ <strong>중요:</strong> 이 인증번호는 <strong>{{LIMIT_TIME}}분</strong> 후에 만료됩니다.
                        </div>
                    </td>
                </tr>



                <!-- Additional Info -->
                <tr>
                    <td class="px-32" style="padding:8px 32px 16px 32px; font-family: 'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
                        <div style="font-size:13px; line-height:1.7; color:#666666;">
                            <div style="background:#f9fafb; border:1px solid #eceff3; border-radius:6px; padding:16px;">
                                <p style="margin:0 0 8px 0; font-weight:600; color:#333;">🔒 보안 안내</p>
                                <p style="margin:0 0 4px 0;">• 인증번호를 타인과 공유하지 마세요</p>
                                <p style="margin:0 0 4px 0;">• 본인이 요청하지 않은 인증이라면 즉시 무시해주세요</p>
                                <p style="margin:0;">• 문제가 있으시면 고객센터로 문의해주세요</p>
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
</html>`,
    subject: '박람회 신청 승인 알림',
    createdAt: '2024-01-15',
    updatedAt: '2025-07-30',
    useImage: true,
    sendEmail: true, // 이메일 발송이 true일 때 에디터 표시
    sendAlarm: true,
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
      // 기존 편집 페이지로 이동
      navigate(`/platform/admin/settingMessage/${template.id}/edit`);
    }
  };

  // 이메일 발송이 활성화되어 있고 에디터가 표시되어야 하는 경우
  if (template.sendEmail && showEditor) {
    return (
      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <button 
            className={styles.backButton} 
            onClick={() => setShowEditor(false)}
          >
            ← 상세보기로 돌아가기
          </button>
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
      <div className={styles.card}>
        <div className={styles.topRow}>
          <div className={styles.titleWithBack}>
            <button className={styles.backArrow} onClick={() => navigate(-1)}>←</button>
            <h2 className={styles.templateTitle}>{template.title}</h2>
          </div>
          <div className={styles.actionButtons}>
            <button
              className={styles.editButton}
              onClick={handleEditClick}
            >
              {template.sendEmail ? '이메일 템플릿 편집' : '편집'}
            </button>
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

        {template.sendEmail && (
          <div className={styles.emailInfo}>
            <p className={styles.emailInfoText}>
              💌 이메일 발송이 활성화되어 있습니다. 편집 버튼을 클릭하면 이메일 템플릿 에디터가 열립니다.
            </p>
          </div>
        )}

        <div className={styles.metaRow}>
          <span>생성: {template.createdAt}</span>
          <span>수정: {template.updatedAt}</span>
        </div>
      </div>
    </main>
  );
}
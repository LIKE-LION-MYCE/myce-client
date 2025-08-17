import React, { useEffect, useState } from 'react';
import styles from './MessageTemplateDetail.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getMessageTemplate, updateMessageTemplate } from '../../../api/service/system/settings/messageFormat/MessageFormatService';
import EmailTemplateView from '../../components/emailTemplateView/EmailTemplateView';
import NotificationTemplateView from '../../components/notificationTemplateView/NotificationTemplateView';

export default function MessageTemplateDetail() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    id: 0,
    name: '',
    channelType: '',
    subject: '',
    template: '', // HTML 템플릿 (이메일용)
    content: '', // JSON 형태의 변수들 (이메일) 또는 알림 내용 (알림)
    useImage: false,
    createdAt: '',
    updatedAt: ''
  });

  const [editData, setEditData] = useState({
    name: template.name,
    subject: template.subject,
    content: template.content
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getMessageTemplate(id)
    .then(res => {
      console.log(res);
      const initTemplate = res.data;
      setTemplate(initTemplate);

      setEditData({
        name: initTemplate.name,
        subject: initTemplate.subject,
        content: initTemplate.content
      });
    })
    .catch(err => {
      console.log(`Fail to get template. id=${id}`, err);
    })
  }, []);

  const handleSaveTemplate = () => {
    updateMessageTemplate(id, editData.name, editData.subject, editData.content)
    .then((res) => {
      alert('템플릿이 저장되었습니다!');
      setTemplate(res.data);
      setIsEditing(false);
      console.log('저장된 템플릿:', res.data); 
    })
    .catch((err) => {
      if(err.response.data?.message) alert(err.response.data?.message);
      else alert('템플릿 저장에 실패했습니다.');
      console.log('Fail to update template.', err);
    });
  };

  const handleAdvancedEdit = () => {
    if (template.channelType === 'EMAIL') {
      setShowEditor(true);
    } else {
      console.log('Navigate to edit page');
    }
  };

  const handleSimpleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleBackClick = () => {
    navigate('/platform/admin/settingMessage');
  };

  const handleOnChange = (e) => {
    const newTemplate = {...template, [e.name]: e.value};
    setEditData(newTemplate);

    console.log(newTemplate);
  }

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backArrow} onClick={handleBackClick}>←</button>
          <h1 className={styles.pageTitle}>{template.name}</h1>
        </div>
        <div className={styles.headerRight}>
          {/* 편집 버튼들 */}
          {isEditing ? (
            <>
              <button onClick={handleCancelEdit} className={styles.btnCancel}>
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                취소
              </button>
              <button onClick={() => handleSaveTemplate()} className={styles.btnSave}>
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                저장
              </button>
            </>
          ) : (
            <button onClick={handleSimpleEdit} className={styles.btnEdit}>
              <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              수정하기
            </button>
          )}
        </div>
      </div>

      {/* 템플릿 타입에 따른 뷰 렌더링 */}
      {template.channelType === 'EMAIL' ? (
        <EmailTemplateView
          template={template}
          editData={editData}
          isEditing={isEditing}
          onChange={handleOnChange}
        />
      ) : (
        <NotificationTemplateView
          template={template}
          editData={editData}
          isEditing={isEditing}
          onChange={handleOnChange}
        />
      )}

      {/* 생성 정보 */}
      <div className={styles.dateSection}>
        <h3 className={styles.sectionTitle}>생성 정보</h3>
        
        <div className={styles.dateGrid}>
          <div className={styles.dateItem}>
            <label className={styles.label}>생성일</label>
            <div className={styles.dateValue}>{template.createdAt}</div>
          </div>
          <div className={styles.dateItem}>
            <label className={styles.label}>최종 수정일</label>
            <div className={styles.dateValue}>{template.updatedAt}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import styles from './MessageTemplateList.module.css';
import { Link } from 'react-router-dom';
import Pagination from '../../../common/commponents/pagination/Pagination';
import { FiSearch } from 'react-icons/fi';
import { MdAddCircle } from 'react-icons/md';

const dummyTemplates = [
  {
    id: 1,
    title: '박람회 신청 승인 알림',
    content: '안녕하세요. 귀하의 박람회 신청이 승인되었습니다. 자세한 내용은 첨부파일을 확인해주세요.',
    createdAt: '2024-01-15',
    updatedAt: '2025-07-30',
    useImage: true,
    sendEmail: false,
    sendAlarm: true,
  },
  {
    id: 2,
    title: '박람회 신청 승인 알림',
    content: '안녕하세요. 귀하의 박람회 신청이 승인되었습니다. 자세한 내용은 첨부파일을 확인해주세요.',
    createdAt: '2024-01-15',
    updatedAt: '2025-07-30',
    useImage: false,
    sendEmail: false,
    sendAlarm: true,
  },
  {
    id: 3,
    title: '박람회 신청 승인 알림',
    content: '안녕하세요. 귀하의 박람회 신청이 승인되었습니다. 자세한 내용은 첨부파일을 확인해주세요.',
    createdAt: '2024-01-15',
    updatedAt: '2025-07-30',
    useImage: true,
    sendEmail: true,
    sendAlarm: true,
  },
  {
    id: 4,
    title: '박람회 신청 승인 알림',
    content: '안녕하세요. 귀하의 박람회 신청이 승인되었습니다. 자세한 내용은 첨부파일을 확인해주세요.',
    createdAt: '2024-01-15',
    updatedAt: '2025-07-30',
    useImage: true,
    sendEmail: false,
    sendAlarm: true,
  },
  {
    id: 5,
    title: '박람회 신청 승인 알림',
    content: '안녕하세요. 귀하의 박람회 신청이 승인되었습니다. 자세한 내용은 첨부파일을 확인해주세요.',
    createdAt: '2024-01-15',
    updatedAt: '2025-07-30',
    useImage: true,
    sendEmail: false,
    sendAlarm: true,
  },
];

export default function MessageTemplateList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState('');

  const pageSize = 10;
  const pageInfo = {
    content: dummyTemplates,
    totalPages: 1,
    number: currentPage,
    size: pageSize,
    totalElements: dummyTemplates.length,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <main className={styles.container}>
      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="템플릿 검색..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FiSearch className={styles.searchIcon} />
          </div>
        </div>

        <Link to="/platform/admin/settingMessage/new">
          <button className={`${styles.actionBtn} ${styles.createButton}`}>
            <MdAddCircle className={styles.icon} />
            새 템플릿 생성
          </button>
        </Link>
      </div>

      <div className={styles.listSection}>
        {dummyTemplates.map((template) => (
          <Link key={template.id} to={`/platform/admin/settingMessage/${template.id}`}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{template.title}</h2>
              <p className={styles.cardContent}>{template.content}</p>
              <div className={styles.buttonRow}>
                <span className={template.useImage ? styles.tagActive : styles.tagInactive}>이미지 사용</span>
                <span className={template.sendEmail ? styles.tagActive : styles.tagInactive}>이메일 발송</span>
                <span className={template.sendAlarm ? styles.tagActive : styles.tagInactive}>알림 발송</span>
              </div>
              <div className={styles.metaRow}>
                <span>생성: {template.createdAt}</span>
                <span>수정: {template.updatedAt}</span>
              </div>
              <div className={styles.editRow}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/platform/admin/settingMessage/${template.id}/edit`);
                  }}
                  className={styles.editButton}
                >
                  편집
                </button>
                <button className={styles.deleteButton}>삭제</button>
              </div>
            </div>
          </Link>
        ))}
        <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
      </div>
    </main>
  );
}
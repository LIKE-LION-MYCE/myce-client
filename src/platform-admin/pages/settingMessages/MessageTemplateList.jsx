import React, { useEffect, useState } from 'react';
import styles from './MessageTemplateList.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../../common/components/pagination/Pagination';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { getMessageTemplateList } from '../../../api/service/system/settings/messageFormat/MessageFormatService';


const sendTypeOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'EMAIL', label: '이메일' },
  { value: 'NOTIFICATION', label: '알림' }
];

export default function MessageTemplateList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedSendType, setSelectedSendType] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    getMessageTemplateList(currentPage).then((res) => {
      console.log("success to get message templage");
      const data = res.data;
      console.log(data);
      setTemplates(data.templates);
      setTotalPages(data.totalPage);
    })
    .catch((err) => {
      console.log("Fail to get message templates.", err);
    })
  }, [currentPage]);

  // 발송 타입 결정
  const getSendType = (type) => {
    const res = sendTypeOptions.find((option) => option.value === type);
    return res.label || null; // 찾지 못했을 때 null 반환
  };

    // 테이블 행 클릭 핸들러
  const handleRowClick = (templateId) => {
    navigate(`/platform/admin/settingMessage/${templateId}`);
  };

  // 페이지네이션을 위한 템플릿 슬라이싱
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSendTypeSelect = (value) => {
    setSelectedSendType(value);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(0); // 검색 시 첫 페이지로
  };

  const selectedSendTypeLabel = sendTypeOptions.find(option => option.value === selectedSendType)?.label || '전체';

  return (
    <main className={styles.container}>
      {/* 검색 필터 */}
      <div className={styles.topControls}>
        <div className={styles.filters}>
          {/* 제목 검색 */}
          <div className={styles.filterGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="제목 검색..."
              value={searchText}
              onChange={handleSearchChange}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          {/* 발송 타입 드롭다운 */}
          <div className={styles.dropdown}>
            <button 
              className={styles.dropdownButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedSendTypeLabel}
              <FiChevronDown className={`${styles.chevronIcon} ${isDropdownOpen ? styles.rotated : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                {sendTypeOptions.map(option => (
                  <button
                    key={option.value}
                    className={`${styles.dropdownItem} ${selectedSendType === option.value ? styles.selected : ''}`}
                    onClick={() => handleSendTypeSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 결과 수 표시 */}
        <div className={styles.resultCount}>
          총 {templates.length}개 템플릿
        </div>
      </div>

      {/* 테이블 */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.headerCell}>발송 타입</th>
              <th className={styles.headerCell}>템플릿명</th>
              <th className={styles.headerCell}>메일 제목</th>
              <th className={styles.headerCell}>생성날짜</th>
              <th className={styles.headerCell}>수정날짜</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id} className={styles.tableRow} onClick={() => handleRowClick(template.id)}>
                <td className={styles.typeCell}>
                  <span className={`${styles.sendTypeBadge}`}>
                    {getSendType(template.channelType)}
                  </span>
                </td>
                <td className={styles.titleCell}>
                    {template.name}
                </td>
                <td className={styles.subjectCell}>
                  {template.subject}
                </td>
                <td className={styles.dateCell}>{template.createdAt}</td>
                <td className={styles.dateCell}>{template.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 데이터가 없을 때 */}
        {templates.length === 0 && (
          <div className={styles.emptyState}>
            <p>검색 조건에 맞는 템플릿이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination pageInfo={{totalPages, number: currentPage}} onPageChange={handlePageChange} />
        </div>
      )}
    </main>
  );
}
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './Emails.module.css';
import EmailTable from '../../components/emailTable/EmailTable';
import Pagination from '../../../common/commponents/pagination/Pagination';

function Emails() {
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageInfo, setPageInfo] = useState({
    content: [
      {
        subject: '박람회 안내 메일',
        body: '안녕하세요, 서울 스마트 모빌리티 엑스포에 참여해주셔서 감사합니다. 본 메일은 안내 목적으로 발송되었습니다. 진짜 졸려 뒤지기겠다 정말로요... 졸리지만 멈출완전 짜증난다 진짜 개졸리다 자면 6시일듯',
        recipients: 36,
        sentAt: '2025-08-01 14:23:45',
        fileName: 'expo_guide.pdf'
      },
      {
        subject: '이벤트 당첨자 발표',
        body: '축하드립니다! 귀하는 2025 엑스포 이벤트에 당첨되셨습니다. 자세한 사항은 첨부파일을 확인해주세요.',
        recipients: 12,
        sentAt: '2025-07-28 09:12:00',
        fileName: ''
      }
    ],
    totalPages: 1,
    totalElements: 2,
    size: 10,
    number: 0,
  });

  const handlePageChange = (page) => {
    setPageInfo((prev) => ({
      ...prev,
      number: page,
      content: prev.content,
    }));
  };

  const columns = [
    { key: 'subject', header: '제목' },
    { key: 'body', header: '내용' },
    { key: 'recipients', header: '총 수신자' },
    { key: 'sentAt', header: '발송일시' },
  ];

  return (
    <div className={styles.emailsWrapper}>
      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="제목 또는 내용 검색"
              className={styles.input}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={styles.select}
            >
              <option value="desc">최신순</option>
              <option value="asc">오래된순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <EmailTable columns={columns} data={pageInfo.content} />

      {/* 페이징 */}
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
    </div>
  );
}

export default Emails;

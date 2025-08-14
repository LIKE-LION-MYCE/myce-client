import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import styles from './Emails.module.css';
import EmailTable from '../../components/emailTable/EmailTable';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import { getMyEmails } from '../../../api/service/expo-admin/email/EmailService';

const columns = [
  { key: 'subject', header: '제목' },
  { key: 'content', header: '내용' },
  { key: 'recipientCount', header: '총 수신자' },
  { key: 'createdAt', header: '발송일시' },
];

function Emails() {
  const { expoId } = useParams();

  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const [pageInfo, setPageInfo] = useState({
    content: [],
    totalPages: 0,
    number: 0,  
    size: pageSize,
    totalElements: 0,
  });

  // 토스트
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  //이메일 목록 조회
  const fetchEmails = async () => {
    try {
      const keywordParam = searchText.trim() || undefined;

      const res = await getMyEmails(
        expoId,
        currentPage,
        pageSize,
        sortOrder,
        keywordParam
      );

      setPageInfo({
        content: res.content ?? [],
        totalPages: res.page?.totalPages ?? 0,
        number: res.page?.number ?? currentPage,
        size: res.page?.size ?? pageSize,
        totalElements: res.page?.totalElements ?? 0,
      });
    } catch (error) {
      triggerToastFail(error.message);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [expoId, currentPage, pageSize, sortOrder, searchText]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 성공 토스트
  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // 실패 토스트
  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  return (
    <div className={styles.emailsWrapper}>
      {/* 상단 필터 영역 */}
      <div className={styles.topControls}>
        <div className={styles.filters}>
          {/* 검색어 입력 */}
          <div className={styles.filterGroup}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(0);
              }}
              placeholder="제목 또는 내용 검색"
              className={styles.input}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          {/* 정렬 */}
          <div className={styles.filterGroup}>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(0);
              }}
              className={styles.select}
            >
              <option value="desc">최신순</option>
              <option value="asc">오래된순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <EmailTable
      columns={columns}
      data={pageInfo.content}
      numbered
      numberOffset={pageInfo.number * pageInfo.size}
      />

      {/* 페이징 */}
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />

      {/* 토스트 */}
      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default Emails;
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiSearch, FiXCircle, FiPlusCircle } from 'react-icons/fi';
import styles from './Booths.module.css';
import BoothTable from '../../components/boothTable/BoothTable';
import BoothSettingForm from '../../components/boothSettingForm/BoothSettingForm';
import Pagination from '../../../common/components/pagination/Pagination';
import { getBooths, deleteBooth } from '../../../api/service/expo-admin/BoothService';

function Booths() {
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [boothList, setBoothList] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const { expoId } = useParams();

  const fetchBooths = useCallback(async () => {
    if (!expoId) return;
    try {
      const response = await getBooths(expoId);

      // API 응답 구조에 유연하게 대처하기 위해 배열을 찾는 로직 추가
      let boothArray = [];
      if (response && Array.isArray(response.content)) {
        boothArray = response.content;
      } else if (response && Array.isArray(response)) {
        boothArray = response;
      } else if (response && response.result && Array.isArray(response.result.content)) {
        boothArray = response.result.content;
      }

      const formattedData = boothArray.map((booth) => ({
        ...booth,
        no: booth.id,
        // displayRank가 0이면 null로 처리하여 '순위 없음'으로 간주
        displayRank: booth.displayRank === 0 ? null : booth.displayRank,
      }));

      setBoothList(formattedData);
    } catch (error) {
      console.error('Failed to fetch booths:', error);
      setBoothList([]);
    }
  }, [expoId]);

  useEffect(() => {
    fetchBooths();
  }, [fetchBooths]);

  const [page, setPage] = useState(0);
  const size = 5;

  // DTO 필드(name, description)에 맞게 검색 로직 수정
  const filtered = boothList
    .filter(
      (b) =>
        (b.name && b.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (b.description && b.description.toLowerCase().includes(searchText.toLowerCase()))
    )
    // 정렬 로직 수정
    .sort((a, b) => {
      if (sortOrder === 'rank') {
        const rankA = a.displayRank;
        const rankB = b.displayRank;

        // 둘 다 순위가 없는 경우 (null)
        if (rankA === null && rankB === null) return b.id - a.id; // 최신순으로 정렬
        // A만 순위가 없는 경우
        if (rankA === null) return 1; // A를 뒤로
        // B만 순위가 없는 경우
        if (rankB === null) return -1; // B를 뒤로

        // 둘 다 순위가 있는 경우, 순위(숫자) 오름차순
        return rankA - rankB;
      }
      // 기본값 'latest'
      return b.id - a.id; // 최신순 (id 내림차순)
    });

  const pagedData = filtered.slice(page * size, (page + 1) * size);
  const pageInfo = {
    totalPages: Math.ceil(filtered.length / size),
    number: page,
  };

  const handleRowClick = (booth) => {
    setSelectedBooth(booth);
    // 폼이 있는 곳으로 스크롤
    const formElement = document.getElementById('booth-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setSelectedBooth(null);
  };

  const handleDelete = async (boothId) => {
    if (window.confirm('정말로 이 부스를 삭제하시겠습니까?')) {
      try {
        await deleteBooth(expoId, boothId);
        setShowDeleteToast(true);
        setTimeout(() => setShowDeleteToast(false), 5000);
        fetchBooths(); // 목록 새로고침
        if (selectedBooth && selectedBooth.id === boothId) {
          setSelectedBooth(null);
        }
      } catch (error) {
        console.error('Failed to delete booth:', error);
        alert(`부스 삭제 중 오류가 발생했습니다: ${error.message}`);
      }
    }
  };

  const handleFormSuccess = () => {
    fetchBooths(); // 목록만 새로고침하고 폼 내용은 유지
  };

  return (
    <div className={styles.boothsContainer}>
      {/* 참가 부스 목록 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>참가 부스 목록</h4>

        <div className={styles.topControls}>
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="부스명 또는 설명 검색"
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
                <option value="latest">최신순</option>
                <option value="rank">노출 순위 높은순</option>
              </select>
            </div>
          </div>
        </div>

        <BoothTable
          data={pagedData}
          onDelete={handleDelete}
          onRowClick={handleRowClick}
          showToast={showDeleteToast}
        />
        <Pagination pageInfo={pageInfo} onPageChange={setPage} />
      </div>

      {/* 부스 등록/수정 폼 */}
      <div id="booth-form-section" className={styles.section}>
        <div className={styles.formHeader}>
          <h4 className={styles.sectionTitle}>
            {selectedBooth ? '부스 수정' : '부스 등록'}
          </h4>
          {selectedBooth && (
            <button className={styles.registerNewBtn} onClick={handleCancelEdit}>
              <FiPlusCircle />
              <span>부스 등록</span>
            </button>
          )}
        </div>
        <BoothSettingForm
          key={selectedBooth ? selectedBooth.id : 'new'}
          initialData={selectedBooth}
          onSuccess={handleFormSuccess}
        />
      </div>
    </div>
  );
}

export default Booths;



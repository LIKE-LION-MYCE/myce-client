import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import styles from './Booths.module.css';
import BoothTable from '../../components/boothTable/BoothTable';
import BoothSettingForm from '../../components/boothSettingForm/BoothSettingForm';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import { usePermission } from '../../permission/PermissionContext';
import { getBooths, deleteBooth, updateBooth, registerBooth } from '../../../api/service/expo-admin/setting/BoothService';
import { getMyExpoInfo } from '../../../api/service/expo-admin/setting/ExpoInfoService';

function Booths() {
  const { expoId } = useParams();
  const { perm } = usePermission();
  const [boothList, setBoothList] = useState([]);
  const [filteredBoothList, setFilteredBoothList] = useState([]);
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('rank');
  const [toast, setToast] = useState(null);
  const [expoInfo, setExpoInfo] = useState(null);
  const size = 5;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const pageInfo = {
    totalPages: Math.ceil(filteredBoothList.length / size),
    number: page,
  };

  const fetchExpoInfo = useCallback(async () => {
    if (!expoId) return;
    try {
      const response = await getMyExpoInfo(expoId);
      setExpoInfo(response);
    } catch (error) {
      showToast('fail', '박람회 정보 로딩 실패: ' + error.message);
    }
  }, [expoId]);

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
      showToast('fail', error.message);
      setBoothList([]);
    }
  }, [expoId]);

  useEffect(() => {
    fetchExpoInfo();
    fetchBooths();
  }, [fetchExpoInfo, fetchBooths]);

  useEffect(() => {
    let processedList = [...boothList];

    // 검색 필터링
    if (searchText) {
      processedList = processedList.filter(
        (booth) =>
          (booth.name && booth.name.toLowerCase().includes(searchText.toLowerCase())) ||
          (booth.description && booth.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // 정렬
    processedList.sort((a, b) => {
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

    setFilteredBoothList(processedList);
    setPage(0); // 필터링이나 정렬 시 첫 페이지로 이동
  }, [boothList, sortOrder, searchText]);

  const handleAdd = async (booth) => {
    try {
      // 프리미엄 부스 순위 중복 체크
      if (expoInfo?.isPremium && booth.isPremium && booth.displayRank) {
        const isDuplicate = boothList.some(existingBooth => 
          existingBooth.isPremium && 
          existingBooth.displayRank === parseInt(booth.displayRank)
        );
        
        if (isDuplicate) {
          showToast('fail', `${booth.displayRank}위는 이미 다른 프리미엄 부스에서 사용중입니다.`);
          return false;
        }
      }

      await registerBooth(expoId, booth);
      showToast('success', '부스가 성공적으로 등록되었습니다.');
      fetchBooths();
      return true;
    } catch (error) {
      // 백엔드에서 오는 중복 순위 에러 처리
      if (error.message.includes('BOOTH_PREMIUM_RANK_DUPLICATED')) {
        showToast('fail', '이미 사용중인 프리미엄 부스 노출 순위입니다.');
      } else if (error.message.includes('BOOTH_PREMIUM_MAX_CAPACITY_REACHED')) {
        showToast('fail', '프리미엄 부스는 최대 3개까지만 등록할 수 있습니다.');
      } else if (error.message.includes('BOOTH_PREMIUM_RANK_REQUIRED')) {
        showToast('fail', '프리미엄 부스는 노출 순위가 필수입니다.');
      } else if (error.message.includes('BOOTH_PREMIUM_RANK_INVALID')) {
        showToast('fail', '프리미엄 부스 노출 순위는 1에서 3 사이여야 합니다.');
      } else {
        showToast('fail', error.message || '알 수 없는 오류가 발생했습니다.');
      }
      return false;
    }
  };

  const handleUpdate = async (updatedBooth) => {
    try {
      // 프리미엄 부스 순위 중복 체크
      if (expoInfo?.isPremium && updatedBooth.isPremium && updatedBooth.displayRank) {
        const isDuplicate = boothList.some(booth => 
          booth.id !== updatedBooth.id && 
          booth.isPremium && 
          booth.displayRank === parseInt(updatedBooth.displayRank)
        );
        
        if (isDuplicate) {
          showToast('fail', `${updatedBooth.displayRank}위는 이미 다른 프리미엄 부스에서 사용중입니다.`);
          return;
        }
      }

      await updateBooth(expoId, updatedBooth.id, updatedBooth);
      showToast('success', '부스가 성공적으로 수정되었습니다.');
      fetchBooths();
    } catch (error) {
      // 백엔드에서 오는 중복 순위 에러 처리
      if (error.message.includes('BOOTH_PREMIUM_RANK_DUPLICATED')) {
        showToast('fail', '이미 사용중인 프리미엄 부스 노출 순위입니다.');
      } else if (error.message.includes('BOOTH_PREMIUM_MAX_CAPACITY_REACHED')) {
        showToast('fail', '프리미엄 부스는 최대 3개까지만 등록할 수 있습니다.');
      } else if (error.message.includes('BOOTH_PREMIUM_RANK_REQUIRED')) {
        showToast('fail', '프리미엄 부스는 노출 순위가 필수입니다.');
      } else if (error.message.includes('BOOTH_PREMIUM_RANK_INVALID')) {
        showToast('fail', '프리미엄 부스 노출 순위는 1에서 3 사이여야 합니다.');
      } else {
        showToast('fail', error.message || '알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBooth(expoId, id);
      showToast('success', '부스가 성공적으로 삭제되었습니다.');
      fetchBooths();
    } catch (error) {
      showToast('fail', error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.boothsContainer}>
      {toast && toast.type === 'success' && <ToastSuccess message={toast.message} />}
      {toast && toast.type === 'fail' && <ToastFail message={toast.message} />}

      {/* 참가 부스 목록 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          참가 부스 목록 
          <span style={{fontSize: '12px', color: '#999', marginLeft: '8px', fontWeight: 'normal'}}>
            총 부스 수: {filteredBoothList.length}개
          </span>
        </h4>

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
          data={filteredBoothList.slice(page * size, page * size + size)}
          onUpdate={perm?.isBoothInfoUpdate ? handleUpdate : null}
          onDelete={perm?.isBoothInfoUpdate ? handleDelete : null}
          expoIsPremium={expoInfo?.isPremium}
          hasPermission={perm?.isBoothInfoUpdate}
        />
        <Pagination pageInfo={pageInfo} onPageChange={setPage} />
      </div>

      {/* 부스 등록 */}
      {perm?.isBoothInfoUpdate && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>부스 등록</h4>
          <BoothSettingForm onSubmit={handleAdd} expoIsPremium={expoInfo?.isPremium} />
        </div>
      )}
    </div>
  );
}

export default Booths;



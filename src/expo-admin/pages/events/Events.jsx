
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './Events.module.css';
import EventTable from '../../components/eventTable/EventTable';
import EventSettingForm from '../../components/eventSettingForm/EventSettingForm';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import { usePermission } from '../../permission/PermissionContext';
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from '../../../api/service/expo-admin/setting/EventService';
import { getMyExpoInfo } from '../../../api/service/expo-admin/setting/ExpoInfoService';

function Events() {
  const { expoId } = useParams();
  const { perm } = usePermission();
  const [eventList, setEventList] = useState([]);
  const [filteredEventList, setFilteredEventList] = useState([]);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedDate, setSelectedDate] = useState('');
  const [toast, setToast] = useState(null);
  const [expoInfo, setExpoInfo] = useState(null);
  const size = 4;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const pageInfo = {
    totalPages: Math.ceil(filteredEventList.length / size),
    number: page,
  };

  useEffect(() => {
    fetchEvents();
    fetchExpoInfo();
  }, [expoId]);

  const fetchExpoInfo = async () => {
    if (!expoId) return;
    try {
      const data = await getMyExpoInfo(expoId);
      setExpoInfo(data);
    } catch (error) {
      console.error('박람회 정보 로딩 실패:', error);
    }
  };

  useEffect(() => {
    let processedList = [...eventList];

    // 날짜 필터링
    if (selectedDate) {
      processedList = processedList.filter(
        (event) => event.eventDate === selectedDate
      );
    }

    // 정렬
    processedList.sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredEventList(processedList);
    setPage(0); // 필터링이나 정렬 시 첫 페이지로 이동
  }, [eventList, sortOrder, selectedDate]);

  const fetchEvents = async () => {
    try {
      const data = await getEvents(expoId);
      setEventList(data);
    } catch (error) {
      showToast('fail', error.message);
    }
  };

  const handleAdd = async (event) => {
    try {
      const payload = {
        ...event,
        startTime: event.startTime?.substring(0, 5),
        endTime: event.endTime?.substring(0, 5),
      };
      await addEvent(expoId, payload);
      showToast('success', '행사가 성공적으로 등록되었습니다.');
      fetchEvents();
      return true; // 성공 시 true 반환
    } catch (error) {
      showToast('fail', error.message || '알 수 없는 오류가 발생했습니다.');
      return false; // 실패 시 false 반환
    }
  };

  const handleUpdate = async (updatedEvent) => {
    try {
      const payload = {
        ...updatedEvent,
        startTime: updatedEvent.startTime?.substring(0, 5),
        endTime: updatedEvent.endTime?.substring(0, 5),
      };
      await updateEvent(expoId, updatedEvent.id, payload);
      showToast('success', '행사가 성공적으로 수정되었습니다.');
      fetchEvents();
    } catch (error) {
      showToast('fail', error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(expoId, id);
      showToast('success', '행사가 성공적으로 삭제되었습니다.');
      fetchEvents();
    } catch (error) {
      showToast('fail', error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.boothsContainer}>
      {toast && toast.type === 'success' && <ToastSuccess message={toast.message} />}
      {toast && toast.type === 'fail' && <ToastFail message={toast.message} />}

      {/* 안내 박스 */}
      <div className={styles.alertBox}>
        <FaInfoCircle className={styles.alertIcon} />
        <span className={styles.alertText}>
          <strong>안내 :</strong>&nbsp;
          모든 행사는 시작 1시간 전에 고객에게 푸시 알림이 자동 발송됩니다.
        </span>
      </div>

      {/* 행사 목록 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          행사 목록 
          <span style={{fontSize: '12px', color: '#999', marginLeft: '8px', fontWeight: 'normal'}}>
            총 행사 수: {filteredEventList.length}개
          </span>
        </h4>

        <div className={styles.topControls}>
          {/* 전체보기 버튼 */}
          <button
              onClick={() => setSelectedDate('')}
              className={styles.button}
            >
              전체 보기
            </button>
          {/* 날짜 선택 */}            
          <div className={styles.filterGroup}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
              min={expoInfo?.startDate ? expoInfo.startDate.split('T')[0] : undefined}
              max={expoInfo?.endDate ? expoInfo.endDate.split('T')[0] : undefined}
            />
          </div>
          {/* 정렬 */}
          <div className={styles.filterGroup}>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
              }}
              className={styles.select}
            >
              <option value="desc">최근 일정순</option>
              <option value="asc">과거 일정순</option>
            </select>
          </div>
        </div>

        <EventTable
          data={filteredEventList.slice(page * size, page * size + size)}
          onUpdate={perm?.isScheduleUpdate ? handleUpdate : null}
          onDelete={perm?.isScheduleUpdate ? handleDelete : null}
          expoStartDate={expoInfo?.startDate}
          expoEndDate={expoInfo?.endDate}
          hasPermission={perm?.isScheduleUpdate}
        />
        <Pagination pageInfo={pageInfo} onPageChange={setPage} />
      </div>

      {/* 행사 등록 */}
      {perm?.isScheduleUpdate && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>행사 등록</h4>
          <EventSettingForm 
            onSubmit={handleAdd} 
            expoStartDate={expoInfo?.startDate}
            expoEndDate={expoInfo?.endDate}
          />
        </div>
      )}
    </div>
  );
}

export default Events;
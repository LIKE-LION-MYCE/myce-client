
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './Events.module.css';
import EventTable from '../../components/eventTable/EventTable';
import EventSettingForm from '../../components/eventSettingForm/EventSettingForm';
import Pagination from '../../../common/components/pagination/Pagination';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from '../../../api/service/expo-admin/setting/EventService';

function Events() {
  const { expoId } = useParams();
  const [eventList, setEventList] = useState([]);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [totalElements, setTotalElements] = useState(0);
  const [toast, setToast] = useState(null);
  const size = 4;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const pageInfo = {
    totalPages: Math.ceil(totalElements / size),
    number: page,
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page, sortOrder]);

  const fetchEvents = async () => {
    try {
      const data = await getEvents(expoId);
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.eventDate);
        const dateB = new Date(b.eventDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setEventList(sorted);
      setTotalElements(sorted.length);
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
      setPage(0);
      fetchEvents(0);
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
      fetchEvents(page);
    } catch (error) {
      showToast('fail', error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(expoId, id);
      showToast('success', '행사가 성공적으로 삭제되었습니다.');
      fetchEvents(page);
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
        <h4 className={styles.sectionTitle}>행사 목록</h4>

        <div className={styles.topControls}>
          <div className={styles.filterGroup}>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(0);
              }}
              className={styles.select}
            >
              <option value="desc">최근 일정순</option>
              <option value="asc">과거 일정순</option>
            </select>
          </div>
        </div>

        <EventTable
          data={eventList.slice(page * size, page * size + size)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <Pagination pageInfo={pageInfo} onPageChange={setPage} />
      </div>

      {/* 행사 등록 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>행사 등록</h4>
        <EventSettingForm onSubmit={handleAdd} />
      </div>
    </div>
  );
}

export default Events;
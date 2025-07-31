import { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './Events.module.css';
import EventTable from '../../components/eventTable/EventTable';
import EventSettingForm from '../../components/eventSettingForm/EventSettingForm';
import Pagination from '../../../common/commponents/pagination/Pagination';

const dummyDB = [
  {
    id: 1,
    eventName: '2025 스마트 모빌리티 엑스포',
    eventLocation: '서울 코엑스 A홀',
    eventDate: '2025-09-10',
    eventTimeStart: '10:00',
    eventTimeEnd: '17:00',
    eventDescription: '스마트 모빌리티 관련 최신 기술을 소개하는 박람회입니다.',
    managerName: '김민준',
    managerPhone: '010-1234-5678',
    managerEmail: 'minjun.kim@expo.com',
  },
  {
    id: 2,
    eventName: '2025 푸드테크 박람회',
    eventLocation: '부산 BEXCO 1전시장',
    eventDate: '2025-10-05',
    eventTimeStart: '09:30',
    eventTimeEnd: '18:00',
    eventDescription: '푸드테크와 지속가능한 식품 산업의 미래를 조망하는 행사입니다.',
    managerName: '이서연',
    managerPhone: '010-9876-5432',
    managerEmail: 'seoyeon.lee@foodexpo.kr',
  },
  {
    id: 3,
    eventName: 'K-AI 인공지능 컨퍼런스',
    eventLocation: '대전 컨벤션센터',
    eventDate: '2025-11-15',
    eventTimeStart: '10:00',
    eventTimeEnd: '16:00',
    eventDescription: 'AI 기술의 최신 트렌드와 실제 적용 사례를 공유합니다.',
    managerName: '박지훈',
    managerPhone: '010-5678-4321',
    managerEmail: 'jihun.park@k-ai.kr',
  },
  {
    id: 4,
    eventName: '2025 청년 창업 페어',
    eventLocation: '광주 김대중컨벤션센터',
    eventDate: '2025-08-20',
    eventTimeStart: '11:00',
    eventTimeEnd: '17:30',
    eventDescription: '전국 청년 창업가들이 모여 비즈니스 아이디어를 공유하는 자리입니다.',
    managerName: '최윤아',
    managerPhone: '010-2222-3333',
    managerEmail: 'yoona.choi@startupfair.kr',
  },
  {
    id: 5,
    eventName: '디지털 헬스케어 전시회',
    eventLocation: '인천 송도컨벤시아',
    eventDate: '2025-12-01',
    eventTimeStart: '10:00',
    eventTimeEnd: '18:00',
    eventDescription: '헬스케어와 디지털 기술이 융합된 혁신 제품들을 선보입니다.',
    managerName: '정우성',
    managerPhone: '010-4444-5555',
    managerEmail: 'woosung.jung@healthtechexpo.com',
  },
];

function Events() {
  const [eventList, setEventList] = useState([]);
  const [page, setPage] = useState(0);
  const size = 4;

  const pageInfo = {
    totalPages: Math.ceil(dummyDB.length / size),
    number: page,
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const fetchEvents = async (pageNum) => {
    // 실제 API 사용 시:
    // const res = await axios.get(`/api/events?page=${pageNum}&size=${size}`);
    // setEventList(res.data.content);

    const start = pageNum * size;
    const end = start + size;
    setEventList(dummyDB.slice(start, end));
  };

  // 추가
  const handleAdd = async (event) => {
    const newId = Math.max(...dummyDB.map((e) => e.id), 0) + 1;
    const newEvent = { ...event, id: newId };
    dummyDB.push(newEvent);

    fetchEvents(0); // 첫 페이지로 리셋
    setPage(0);
  };

  // 수정
  const handleUpdate = async (updatedEvent) => {
    const index = dummyDB.findIndex((e) => e.id === updatedEvent.id);
    if (index !== -1) {
      dummyDB[index] = updatedEvent;
      fetchEvents(page);
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    const index = dummyDB.findIndex((e) => e.id === id);
    if (index !== -1) {
      dummyDB.splice(index, 1);
      fetchEvents(page);
    }
  };

  return (
    <div className={styles.boothsContainer}>
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
        <EventTable
          data={eventList}
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
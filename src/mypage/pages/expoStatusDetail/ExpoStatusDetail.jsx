import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ExpoApplicationDetail from '../../components/expoApplicationDetail/ExpoApplicationDetail';
import styles from './ExpoStatusDetail.module.css';

// 모든 mock 데이터를 가져옵니다.
const mockExpoDetails = [
  {
    id: 1,
    name: '2025 AI 박람회',
    location: '서울 삼성 코엑스',
    capacity: 1000,
    startDate: '2025-09-01',
    endDate: '2025-09-03',
    startTime: '09:00',
    endTime: '18:00',
    postStartDate: '2025-08-01',
    postEndDate: '2025-09-05',
    isPremium: true,
    isPublic: true,
    category: 'IT',
    description: 'AI 기술을 주제로 한 대규모 박람회입니다.',
    registrationFee: '500,000원',
    recruitedTickets: '250개',
    expectedRevenue: '1,500만원',
    attachments: [
      { name: '사업계획서.pdf', url: '/files/plan.pdf' },
      { name: '부스_디자인.jpg', url: '/files/booth.jpg' },
    ],
    status: '결제대기',
    companyName: 'ABC 주식회사',
    companyAddress: '서울시 강남구 테헤란로 123',
    businessRegistrationNumber: '123-45-67890',
    ceoName: '홍길동',
    ceoContact: '010-1234-5678',
    ceoEmail: 'hong.gildong@abc.com',
    applicantName: '김철수',
    applicantContact: '010-9876-5432',
    applicantEmail: 'kim.chulsoo@abc.com',
  },
  {
    id: 2,
    name: '디지털 헬스케어 박람회',
    location: '부산 벡스코',
    capacity: 800,
    startDate: '2025-09-01',
    endDate: '2025-09-12',
    startTime: '10:00',
    endTime: '17:00',
    postStartDate: '2025-09-01',
    postEndDate: '2025-09-12',
    isPremium: false,
    isPublic: true,
    category: '의료/헬스케어',
    description: '디지털 헬스케어 관련 기술 및 제품을 전시합니다.',
    registrationFee: '400,000원',
    recruitedTickets: '150개',
    expectedRevenue: '1,000만원',
    attachments: [],
    status: '진행중',
    companyName: '건강 주식회사',
    companyAddress: '부산시 해운대구 센텀시티',
    businessRegistrationNumber: '987-65-43210',
    ceoName: '이영희',
    ceoContact: '010-3333-4444',
    ceoEmail: 'lee.yh@health.com',
    applicantName: '박수민',
    applicantContact: '010-5555-6666',
    applicantEmail: 'park.sm@health.com',
  },
  {
    id: 3,
    name: '2025 로봇산업 박람회',
    location: '일산 킨텍스',
    capacity: 1500,
    startDate: '2025-08-15',
    endDate: '2025-08-25',
    startTime: '10:00',
    endTime: '17:00',
    postStartDate: '2025-08-15',
    postEndDate: '2025-08-25',
    isPremium: true,
    isPublic: true,
    category: '로봇/IT',
    description: '최신 로봇 기술과 산업 동향을 소개합니다.',
    registrationFee: '600,000원',
    recruitedTickets: '300개',
    expectedRevenue: '2,000만원',
    attachments: [],
    status: '승인대기',
    companyName: '미래 로봇',
    companyAddress: '경기도 고양시 일산동구',
    businessRegistrationNumber: '111-22-33333',
    ceoName: '정철수',
    ceoContact: '010-9999-8888',
    ceoEmail: 'jung.cs@robot.com',
    applicantName: '정철수',
    applicantContact: '010-9999-8888',
    applicantEmail: 'jung.cs@robot.com',
  },
  {
    id: 4,
    name: '2025 뷰티엑스포',
    location: '서울 삼성 코엑스',
    capacity: 1200,
    startDate: '2025-06-20',
    endDate: '2025-07-05',
    startTime: '10:00',
    endTime: '19:00',
    postStartDate: '2025-06-20',
    postEndDate: '2025-07-05',
    isPremium: false,
    isPublic: true,
    category: '뷰티/패션',
    description: '뷰티 산업의 트렌드를 한눈에 볼 수 있는 박람회입니다.',
    registrationFee: '300,000원',
    recruitedTickets: '200개',
    expectedRevenue: '1,200만원',
    attachments: [],
    status: '종료됨',
    companyName: '뷰티월드',
    companyAddress: '서울시 강남구 압구정로',
    businessRegistrationNumber: '444-55-66666',
    ceoName: '한지수',
    ceoContact: '010-7878-5656',
    ceoEmail: 'han.js@beauty.com',
    applicantName: '한지수',
    applicantContact: '010-7878-5656',
    applicantEmail: 'han.js@beauty.com',
  },
  {
    id: 5,
    name: '2025 스마트팜 컨퍼런스',
    location: '대전 컨벤션센터',
    capacity: 700,
    startDate: '2025-10-10',
    endDate: '2025-10-15',
    startTime: '09:00',
    endTime: '17:00',
    postStartDate: '2025-10-10',
    postEndDate: '2025-10-15',
    isPremium: false,
    isPublic: true,
    category: '농업/스마트팜',
    description: '스마트팜 기술의 최신 동향을 공유하는 컨퍼런스입니다.',
    registrationFee: '200,000원',
    recruitedTickets: '100개',
    expectedRevenue: '800만원',
    attachments: [],
    status: '진행중',
    companyName: '그린 테크',
    companyAddress: '대전 유성구 대덕대로',
    businessRegistrationNumber: '777-88-99999',
    ceoName: '최유진',
    ceoContact: '010-1234-0000',
    ceoEmail: 'choi.yj@green.com',
    applicantName: '최유진',
    applicantContact: '010-1234-0000',
    applicantEmail: 'choi.yj@green.com',
  },
];


const ExpoStatusDetail = () => {
  const { id } = useParams();
  const [expoData, setExpoData] = useState(null);

  useEffect(() => {
    // URL 파라미터 id를 사용하여 해당 박람회 데이터를 찾습니다.
    const foundData = mockExpoDetails.find(data => data.id === parseInt(id));
    setExpoData(foundData);
  }, [id]);

  if (!expoData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ExpoApplicationDetail expoData={expoData} />
    </div>
  );
};

export default ExpoStatusDetail;

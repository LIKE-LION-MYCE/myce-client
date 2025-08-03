import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExpoApplicationDetail from '../../components/expoApplicationDetail/ExpoApplicationDetail';
import { mockExpoApplications } from '../expo-status/ExpoStatusPage';
import styles from './ExpoStatusDetail.module.css';

// mockExpoDetails를 확장된 데이터에 맞게 업데이트
const mockExpoDetails = mockExpoApplications.map(app => ({
  id: app.id,
  name: app.title,
  location: app.location,
  capacity: 1000,
  startDate: app.postPeriod.split('~')[0].trim().replace(/\./g, '-').slice(0, -1),
  endDate: app.postPeriod.split('~')[1].trim().replace(/\./g, '-').slice(0, -1),
  startTime: '09:00',
  endTime: '18:00',
  postStartDate: app.postPeriod.split('~')[0].trim().replace(/\./g, '-').slice(0, -1),
  postEndDate: app.postPeriod.split('~')[1].trim().replace(/\./g, '-').slice(0, -1),
  isPremium: app.id % 2 === 0,
  isPublic: true,
  category: 'IT',
  description: `${app.title}에 대한 상세 정보입니다.`,
  registrationFee: '500,000원',
  recruitedTickets: '250개',
  expectedRevenue: '1,500만원',
  attachments: [],
  status: app.status,
  companyName: 'ABC 주식회사',
  companyAddress: '서울시 강남구 테헤란로 123',
  businessRegistrationNumber: '123-45-67890',
  ceoName: '홍길동',
  ceoContact: '010-1234-5678',
  ceoEmail: 'hong.gildong@abc.com',
  applicantName: '김철수',
  applicantContact: '010-9876-5432',
  applicantEmail: 'kim.chulsoo@abc.com',
}));


const ExpoStatusDetail = () => {
  const { id } = useParams();
  const [expoData, setExpoData] = useState(null);

  useEffect(() => {
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

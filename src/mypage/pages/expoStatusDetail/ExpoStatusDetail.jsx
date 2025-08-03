import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExpoApplicationDetail from '../../components/expoApplicationDetail/ExpoApplicationDetail';
import PaymentWaitingModal from '../../components/paymentDetailModal/PaymentWaitingModal';
import { mockExpoApplications } from '../expo-status/ExpoStatusPage';
import styles from './ExpoStatusDetail.module.css';
import PaymentSelection from '../payment-selection/PaymentSelection';

// mockExpoDetails를 확장된 데이터에 맞게 업데이트
const mockExpoDetails = mockExpoApplications.map(app => ({
  id: app.id,
  name: app.title,
  location: app.location,
  capacity: 1000,
  // 날짜 형식 오류를 수정했습니다. .slice(0, -1)을 제거하여 'yyyy-MM-dd' 형식을 유지합니다.
  startDate: app.postPeriod.split('~')[0].trim().replace(/\./g, '-'),
  endDate: app.postPeriod.split('~')[1].trim().replace(/\./g, '-'),
  startTime: '09:00',
  endTime: '18:00',
  postStartDate: app.postPeriod.split('~')[0].trim().replace(/\./g, '-'),
  postEndDate: app.postPeriod.split('~')[1].trim().replace(/\./g, '-'),
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
  const [modalType, setModalType] = useState(null); // 'waiting' | null
  const [showPaymentSelection, setShowPaymentSelection] = useState(false); // 결제수단선택 페이지 표시 상태

  useEffect(() => {
    const foundData = mockExpoDetails.find(data => data.id === parseInt(id));
    setExpoData(foundData);
  }, [id]);

  const handleOpenModal = () => {
    setModalType('waiting');
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handlePay = () => {
    // 결제 버튼 클릭 시 결제수단선택 페이지로 이동
    setShowPaymentSelection(true);
    handleCloseModal();
  };

  if (!expoData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  if (showPaymentSelection) {
    // 박람회 결제이므로 paymentType="expo" prop과 함께 expoId를 전달합니다.
    return <PaymentSelection paymentType="expo" expoId={id} />;
  }

  return (
    <div className={styles.container}>
      <ExpoApplicationDetail
        expoData={expoData}
        onPayButtonClick={handleOpenModal}
      />

      {modalType === 'waiting' && (
        <PaymentWaitingModal
          expoName={expoData.name}
          applicant={expoData.applicantName}
          period={`${expoData.startDate} ~ ${expoData.endDate}`}
          amount={expoData.registrationFee}
          totalAmount={expoData.registrationFee}
          onPay={handlePay}
          onClose={handleCloseModal}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ExpoStatusDetail;

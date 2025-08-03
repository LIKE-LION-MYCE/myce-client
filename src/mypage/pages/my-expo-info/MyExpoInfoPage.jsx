// src/mainpage/pages/myPage/my-expo-info/MyExpoInfoPage.jsx
import ExpoApplicationDetail from '../../components/expoApplicationDetail/ExpoApplicationDetail'
import styles from './MyExpoInfoPage.module.css';

// MyInfoPage에서 mock 데이터를 정의
const mockExpoData = {
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
  // 상태 추가: "승인대기", "진행중", "종료됨", "정산완료", "결제대기" 중 하나
  status: '진행중',
};

const MyExpoInfoPage = () => {
  return (
    <div className={styles.container}>      
      {/* ExpoApplicationDetail 컴포넌트에 데이터를 props로 전달 */}
      <ExpoApplicationDetail expoData={mockExpoData} />
    </div>
  );
};

export default MyExpoInfoPage;
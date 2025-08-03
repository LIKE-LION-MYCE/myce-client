import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExpoStatusPage.module.css';

export const mockExpoApplications = [
  {
    id: 1,
    title: "2025 AI 박람회",
    applyDate: "2024-07-30",
    postPeriod: "2025.08.01 ~ 2025.09.05",
    location: "서울 삼성 코엑스",
    status: "결제대기",
  },
  {
    id: 2,
    title: "디지털 헬스케어 박람회",
    applyDate: "2024-08-01",
    postPeriod: "2025.09.01 ~ 2025.09.12",
    location: "부산 벡스코",
    status: "진행중",
  },
  {
    id: 3,
    title: "2025 로봇산업 박람회",
    applyDate: "2024-07-28",
    postPeriod: "2025.08.15 ~ 2025.08.25",
    location: "일산 킨텍스",
    status: "승인대기",
  },
  {
    id: 4,
    title: "2025 뷰티엑스포",
    applyDate: "2024-06-10",
    postPeriod: "2025.06.20 ~ 2025.07.05",
    location: "서울 삼성 코엑스",
    status: "종료됨",
  },
  {
    id: 5,
    title: "2025 스마트팜 컨퍼런스",
    applyDate: "2024-08-15",
    postPeriod: "2025.10.10 ~ 2025.10.15",
    location: "대전 컨벤션센터",
    status: "진행중",
  },
];

const ExpoStatusPage = () => {
  const navigate = useNavigate();

  const handleRowClick = (expo) => {
    // 라우팅 경로를 "expo-status/:id"에 맞게 수정합니다.
    navigate(`/mypage/expo-status/${expo.id}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>신청 박람회 현황</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>박람회명</th>
            <th>신청일</th>
            <th>게시 기간</th>
            <th>개최 장소</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {mockExpoApplications.map((expo) => (
            <tr key={expo.id} onClick={() => handleRowClick(expo)} className={styles.tableRow}>
              <td>{expo.id}</td>
              <td>{expo.title}</td>
              <td>{expo.applyDate}</td>
              <td>{expo.postPeriod}</td>
              <td>{expo.location}</td>
              <td>
                <span className={`${styles.statusBadge} ${styles[expo.status.replace(/\s/g, '')]}`}>
                  {expo.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpoStatusPage;

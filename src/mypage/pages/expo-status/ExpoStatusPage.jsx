import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExpoStatusPage.module.css';

// 한 페이지에 보여줄 항목 수
const ITEMS_PER_PAGE = 5;
// 페이지네이션 버튼 그룹에 보여줄 페이지 수
const PAGE_BTN_COUNT = 5;

// 더미 데이터: 첫 5개 항목이 각각 다른 상태를 가지도록 재배치
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
    status: "정산완료",
  },
  {
    id: 6,
    title: "2025 푸드테크 박람회",
    applyDate: "2024-08-20",
    postPeriod: "2025.11.01 ~ 2025.11.05",
    location: "서울 삼성 코엑스",
    status: "결제대기",
  },
  {
    id: 7,
    title: "친환경 건축 박람회",
    applyDate: "2024-08-22",
    postPeriod: "2025.10.20 ~ 2025.10.25",
    location: "부산 벡스코",
    status: "진행중",
  },
  {
    id: 8,
    title: "2025 게임쇼",
    applyDate: "2024-08-18",
    postPeriod: "2025.12.01 ~ 2025.12.04",
    location: "일산 킨텍스",
    status: "승인대기",
  },
  {
    id: 9,
    title: "2025 전기차 엑스포",
    applyDate: "2024-08-25",
    postPeriod: "2025.11.15 ~ 2025.11.18",
    location: "제주 국제컨벤션센터",
    status: "종료됨",
  },
  {
    id: 10,
    title: "2025 에듀테크 박람회",
    applyDate: "2024-08-05",
    postPeriod: "2025.09.10 ~ 2025.09.13",
    location: "서울 삼성 코엑스",
    status: "정산완료",
  },
  {
    id: 11,
    title: "2025 메타버스 컨퍼런스",
    applyDate: "2024-07-29",
    postPeriod: "2025.08.10 ~ 2025.08.12",
    location: "서울 삼성 코엑스",
    status: "결제대기",
  },
  {
    id: 12,
    title: "2025 핀테크 박람회",
    applyDate: "2024-08-12",
    postPeriod: "2025.10.05 ~ 2025.10.08",
    location: "일산 킨텍스",
    status: "진행중",
  },
];

const ExpoStatusPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowClick = (expo) => {
    navigate(`/mypage/expo-status/${expo.id}`);
  };

  // 현재 페이지에 표시할 항목 계산
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = mockExpoApplications.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(mockExpoApplications.length / ITEMS_PER_PAGE);

  // 페이지네이션 버튼 렌더링
  const renderPaginationButtons = () => {
    const pages = [];
    const startPage = Math.floor((currentPage - 1) / PAGE_BTN_COUNT) * PAGE_BTN_COUNT + 1;
    const endPage = Math.min(startPage + PAGE_BTN_COUNT - 1, totalPages);

    // 첫 페이지로 이동
    pages.push(
      <button key="first" onClick={() => setCurrentPage(1)} className={styles.pageButton} disabled={currentPage === 1}>
        «
      </button>
    );

    // 이전 페이지 그룹으로 이동
    pages.push(
      <button key="prev" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={styles.pageButton} disabled={currentPage === 1}>
        이전
      </button>
    );

    // 페이지 번호 버튼들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`${styles.pageButton} ${i === currentPage ? styles.activePage : ''}`}
        >
          {i}
        </button>
      );
    }

    // 다음 페이지 그룹으로 이동
    pages.push(
      <button key="next" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={styles.pageButton} disabled={currentPage === totalPages}>
        다음
      </button>
    );

    // 마지막 페이지로 이동
    pages.push(
      <button key="last" onClick={() => setCurrentPage(totalPages)} className={styles.pageButton} disabled={currentPage === totalPages}>
        »
      </button>
    );

    return pages;
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
          {currentItems.map((expo) => (
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
      {/* 페이지네이션 버튼 영역 */}
      <div className={styles.pagination}>
        {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default ExpoStatusPage;

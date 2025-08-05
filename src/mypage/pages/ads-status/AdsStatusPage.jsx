import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdsStatusPage.module.css";

// 더미 광고 데이터
export const ads = [
  {
    id: 1,
    status: "PENDING",
    title: "2024 AI 컨퍼런스 배너A",
    applicant: "이준호",
    period: "2024.08.10 ~ 2024.08.20",
    type: "배너A",
    company: "에이아이컴퍼니",
    contact: "010-2222-1111",
    email: "junho@ai.com",
    applyDate: "2024-07-30",
    description: "AI 컨퍼런스 홍보용 배너 신청",
    fileName: "ai-banner.png",
    imageUrl: "",
    expoUrl: "https://aiexpo.com/1",
  },
  {
    id: 2,
    status: "WAITING",
    title: "디지털 헬스케어 배너B",
    applicant: "박수민",
    period: "2024.09.01 ~ 2024.09.12",
    type: "배너B",
    company: "헬스테크",
    contact: "010-3333-4444",
    email: "sumin@healthtech.com",
    applyDate: "2024-08-01",
    description: "디지털 헬스케어 홍보용 배너",
    fileName: "health-banner.pdf",
    imageUrl: "",
    expoUrl: "https://healthexpo.com/2",
  },
  {
    id: 3,
    status: "ACTIVE",
    title: "2024 로봇산업 박람회",
    applicant: "정철수",
    period: "2024.08.15 ~ 2024.08.25",
    type: "배너C",
    company: "로봇월드",
    contact: "010-9999-8888",
    email: "csjung@robotworld.com",
    applyDate: "2024-07-28",
    description: "로봇산업 홍보용 메인배너",
    fileName: "robot-banner.jpg",
    imageUrl: "",
    expoUrl: "https://robotexpo.com/3",
  },
  {
    id: 4,
    status: "FINISHED",
    title: "2024 뷰티엑스포 배너D",
    applicant: "한지수",
    period: "2024.06.20 ~ 2024.07.05",
    type: "배너D",
    company: "뷰티존",
    contact: "010-7878-5656",
    email: "jisu@beautyzone.com",
    applyDate: "2024-06-10",
    description: "뷰티엑스포 홍보용 배너",
    fileName: "beauty-banner.docx",
    imageUrl: "",
    expoUrl: "https://beautyexpo.com/4",
  },
  {
    id: 5,
    status: "CANCELED",
    title: "2024 스마트팜 컨퍼런스",
    applicant: "최유진",
    period: "2024.10.10 ~ 2024.10.15",
    type: "배너E",
    company: "스마트팜연구소",
    contact: "010-1234-0000",
    email: "yujin@smartfarm.com",
    applyDate: "2024-08-15",
    description: "스마트팜 컨퍼런스 홍보",
    fileName: "smartfarm-banner.pdf",
    imageUrl: "",
    expoUrl: "https://smartfarmexpo.com/5",
  },
];

// 상태 라벨 및 스타일 맵
const STATUS_MAP = {
  PENDING: { label: "승인 대기", className: "pending" },
  WAITING: { label: "결제 대기중", className: "waiting" },
  ACTIVE: { label: "게시중", className: "active" },
  CANCELED: { label: "취소됨", className: "canceled" },
  FINISHED: { label: "종료됨", className: "finished" },
};

const ITEMS_PER_PAGE = 8;
const PAGE_BTN_COUNT = 5;

// 상세 페이지용 데이터 변환 함수
function convertAdToDetail(ad) {
  const [periodStart = "", periodEnd = ""] = ad.period
    ? ad.period.split("~").map((s) => s.trim())
    : ["", ""];
  return {
    imageUrl: ad.imageUrl,
    bannerName: ad.title,
    bannerType: ad.type,
    periodStart,
    periodEnd,
    expoUrl: ad.expoUrl,
    description: ad.description,
    fileName: ad.fileName,
    applicant: ad.applicant,
    contact: ad.contact,
    email: ad.email,
    company: ad.company,
    applyDate: ad.applyDate,
    // 필요시 추가 필드
  };
}

function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || { label: status, className: "" };
  return (
    <span className={`${styles.statusBadge} ${styles[info.className]}`}>
      {info.label}
    </span>
  );
}

function AdsTable({ data, onRowClick }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>제목</th>
            <th>신청자</th>
            <th>게시 기간</th>
            <th>배너 타입</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ad) => (
            <tr
              key={ad.id}
              className={styles.clickableRow}
              tabIndex={0}
              onClick={() => onRowClick(ad)}
              style={{ cursor: "pointer" }}
              aria-label={`${ad.title} 상세로 이동`}
            >
              <td>{ad.title}</td>
              <td>{ad.applicant}</td>
              <td>{ad.period}</td>
              <td>{ad.type}</td>
              <td>
                <StatusBadge status={ad.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const currentRange = Math.floor((currentPage - 1) / PAGE_BTN_COUNT);
  const startPage = currentRange * PAGE_BTN_COUNT + 1;
  const endPage = Math.min(startPage + PAGE_BTN_COUNT - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(startPage - 1)}
        disabled={startPage === 1}
        className={styles.pageBtn}
      >
        &laquo;
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageBtn}
      >
        이전
      </button>
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`${styles.pageBtn} ${
            num === currentPage ? styles.active : ""
          }`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageBtn}
      >
        다음
      </button>
      <button
        onClick={() => onPageChange(endPage + 1)}
        disabled={endPage === totalPages}
        className={styles.pageBtn}
      >
        &raquo;
      </button>
    </div>
  );
}

const AdsStatusPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageAds, setPageAds] = useState([]);
  const totalPages = Math.ceil(ads.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    setPageAds(ads.slice(startIdx, startIdx + ITEMS_PER_PAGE));
  }, [currentPage]);

  // 행 클릭 시 상세로 데이터 변환 후 전달
  const handleRowClick = (ad) => {
    navigate(`./${ad.id}`, {
      state: {
        adStatus: ad.status,
        adData: convertAdToDetail(ad),
      },
    });
  };

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>광고 현황</h2>
      <AdsTable data={pageAds} onRowClick={handleRowClick} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdsStatusPage;

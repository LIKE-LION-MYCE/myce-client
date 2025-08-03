import React, { useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import styles from './ExpoDetail.module.css';
import BoothModal from '../../components/modal/BoothModal';
import CancelFeeTable from '../../components/cancelfeetable/CancelFeeTable';

const boothData = [
  {
    id: 1,
    name: '테크버스 랩',
    company: '링딩동',
    location: 'A-4',
    description: '이 부스는 천안에서 시작해서... 영국을 건너...',
    imageUrl: 'https://placehold.co/400x600',
  },
  {
    id: 2,
    name: 'AI 부스',
    company: 'AI 주식회사',
    location: 'B-1',
    description: 'AI 기술을 활용한 솔루션을 소개합니다...',
    imageUrl: 'https://placehold.co/400x600',
  },
];

const reviewData = Array.from({ length: 25 }).map((_, index) => ({
  id: index + 1,
  name: `회원${index + 1}`,
  rating: (index % 5) + 1,
  content: `이것은 회원${index + 1}의 관람 후기입니다. 좋은 경험이었습니다!`,
  date: `2024.01.${25 - index}`,
}));

const tabs = ['상세 정보', '관람 후기', '장소 정보', '취소 수수료 안내'];

export default function ExpoDetail() {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [activeTab, setActiveTab] = useState('관람 후기');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const { expoId } = useParams();

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewData.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderTabContent = () => {
    switch (activeTab) {
      case '상세 정보':
        return (
          <section className={styles.detailSection}>
            <h3>행사 정보</h3>
            <p className={styles.description}>행사에 대한 상세 정보 영역입니다.</p>
            <h3>부스 정보</h3>
            <table className={styles.boothTable}>
              <thead>
                <tr>
                  <th>부스 이름</th>
                  <th>회사명</th>
                  <th>부스 위치</th>
                </tr>
              </thead>
              <tbody>
                {boothData.map((booth) => (
                  <tr key={booth.id} onClick={() => setSelectedBooth(booth)}>
                    <td>{booth.name}</td>
                    <td>{booth.company}</td>
                    <td>{booth.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case '관람 후기':
        return (
          <section className={styles.detailSection}>
            <h3>관람 후기</h3>
            {currentReviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <strong>{review.name} {'⭐️'.repeat(review.rating)}</strong>
                <p>{review.content}</p>
                <span className={styles.reviewDate}>{review.date}</span>
              </div>
            ))}
            <Link to={`/detail/${expoId}/write-review`}>
              <button className={styles.writeReview}>후기 작성</button>
            </Link>
            <div className={styles.pagination}>
              {Array.from({ length: Math.ceil(reviewData.length / reviewsPerPage) }, (_, i) => (
                <button key={i} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          </section>
        );
      case '장소 정보':
        return (
          <section className={styles.detailSection}>
            <h3>행사 장소</h3>
            <p className={styles.description}>행사 세부 장소 텍스트입니다 ~~~길 ~~호 ~~동</p>
            <div className={styles.map}>지도 API</div>
          </section>
        );
      case '취소 수수료 안내':
        return <section className={styles.detailSection}>
          <h3>취소 수수료 안내</h3>
          <CancelFeeTable />
        </section>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.headerSection}>
        <img
          src="https://cdn.getnews.co.kr/news/photo/202309/642737_352257_4815.jpg"
          alt="박람회 포스터"
          className={styles.poster}
        />
        <div className={styles.infoBox}>
          <h2 className={styles.title}>박람회 제목</h2>
          <p className={styles.location}>행사 위치 정보(API에서 받아올 수 있나요)</p>
          <p className={styles.date}>행사 기간 정보(????.??.?? ~ ?????.??.??)</p>
          <div className={styles.buttons}>
            <button className={styles.bookmark}>행사 찜하기</button>
            <button className={styles.chat}>1:1 채팅</button>
          </div>
          <div className={styles.ticketBox}>
            <label>
              티켓 이름
              <select>
                <option>[일반예매] Day 1</option>
              </select>
            </label>
            <label>
              티켓 수
              <div className={styles.counter}>
                <button>-</button>
                <span>2</span>
                <button>+</button>
              </div>
            </label>
            <p className={styles.price}>판매 가격: 20,000원</p>
            <Link to={`/detail/${expoId}/payment`}>
            <button className={styles.pay}>티켓 결제</button>
            </Link>
          </div>
        </div>
      </section>

      <nav className={styles.tabNav}>
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? styles.active : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      {renderTabContent()}

      <BoothModal booth={selectedBooth} onClose={() => setSelectedBooth(null)} />
    </div>
  );
}
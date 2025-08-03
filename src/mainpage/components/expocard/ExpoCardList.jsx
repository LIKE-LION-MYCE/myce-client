import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import styles from './ExpoCardList.module.css';
import { FiBookmark, FiBookmark as FiBookmarkFill } from 'react-icons/fi';

const initialExpoItems = [
  {
    id: 1,
    title: '2025 스마트테크 박람회',
    date: '2025.08.10 ~ 08.12',
    location: '코엑스 A홀',
    thumbnail: 'https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg',
    remain_ticket: '100장 남음',
    is_bookmark: false,
  },
  {
    id: 2,
    title: '2025 푸드 앤 비버리지 쇼',
    date: '2025.09.02 ~ 09.05',
    location: '킨텍스 제1전시장',
    thumbnail: 'https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg',
    remain_ticket: '12장 남음',
    is_bookmark: true,
  },
  {
    id: 3,
    title: '2025 글로벌 패션페어',
    date: '2025.10.15 ~ 10.18',
    location: '부산 BEXCO',
    thumbnail: 'https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg',
    remain_ticket: '매진 임박',
    is_bookmark: false,
  },
];

export default function ExpoCardList() {
  const [expoItems, setExpoItems] = useState(initialExpoItems);

  const toggleBookmark = (id) => {
    setExpoItems((prev) =>
      prev.map((expo) =>
        expo.id === id ? { ...expo, is_bookmark: !expo.is_bookmark } : expo
      )
    );
  };

  return (
    <div className={styles.grid}>
      {expoItems.map((expo) => (
        <div key={expo.id} className={styles.card}>
          <Link to={`/detail/${expo.id}`} className={styles.link}>
          <img src={expo.thumbnail} alt={expo.title} className={styles.thumbnail} />
          <div className={styles.overlay}>
            <h3 className={styles.title}>{expo.title}</h3>
            <p className={styles.remain}>{expo.remain_ticket}</p>
            <p className={styles.location}>{expo.location}</p>
            <p className={styles.date}>{expo.date}</p>
          </div>
          </Link>
          <button
            className={styles.bookmark}
            onClick={() => toggleBookmark(expo.id)}
            aria-label="즐겨찾기 토글"
          >
          {expo.is_bookmark ? (
            <FiBookmarkFill size={20} fill="white" />
          ) : (
            <FiBookmark size={20} />
          )}
        </button>
        </div>
      ))}
    </div>
  );
}

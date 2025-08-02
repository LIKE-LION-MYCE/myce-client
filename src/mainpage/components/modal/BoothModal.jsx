import React from 'react';
import styles from './BoothModal.module.css';

export default function BoothModal({ booth, onClose }) {
  if (!booth) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>×</button>
        <div className={styles.content}>
          <img src={booth.imageUrl} alt={booth.name} className={styles.image} />
          <div className={styles.info}>
            <h2>{booth.name}</h2>
            <p><strong>부스 위치</strong> {booth.location}</p>
            <p><strong>회사명</strong> {booth.company}</p>
            <p><strong>상세 설명</strong></p>
            <textarea value={booth.description} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}

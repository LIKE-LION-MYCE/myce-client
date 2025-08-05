// QRModal.js
import React from "react";
import styles from "./QRModal.module.css";

const qrDummyData = [
  {
    name: "김한수",
    qrUrl: "https://dummyimage.com/180x180/000/fff&text=QR",
  },
  {
    name: "박지민",
    qrUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=박지민",
  },
  {
    name: "최은영",
    qrUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=최은영",
  },
  {
    name: "이성준",
    qrUrl: "https://dummyimage.com/180x180/222/fff&text=QR+CODE",
  },
];

const QRModal = ({ open, onClose, qrImgUrl }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>입장 QR코드</h2>
        <div className={styles.content}>
          <div className={styles.qrBox}>
            <img src={qrImgUrl} alt="QR 코드" className={styles.qrImg} />
          </div>
          <div className={styles.desc}>행사 당일 이 QR코드를 제시해주세요</div>
          <button className={styles.saveBtn}>QR코드 저장</button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;

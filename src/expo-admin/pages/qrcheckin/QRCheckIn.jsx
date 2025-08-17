import React, { useState } from 'react';
import QRScannerComponent from '../../../components/qrScanner/QRScanner';
import styles from './QRCheckIn.module.css';

function QRCheckIn() {
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleOpenQRScanner = () => {
    setShowQRScanner(true);
  };

  const handleCloseQRScanner = () => {
    setShowQRScanner(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>QR 체크인</h1>
        <p>박람회 입장객의 QR 티켓을 스캔하여 체크인을 처리합니다.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.scanSection}>
          <div className={styles.scanIcon}>📱</div>
          <h2>QR 코드 스캔</h2>
          <p>입장객의 QR 티켓을 스캔하여 체크인하세요</p>
          <button
            type="button"
            className={styles.scanBtn}
            onClick={handleOpenQRScanner}
          >
            QR 스캔 시작
          </button>
        </div>

        <div className={styles.instructions}>
          <h3>체크인 안내</h3>
          <ul>
            <li>입장객이 제시하는 QR 코드를 카메라로 스캔합니다</li>
            <li>유효한 티켓인지 자동으로 확인됩니다</li>
            <li>체크인 완료 후 입장 허가 메시지가 표시됩니다</li>
            <li>이미 사용된 티켓은 재사용할 수 없습니다</li>
          </ul>
        </div>
      </div>

      {/* QR 스캐너 모달 */}
      {showQRScanner && (
        <QRScannerComponent onClose={handleCloseQRScanner} />
      )}
    </div>
  );
}

export default QRCheckIn;
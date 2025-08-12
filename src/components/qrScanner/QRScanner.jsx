import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import styles from './QRScanner.module.css';
import axios from 'axios';

const QRScannerComponent = ({ onClose }) => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (videoRef.current && isScanning) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleQRResult(result.data);
        },
        {
          onDecodeError: (error) => {
            // QR 코드를 찾지 못할 때는 조용히 무시
            console.debug('QR 코드 스캔 중...', error.message);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScannerRef.current.start();
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, [isScanning]);

  const handleQRResult = async (qrData) => {
    if (!isScanning) return;
    
    setIsScanning(false);
    setLoading(true);
    setError(null);

    try {
      // QR 데이터에서 토큰 추출 (UUID 형태라고 가정)
      const token = qrData.trim();
      
      // 먼저 QR 코드 검증
      const verifyResponse = await axios.post(`/api/qrcodes/token/${token}/verify`);
      
      if (!verifyResponse.data.valid) {
        setResult({
          success: false,
          message: verifyResponse.data.message,
          status: verifyResponse.data.status
        });
        return;
      }

      // 유효한 QR 코드라면 사용 처리 (JWT에서 자동으로 사용자 ID 추출)
      const useResponse = await axios.post(`/api/qrcodes/token/${token}/use`);

      if (useResponse.data.success) {
        setResult({
          success: true,
          message: useResponse.data.message,
          reserverName: verifyResponse.data.reserverName,
          expoTitle: verifyResponse.data.expoTitle,
          ticketTitle: verifyResponse.data.ticketTitle
        });
      } else {
        setResult({
          success: false,
          message: useResponse.data.message
        });
      }

    } catch (error) {
      console.error('QR 처리 중 오류:', error);
      
      let errorMessage = 'QR 코드 처리 중 오류가 발생했습니다.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = '유효하지 않은 QR 코드입니다.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || '잘못된 요청입니다.';
      }

      setResult({
        success: false,
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setError(null);
    setIsScanning(true);
  };

  const handleClose = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
    }
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>QR 코드 스캔</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {isScanning && !result && (
            <>
              <div className={styles.scannerContainer}>
                <video
                  ref={videoRef}
                  className={styles.video}
                  playsInline
                />
                <div className={styles.scanFrame}>
                  <div className={styles.corner}></div>
                  <div className={styles.corner}></div>
                  <div className={styles.corner}></div>
                  <div className={styles.corner}></div>
                </div>
              </div>
              <p className={styles.instruction}>
                QR 코드를 카메라에 비춰주세요
              </p>
            </>
          )}

          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>QR 코드 처리 중...</p>
            </div>
          )}

          {result && (
            <div className={styles.result}>
              <div className={`${styles.resultIcon} ${result.success ? styles.success : styles.error}`}>
                {result.success ? '✓' : '✗'}
              </div>
              <div className={styles.resultMessage}>
                {result.message}
              </div>
              
              {result.success && result.reserverName && (
                <div className={styles.reservationInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>예약자:</span>
                    <span className={styles.value}>{result.reserverName}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>전시회:</span>
                    <span className={styles.value}>{result.expoTitle}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>티켓:</span>
                    <span className={styles.value}>{result.ticketTitle}</span>
                  </div>
                </div>
              )}

              <div className={styles.resultActions}>
                <button 
                  className={styles.retryBtn} 
                  onClick={handleRetry}
                >
                  다시 스캔
                </button>
                <button 
                  className={styles.closeResultBtn} 
                  onClick={handleClose}
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerComponent;
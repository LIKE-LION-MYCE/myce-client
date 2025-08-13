import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import styles from './QRScanner.module.css';
import axios from '../../api/lib/axios';

const QRScannerComponent = ({ onClose }) => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyData, setVerifyData] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
      const verifyResponse = await axios.post('/qrcodes/verify', {
        token: token
      });
      
      if (!verifyResponse.data.valid) {
        setResult({
          success: false,
          message: verifyResponse.data.message,
          status: verifyResponse.data.status
        });
        return;
      }

      // 유효한 QR 코드라면 확인 다이얼로그 표시
      setVerifyData({
        token: token,
        reserverName: verifyResponse.data.reserverName,
        expoTitle: verifyResponse.data.expoTitle,
        ticketTitle: verifyResponse.data.ticketTitle,
        status: verifyResponse.data.status
      });
      setShowConfirmDialog(true);

    } catch (error) {
      console.error('QR 검증 중 오류:', error);
      
      let errorMessage = 'QR 코드 검증 중 오류가 발생했습니다.';
      
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

  const handleConfirmUse = async () => {
    if (!verifyData) return;
    
    setShowConfirmDialog(false);
    setLoading(true);

    try {
      // QR 코드 사용 처리
      const useResponse = await axios.post('/qrcodes/use', {
        token: verifyData.token
      });

      if (useResponse.data.success) {
        setResult({
          success: true,
          message: useResponse.data.message,
          ticketName: useResponse.data.ticketName,
          usedAt: useResponse.data.usedAt,
          reserverName: verifyData.reserverName,
          expoTitle: verifyData.expoTitle,
          ticketTitle: verifyData.ticketTitle
        });
      } else {
        setResult({
          success: false,
          message: useResponse.data.message
        });
      }

    } catch (error) {
      console.error('QR 사용 처리 중 오류:', error);
      
      let errorMessage = 'QR 코드 사용 처리 중 오류가 발생했습니다.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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

  const handleCancelUse = () => {
    setShowConfirmDialog(false);
    setVerifyData(null);
    setIsScanning(true);
  };

  const handleRetry = () => {
    setResult(null);
    setError(null);
    setVerifyData(null);
    setShowConfirmDialog(false);
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

          {showConfirmDialog && verifyData && (
            <div className={styles.confirmDialog}>
              <div className={styles.confirmIcon}>
                ℹ️
              </div>
              <div className={styles.confirmTitle}>
                QR 코드 정보 확인
              </div>
              <div className={styles.reservationInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>예약자:</span>
                  <span className={styles.value}>{verifyData.reserverName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>전시회:</span>
                  <span className={styles.value}>{verifyData.expoTitle}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>티켓:</span>
                  <span className={styles.value}>{verifyData.ticketTitle}</span>
                </div>
              </div>
              <div className={styles.confirmMessage}>
                이 QR 코드를 사용 처리하시겠습니까?
              </div>
              <div className={styles.confirmActions}>
                <button 
                  className={styles.cancelBtn} 
                  onClick={handleCancelUse}
                >
                  취소
                </button>
                <button 
                  className={styles.confirmBtn} 
                  onClick={handleConfirmUse}
                >
                  확인
                </button>
              </div>
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
              
              {result.success && result.ticketName && (
                <div className={styles.reservationInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>티켓:</span>
                    <span className={styles.value}>{result.ticketName}</span>
                  </div>
                  {result.usedAt && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>처리 시간:</span>
                      <span className={styles.value}>
                        {new Date(result.usedAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  )}
                  {result.reserverName && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>예약자:</span>
                      <span className={styles.value}>{result.reserverName}</span>
                    </div>
                  )}
                  {result.expoTitle && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>전시회:</span>
                      <span className={styles.value}>{result.expoTitle}</span>
                    </div>
                  )}
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
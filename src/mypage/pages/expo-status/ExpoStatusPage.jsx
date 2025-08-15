import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExpoStatusPage.module.css';
import { getMyExpos } from '../../../api/service/user/memberApi';
import PaymentDetailModal from '../../components/paymentDetailModal/PaymentDetailModal';

// 한 페이지에 보여줄 항목 수
const ITEMS_PER_PAGE = 5;
// 페이지네이션 버튼 그룹에 보여줄 페이지 수
const PAGE_BTN_COUNT = 5;


const ExpoStatusPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [expos, setExpos] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState(null);

  useEffect(() => {
    fetchMyExpos();
  }, [currentPage]);

  const fetchMyExpos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyExpos(currentPage - 1, ITEMS_PER_PAGE);
      const { content, totalPages: total } = response.data;
      
      // 백엔드 데이터를 프론트엔드 형식에 맞게 변환
      const transformedExpos = content.map(expo => ({
        id: expo.expoId,
        title: expo.title,
        applyDate: new Date(expo.createdAt).toLocaleDateString('ko-KR'),
        postPeriod: formatDateRange(expo.displayStartDate, expo.displayEndDate),
        location: expo.locationDetail ? `${expo.location} (${expo.locationDetail})` : expo.location,
        status: getStatusLabel(expo.status),
        statusKey: expo.status, // 원본 상태 키 저장
        isPremium: expo.isPremium
      }));
      
      setExpos(transformedExpos);
      setTotalPages(total);
    } catch (err) {
      console.error('신청 박람회 조회 실패:', err);
      setError('신청 박람회를 불러오는데 실패했습니다.');
      setExpos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate).toLocaleDateString('ko-KR');
    const end = new Date(endDate).toLocaleDateString('ko-KR');
    return `${start} ~ ${end}`;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING_APPROVAL': '승인 대기',
      'PENDING_PAYMENT': '결제 대기',
      'PENDING_PUBLISH': '게시 대기',
      'PENDING_CANCEL': '취소 대기',
      'PUBLISHED': '게시 중',
      'PUBLISH_ENDED': '게시 종료',
      'SETTLEMENT_REQUESTED': '정산 요청',
      'COMPLETED': '종료됨',
      'REJECTED': '승인 거절',
      'CANCELLED': '취소 완료'
    };
    return statusMap[status] || status;
  };

  // 상태에 따른 CSS 클래스 매핑
  const getStatusClass = (status) => {
    const statusClassMap = {
      'PENDING_APPROVAL': styles.승인대기,
      'PENDING_PAYMENT': styles.결제대기,
      'PENDING_PUBLISH': styles.게시대기,
      'PENDING_CANCEL': styles.취소대기,
      'PUBLISHED': styles.게시중,
      'PUBLISH_ENDED': styles.게시종료,
      'SETTLEMENT_REQUESTED': styles.정산요청,
      'COMPLETED': styles.종료됨,
      'REJECTED': styles.승인거절,
      'CANCELLED': styles.취소완료
    };
    return statusClassMap[status] || '';
  };

  // 결제 정보를 볼 수 있는 상태인지 확인하는 함수 (승인대기, 승인완료 제외)
  const canViewPaymentInfo = (statusKey) => {
    const excludedStatuses = [
      'PENDING_APPROVAL', // 승인대기
      'PENDING_PAYMENT'   // 승인완료 
    ];
    return !excludedStatuses.includes(statusKey);
  };

  // 결제 정보 버튼 클릭 핸들러
  const handlePaymentInfoClick = (e, expo) => {
    e.stopPropagation(); // 행 클릭 이벤트 방지
    
    // 기존 PaymentDetailModal 형식에 맞는 데이터
    const paymentData = {
      expoName: expo.title,
      applicant: '홍길동', // TODO: 실제 신청자 정보로 교체
      period: expo.postPeriod,
      totalDays: 30, // TODO: 실제 게시 일수로 교체
      dailyUsageFee: expo.isPremium ? 30000 : 20000,
      usageFeeAmount: expo.isPremium ? 900000 : 600000,
      depositAmount: expo.isPremium ? 300000 : 200000,
      totalAmount: expo.isPremium ? 1200000 : 800000,
      isPremium: expo.isPremium,
      commissionRate: 10
    };
    
    setSelectedPaymentData(paymentData);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPaymentData(null);
  };

  const handleRowClick = (expo) => {
    navigate(`/mypage/expo-status/${expo.id}`);
  };

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

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>신청 박람회 현황</h2>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>신청 박람회 현황</h2>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>신청 박람회 현황</h2>
      {expos.length > 0 ? (
        <>
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
              {expos.map((expo, index) => (
                <tr key={expo.id} onClick={() => handleRowClick(expo)} className={styles.tableRow}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td>
                    {expo.title}
                    {expo.isPremium && <span className={styles.premiumBadge}>프리미엄</span>}
                  </td>
                  <td>{expo.applyDate}</td>
                  <td>{expo.postPeriod}</td>
                  <td>{expo.location}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(expo.statusKey)}`}>
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
        </>
      ) : (
        <div className={styles.noData}>신청한 박람회가 없습니다.</div>
      )}
      
      {/* 결제 상세 정보 모달 */}
      {showPaymentModal && selectedPaymentData && (
        <PaymentDetailModal
          expoName={selectedPaymentData.expoName}
          applicant={selectedPaymentData.applicant}
          period={selectedPaymentData.period}
          totalDays={selectedPaymentData.totalDays}
          dailyUsageFee={selectedPaymentData.dailyUsageFee}
          usageFeeAmount={selectedPaymentData.usageFeeAmount}
          depositAmount={selectedPaymentData.depositAmount}
          totalAmount={selectedPaymentData.totalAmount}
          isPremium={selectedPaymentData.isPremium}
          commissionRate={selectedPaymentData.commissionRate}
          onClose={handleClosePaymentModal}
        >
          {/* 결제 버튼 없이 확인 버튼만 */}
          <button 
            className={styles.confirmBtn}
            onClick={handleClosePaymentModal}
          >
            확인
          </button>
        </PaymentDetailModal>
      )}
    </div>
  );
};

export default ExpoStatusPage;

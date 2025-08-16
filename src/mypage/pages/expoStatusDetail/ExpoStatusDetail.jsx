import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExpoApplicationDetail from '../../components/expoApplicationDetail/ExpoApplicationDetail';
import PaymentWaitingModal from '../../components/paymentDetailModal/PaymentWaitingModal';
import PaymentRefundModal from '../../components/paymentDetailModal/PaymentRefundModal';
import SettlementReceiptModal from '../../components/paymentDetailModal/SettlementReceiptModal';
import PaymentDetailModal from '../../components/paymentDetailModal/PaymentDetailModal';
import AdminInfoModal from '../../components/adminInfoModal/AdminInfoModal';
import SevenDayRuleModal from '../../components/sevenDayRuleModal/SevenDayRuleModal';
import styles from './ExpoStatusDetail.module.css';
import PaymentSelection from '../payment-selection/PaymentSelection';
import { getMyExpo, deleteMyExpo, getExpoRefundReceipt, getExpoRefundHistory, getExpoAdminCodes, requestExpoSettlement, getExpoSettlementReceipt, getExpoPaymentDetail, completeExpoPayment, requestExpoRefund } from '../../../api/service/user/memberApi';
import { useNavigate } from 'react-router-dom';

// 상태 라벨 매핑
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

// 날짜 포맷팅 함수
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('ko-KR');
};

// 시간을 문자열로 변환 (문자열이면 그대로 사용, 객체면 변환)
const formatTime = (time) => {
  if (!time) return 'N/A';
  
  // 이미 문자열 형식이면 그대로 반환 (HH:mm:ss → HH:mm)
  if (typeof time === 'string') {
    return time.substring(0, 5); // "09:00:00" → "09:00"
  }
  
  // 객체 형식인 경우 변환
  if (typeof time === 'object') {
    const hour = (time.hour > 23 || time.hour < 0) ? 9 : time.hour;
    const minute = (time.minute > 59 || time.minute < 0) ? 0 : time.minute;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
  
  return 'N/A';
};

// 큰 숫자 값들을 안전하게 처리
const safeNumber = (num, defaultValue = 0) => {
  if (typeof num !== 'number' || num > Number.MAX_SAFE_INTEGER || num < 0) {
    return defaultValue;
  }
  return num;
};


const ExpoStatusDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expoData, setExpoData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundData, setRefundData] = useState(null);
  const [showSettlementReceiptModal, setShowSettlementReceiptModal] = useState(false);
  const [settlementReceiptData, setSettlementReceiptData] = useState(null);
  const [paymentDetailData, setPaymentDetailData] = useState(null);
  const [showPaymentInfoModal, setShowPaymentInfoModal] = useState(false);
  const [paymentInfoData, setPaymentInfoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSevenDayRuleModal, setShowSevenDayRuleModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExpoDetail();
    }
  }, [id]);

  const fetchExpoDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyExpo(id);
      const data = response.data;
      
      // 프리미엄 디버깅을 위한 로그
      console.log('백엔드 데이터:', data);
      console.log('paymentInfo:', data.paymentInfo);
      
      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const transformedData = {
        id: safeNumber(data.expoId, 1),
        name: data.title || '박람회 제목 없음',
        location: data.locationDetail ? `${data.location} (${data.locationDetail})` : data.location || '장소 미정',
        capacity: safeNumber(data.maxReserverCount, 100),
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        startTime: formatTime(data.startTime),
        endTime: formatTime(data.endTime),
        postStartDate: data.displayStartDate || '',
        postEndDate: data.displayEndDate || '',
        isPremium: data.isPremium || false,
        isPublic: data.status === 'PUBLISHED',
        category: data.category || '카테고리 미정',
        description: data.description === 'string' ? '상세 설명이 없습니다.' : (data.description || '상세 설명이 없습니다.'),
        registrationFee: data.paymentInfo ? `${safeNumber(data.paymentInfo.deposit, 0).toLocaleString()}원` : 'N/A',
        recruitedTickets: data.tickets?.reduce((sum, ticket) => sum + safeNumber(ticket.totalQuantity, 0), 0) || 0,
        expectedRevenue: data.paymentInfo ? `${Math.floor(safeNumber(data.paymentInfo.totalAmount, 0) / 10000).toLocaleString()}만원` : 'N/A',
        attachments: [],
        status: getStatusLabel(data.status),
        companyName: data.businessInfo?.companyName === 'string' ? '회사명 미정' : (data.businessInfo?.companyName || '회사명 미정'),
        companyAddress: data.businessInfo?.address === 'string' ? '주소 미정' : (data.businessInfo?.address || '주소 미정'),
        businessRegistrationNumber: data.businessInfo?.businessRegistrationNumber === 'string' ? '사업자번호 미정' : (data.businessInfo?.businessRegistrationNumber || '사업자번호 미정'),
        ceoName: data.businessInfo?.ceoName === 'string' ? '대표자명 미정' : (data.businessInfo?.ceoName || '대표자명 미정'),
        ceoContact: data.businessInfo?.contactPhone === 'string' ? '연락처 미정' : (data.businessInfo?.contactPhone || '연락처 미정'),
        ceoEmail: data.businessInfo?.contactEmail === 'string' ? '이메일 미정' : (data.businessInfo?.contactEmail || '이메일 미정'),
        applicantName: data.businessInfo?.ceoName === 'string' ? '신청자명 미정' : (data.businessInfo?.ceoName || '신청자명 미정'),
        memberLoginId: data.memberLoginId || '로그인 ID 없음',
        thumbnailUrl: data.thumbnailUrl === 'string' ? null : data.thumbnailUrl,
        tickets: data.tickets?.map(ticket => ({
          ...ticket,
          price: safeNumber(ticket.price, 0),
          totalQuantity: safeNumber(ticket.totalQuantity, 0),
          name: ticket.name === 'string' ? '티켓명 미정' : ticket.name
        })) || [],
        paymentInfo: data.paymentInfo ? {
          ...data.paymentInfo,
          deposit: safeNumber(data.paymentInfo.deposit, 0),
          premiumDeposit: safeNumber(data.paymentInfo.premiumDeposit, 0),
          totalAmount: safeNumber(data.paymentInfo.totalAmount, 0),
          dailyUsageFee: safeNumber(data.paymentInfo.dailyUsageFee, 0),
          totalDay: safeNumber(data.paymentInfo.totalDay, 1)
        } : null
      };
      
      setExpoData(transformedData);
    } catch (err) {
      console.error('박람회 상세 정보 조회 실패:', err);
      setError('박람회 정보를 불러오는데 실패했습니다.');
      setExpoData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async () => {
    try {
      setLoading(true);
      const response = await getExpoPaymentDetail(id);
      console.log('getExpoPaymentDetail API 응답:', response.data);
      
      // premiumDepositAmount가 누락된 경우 expoData에서 가져와서 보완
      const enhancedPaymentData = {
        ...response.data,
        premiumDepositAmount: response.data.premiumDepositAmount || expoData?.paymentInfo?.premiumDeposit || 0
      };
      
      console.log('보완된 결제 데이터:', enhancedPaymentData);
      setPaymentDetailData(enhancedPaymentData);
      setModalType('waiting');
    } catch (err) {
      console.error('결제 정보 조회 실패:', err);
      alert('결제 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      
      // 결제 완료 API 호출 (실제 결제 API 대신)
      await completeExpoPayment(id);
      
      alert('결제가 완료되었습니다. 박람회 상태가 게시대기로 변경되었습니다.');
      
      // 상세 정보 다시 불러오기
      await fetchExpoDetail();
      
      handleCloseModal();
    } catch (err) {
      console.error('결제 완료 처리 실패:', err);
      alert('결제 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 관리자 정보 모달 열기 핸들러
  const handleOpenAdminModal = async () => {
    try {
      setLoading(true);
      const response = await getExpoAdminCodes(id);
      setAdminData(response.data);
      setShowAdminModal(true);
    } catch (err) {
      console.error('관리자 정보 조회 실패:', err);
      alert('관리자 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAdminModal = () => {
    setShowAdminModal(false);
    setAdminData(null);
  };

  // 박람회 취소 핸들러
  const handleCancelExpo = async () => {
    try {
      await deleteMyExpo(id);
      alert('박람회 신청이 취소되었습니다.');
      window.history.back(); // 이전 페이지로 돌아가기
    } catch (err) {
      console.error('박람회 취소 실패:', err);
      alert('박람회 취소에 실패했습니다.');
    }
  };

  // 환불 신청 모달 열기 핸들러
  const handleRefundButtonClick = async () => {
    try {
      setLoading(true);
      // CANCELLED 상태일 때는 실제 환불 내역 조회, 아니면 계산된 환불 정보 조회
      const response = expoData.status === '취소됨' || expoData.status === '취소 완료' 
        ? await getExpoRefundHistory(id) 
        : await getExpoRefundReceipt(id);
      setRefundData(response.data);
      setShowRefundModal(true);
    } catch (err) {
      console.error('환불 정보 조회 실패:', err);
      alert('환불 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 환불 모달 닫기 핸들러
  const handleCloseRefundModal = () => {
    setShowRefundModal(false);
    setRefundData(null);
  };

  // 환불 신청 핸들러
  const handleRefund = async (refundReason) => {
    try {
      setLoading(true);
      
      // 환불 신청 데이터 구성
      const refundRequest = {
        amount: refundData.refundAmount, // 환불 예정 금액
        reason: refundReason
      };
      
      await requestExpoRefund(id, refundRequest);
      alert('환불 신청이 완료되었습니다.');
      handleCloseRefundModal();
      // 상세 정보 다시 불러오기
      await fetchExpoDetail();
    } catch (err) {
      console.error('환불 신청 실패:', err);
      
      // 7일 규칙 위반 에러 처리 (RF003)
      if (err.response?.data?.errorCode === 'RF003') {
        handleCloseRefundModal(); // 환불 모달 닫기
        setShowSevenDayRuleModal(true); // 7일 규칙 모달 열기
      } else {
        alert('환불 신청에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 7일 규칙 모달 닫기 핸들러
  const handleCloseSevenDayRuleModal = () => {
    setShowSevenDayRuleModal(false);
  };

  // 정산 요청 핸들러 - 모달을 통해 은행 정보 입력 후 정산 신청
  const handleSettlementRequest = async () => {
    try {
      setLoading(true);
      const response = await getExpoSettlementReceipt(id);
      console.log('정산 내역 API 응답:', response.data);
      const transformedReceiptData = {
        expoTitle: response.data.expoTitle,
        settlementRequestDate: response.data.issueDate,
        totalRevenue: response.data.totalRevenue,
        fee: response.data.commissionAmount,
        finalSettlementAmount: response.data.netProfit,
        ticketSales: response.data.ticketSales,
        commissionRate: response.data.commissionRate,
        // 은행정보는 null (정산 신청 모드)
        bankName: null,
        bankAccount: null,
        receiverName: null,
      };
      setSettlementReceiptData(transformedReceiptData);
      setShowSettlementReceiptModal(true);
    } catch (err) {
      console.error('정산 내역 조회 실패:', err);
      alert('정산 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 정산 내역 확인 핸들러
  const handleSettlementReceiptClick = async () => {
    try {
      setLoading(true);
      const response = await getExpoSettlementReceipt(id);
      console.log('정산 내역 API 응답:', response.data);
      const transformedReceiptData = {
        expoTitle: response.data.expoTitle,
        settlementRequestDate: response.data.issueDate,
        totalRevenue: response.data.totalRevenue,
        fee: response.data.commissionAmount,
        finalSettlementAmount: response.data.netProfit,
        ticketSales: response.data.ticketSales,
        commissionRate: response.data.commissionRate,
        // 은행정보 추가
        bankName: response.data.bankName,
        bankAccount: response.data.bankAccount,
        receiverName: response.data.receiverName,
      };
      setSettlementReceiptData(transformedReceiptData);
      setShowSettlementReceiptModal(true);
    } catch (err) {
      console.error('정산 내역 조회 실패:', err);
      alert('정산 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 정산 내역 모달 닫기 핸들러
  const handleCloseSettlementReceiptModal = () => {
    setShowSettlementReceiptModal(false);
    setSettlementReceiptData(null);
  };

  // 실제 정산 신청 처리 핸들러
  const handleActualSettlementRequest = async (bankInfo) => {
    try {
      setLoading(true);
      const settlementData = {
        receiverName: bankInfo.receiverName,
        bankName: bankInfo.bankName,
        bankAccount: bankInfo.bankAccount
      };
      
      await requestExpoSettlement(id, settlementData);
      alert('정산 요청이 완료되었습니다.');
      handleCloseSettlementReceiptModal();
      fetchExpoDetail(); // 상태 업데이트를 위해 데이터 다시 불러오기
    } catch (err) {
      console.error('정산 요청 실패:', err);
      alert('정산 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };


  // 결제 정보 조회 핸들러
  const handlePaymentInfoClick = async () => {
    try {
      setLoading(true);
      const response = await getExpoPaymentDetail(id);
      console.log('결제 정보 응답:', response.data);
      console.log('isPremium:', response.data.isPremium);
      console.log('depositAmount:', response.data.depositAmount);
      console.log('premiumDepositAmount:', response.data.premiumDepositAmount);
      setPaymentInfoData(response.data);
      setShowPaymentInfoModal(true);
    } catch (err) {
      console.error('결제 정보 조회 실패:', err);
      alert('결제 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 결제 정보 모달 닫기 핸들러
  const handleClosePaymentInfoModal = () => {
    setShowPaymentInfoModal(false);
    setPaymentInfoData(null);
  };

  // 관리자 페이지로 이동 핸들러
  const handleAdminPageClick = () => {
    navigate(`/expos/${id}/admin`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!expoData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  if (showPaymentSelection) {
    // 박람회 결제이므로 paymentType="expo" prop과 함께 expoId를 전달합니다.
    return <PaymentSelection paymentType="expo" expoId={id} />;
  }

  return (
    <div className={styles.container}>

      <ExpoApplicationDetail
        expoData={expoData}
        onPayButtonClick={handleOpenModal}
        onAdminInfoClick={handleOpenAdminModal}
        onCancelExpo={handleCancelExpo}
        onRefundButtonClick={handleRefundButtonClick}
        onSettlementRequestClick={handleSettlementRequest}
        onSettlementReceiptClick={handleSettlementReceiptClick}
        onPaymentInfoClick={handlePaymentInfoClick}
        onAdminPageClick={handleAdminPageClick}
      />

      {modalType === 'waiting' && paymentDetailData && (
        <>
          {console.log('ExpoStatusDetail - paymentDetailData:', paymentDetailData)}
          {console.log('ExpoStatusDetail - isPremium:', paymentDetailData.isPremium)}
          {console.log('ExpoStatusDetail - premiumDepositAmount:', paymentDetailData.premiumDepositAmount)}
        <PaymentWaitingModal
          expoName={paymentDetailData.expoTitle}
          applicant={paymentDetailData.applicantName}
          period={`${paymentDetailData.displayStartDate} ~ ${paymentDetailData.displayEndDate}`}
          totalDays={paymentDetailData.totalDays}
          dailyUsageFee={paymentDetailData.dailyUsageFee}
          usageFeeAmount={paymentDetailData.usageFeeAmount}
          depositAmount={paymentDetailData.depositAmount}
          premiumDepositAmount={paymentDetailData.premiumDepositAmount}
          totalAmount={paymentDetailData.totalAmount}
          isPremium={paymentDetailData.isPremium}
          commissionRate={paymentDetailData.commissionRate}
          onPay={handlePay}
          onClose={handleCloseModal}
          onCancel={handleCloseModal}
        />
        </>
      )}

      {/* 관리자 정보 모달 조건부 렌더링 */}
      {showAdminModal && adminData && (
        <AdminInfoModal
          adminName={expoData.memberLoginId}
          codesData={adminData}
          onClose={handleCloseAdminModal}
        />
      )}

      {/* 환불 신청 모달 조건부 렌더링 */}
      {showRefundModal && refundData && expoData && (
        <PaymentRefundModal
          expoName={refundData.expoTitle}
          applicant={refundData.applicantName}
          period={`${refundData.displayStartDate} ~ ${refundData.displayEndDate}`}
          totalDays={refundData.totalDays}
          dailyUsageFee={refundData.dailyUsageFee}
          depositAmount={refundData.depositAmount}
          totalUsageFee={refundData.totalUsageFee}
          totalAmount={refundData.totalAmount}
          isPremium={refundData.isPremium}
          refundRequestDate={refundData.refundRequestDate}
          usedDays={refundData.usedDays}
          usedAmount={refundData.usedAmount}
          remainingDays={refundData.remainingDays}
          refundAmount={refundData.refundAmount}
          status={refundData.status}
          refundReason={refundData.refundReason}
          onRefund={handleRefund}
          onClose={handleCloseRefundModal}
          onCancel={handleCloseRefundModal}
          readOnly={expoData.status === '취소됨' || expoData.status === '취소 완료'}
          isRefundCompleted={expoData.status === '취소됨' || expoData.status === '취소 완료'}
        />
      )}

      {/* 정산 내역 모달 조건부 렌더링 */}
      {showSettlementReceiptModal && settlementReceiptData && (
        <SettlementReceiptModal
          receiptData={settlementReceiptData}
          onClose={handleCloseSettlementReceiptModal}
          expoId={id}
          readOnly={expoData?.status === '정산요청' || expoData?.status === '정산 요청' || expoData?.status === 'SETTLEMENT_REQUESTED' || expoData?.status === '종료됨'}
          bankInfo={expoData?.status === '정산요청' || expoData?.status === '정산 요청' || expoData?.status === 'SETTLEMENT_REQUESTED' || expoData?.status === '종료됨' ? {
            bankName: settlementReceiptData?.bankName,
            bankAccount: settlementReceiptData?.bankAccount, 
            receiverName: settlementReceiptData?.receiverName
          } : null}
          onSettlementRequest={handleActualSettlementRequest}
        />
      )}

      {/* 결제 정보 모달 조건부 렌더링 */}
      {showPaymentInfoModal && paymentInfoData && (
        <PaymentDetailModal
          expoName={paymentInfoData.expoTitle}
          applicant={paymentInfoData.applicantName}
          period={`${paymentInfoData.displayStartDate} ~ ${paymentInfoData.displayEndDate}`}
          totalDays={paymentInfoData.totalDays}
          dailyUsageFee={paymentInfoData.dailyUsageFee}
          usageFeeAmount={paymentInfoData.usageFeeAmount}
          depositAmount={paymentInfoData.depositAmount}
          premiumDepositAmount={paymentInfoData.premiumDepositAmount}
          isPremium={paymentInfoData.isPremium}
          onClose={handleClosePaymentInfoModal}
        >
          <button 
            className={styles.confirmBtn}
            onClick={handleClosePaymentInfoModal}
          >
            확인
          </button>
        </PaymentDetailModal>
      )}

      {/* 7일 규칙 위반 모달 조건부 렌더링 */}
      {showSevenDayRuleModal && (
        <SevenDayRuleModal
          onClose={handleCloseSevenDayRuleModal}
        />
      )}

    </div>
  );
};

export default ExpoStatusDetail;

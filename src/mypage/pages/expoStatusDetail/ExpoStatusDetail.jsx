import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

// 상태 라벨 매핑 (i18n 적용)
const getStatusLabel = (status, t) => {
  return t(`expoStatus.status.${status}`) || status;
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
  const { t } = useTranslation();
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
      console.log('isPremium 원본 값:', data.isPremium);
      console.log('isPremium 타입:', typeof data.isPremium);
      console.log('상태:', data.status);
      
      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const transformedData = {
        id: safeNumber(data.expoId, 1),
        name: data.title || t('expoStatus.detail.defaultValues.noTitle'),
        location: data.locationDetail ? `${data.location} (${data.locationDetail})` : data.location || t('expoStatus.detail.defaultValues.noLocation'),
        capacity: safeNumber(data.maxReserverCount, 100),
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        startTime: formatTime(data.startTime),
        endTime: formatTime(data.endTime),
        postStartDate: data.displayStartDate || '',
        postEndDate: data.displayEndDate || '',
        isPremium: Boolean(data.isPremium),
        isPublic: data.status === 'PUBLISHED',
        category: data.category || t('expoStatus.detail.defaultValues.noCategory'),
        description: data.description === 'string' ? t('expoStatus.detail.defaultValues.noDescription') : (data.description || t('expoStatus.detail.defaultValues.noDescription')),
        registrationFee: data.paymentInfo ? `${safeNumber(data.paymentInfo.deposit, 0).toLocaleString()}원` : 'N/A',
        recruitedTickets: data.tickets?.reduce((sum, ticket) => sum + safeNumber(ticket.totalQuantity, 0), 0) || 0,
        expectedRevenue: data.paymentInfo ? `${Math.floor(safeNumber(data.paymentInfo.totalAmount, 0) / 10000).toLocaleString()}만원` : 'N/A',
        attachments: [],
        status: data.status, // 원본 status 값을 전달
        companyName: data.businessInfo?.companyName === 'string' ? t('expoStatus.detail.defaultValues.noCompanyName') : (data.businessInfo?.companyName || t('expoStatus.detail.defaultValues.noCompanyName')),
        companyAddress: data.businessInfo?.address === 'string' ? t('expoStatus.detail.defaultValues.noAddress') : (data.businessInfo?.address || t('expoStatus.detail.defaultValues.noAddress')),
        businessRegistrationNumber: data.businessInfo?.businessRegistrationNumber === 'string' ? t('expoStatus.detail.defaultValues.noBusinessNumber') : (data.businessInfo?.businessRegistrationNumber || t('expoStatus.detail.defaultValues.noBusinessNumber')),
        ceoName: data.businessInfo?.ceoName === 'string' ? t('expoStatus.detail.defaultValues.noCeoName') : (data.businessInfo?.ceoName || t('expoStatus.detail.defaultValues.noCeoName')),
        ceoContact: data.businessInfo?.contactPhone === 'string' ? t('expoStatus.detail.defaultValues.noContact') : (data.businessInfo?.contactPhone || t('expoStatus.detail.defaultValues.noContact')),
        ceoEmail: data.businessInfo?.contactEmail === 'string' ? t('expoStatus.detail.defaultValues.noEmail') : (data.businessInfo?.contactEmail || t('expoStatus.detail.defaultValues.noEmail')),
        applicantName: data.businessInfo?.ceoName === 'string' ? t('expoStatus.detail.defaultValues.noApplicant') : (data.businessInfo?.ceoName || t('expoStatus.detail.defaultValues.noApplicant')),
        memberLoginId: data.memberLoginId || t('expoStatus.detail.defaultValues.noLoginId'),
        thumbnailUrl: data.thumbnailUrl === 'string' ? null : data.thumbnailUrl,
        tickets: data.tickets?.map(ticket => ({
          ...ticket,
          price: safeNumber(ticket.price, 0),
          totalQuantity: safeNumber(ticket.totalQuantity, 0),
          name: ticket.name === 'string' ? t('expoStatus.detail.defaultValues.noTicketName') : ticket.name
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
      setError(t('expoStatus.detail.error'));
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
      alert(t('expoStatus.detail.messages.paymentInfoError'));
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
      
      alert(t('expoStatus.detail.messages.paymentCompleted'));
      
      // 상세 정보 다시 불러오기
      await fetchExpoDetail();
      
      handleCloseModal();
    } catch (err) {
      console.error('결제 완료 처리 실패:', err);
      alert(t('expoStatus.detail.messages.paymentFailed'));
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
      alert(t('expoStatus.detail.messages.adminInfoError'));
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
      alert(t('expoStatus.detail.messages.expoCancelled'));
      window.history.back(); // 이전 페이지로 돌아가기
    } catch (err) {
      console.error('박람회 취소 실패:', err);
      alert(t('expoStatus.detail.messages.expoCancelFailed'));
    }
  };

  // 환불 신청 모달 열기 핸들러
  const handleRefundButtonClick = async () => {
    try {
      setLoading(true);
      console.log('디버그 - 현재 status:', expoData.status);
      console.log('디버그 - 취소 상태 체크:', expoData.status === '취소됨' || expoData.status === '취소 완료' || expoData.status === 'CANCELLED');
      
      // CANCELLED 또는 PENDING_CANCEL 상태일 때는 실제 환불 내역 조회, 아니면 계산된 환불 정보 조회
      const isCancelledOrPending = expoData.status === '취소됨' || expoData.status === '취소 완료' || 
                                   expoData.status === 'CANCELLED' || expoData.status === 'PENDING_CANCEL' || 
                                   expoData.status === '취소대기' || expoData.status === '취소 대기';
      const response = isCancelledOrPending
        ? await getExpoRefundHistory(id) 
        : await getExpoRefundReceipt(id);
      console.log('디버그 - API 응답:', response.data);
      setRefundData(response.data);
      setShowRefundModal(true);
    } catch (err) {
      console.error('환불 정보 조회 실패:', err);
      alert(t('expoStatus.detail.messages.refundInfoError'));
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
      alert(t('expoStatus.detail.messages.refundCompleted'));
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
        alert(t('expoStatus.detail.messages.refundFailed'));
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
      alert(t('expoStatus.detail.messages.settlementInfoError'));
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
      alert(t('expoStatus.detail.messages.settlementInfoError'));
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
      alert(t('expoStatus.detail.messages.settlementCompleted'));
      handleCloseSettlementReceiptModal();
      fetchExpoDetail(); // 상태 업데이트를 위해 데이터 다시 불러오기
    } catch (err) {
      console.error('정산 요청 실패:', err);
      alert(t('expoStatus.detail.messages.settlementFailed'));
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
      alert(t('expoStatus.detail.messages.paymentInfoError'));
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
        <div className={styles.loading}>{t('expoStatus.detail.loading')}</div>
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
        <div className={styles.loading}>{t('expoStatus.detail.notFound')}</div>
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
      {showRefundModal && refundData && expoData && (() => {
        const isCancelled = expoData.status === '취소됨' || expoData.status === '취소 완료' || expoData.status === 'CANCELLED' || expoData.status === 'PENDING_CANCEL' || expoData.status === '취소대기' || expoData.status === '취소 대기';
        console.log('디버그 - 모달 렌더링 시 readOnly:', isCancelled, 'status:', expoData.status);
        return (
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
          readOnly={isCancelled}
          isRefundCompleted={isCancelled}
        />
        );
      })()}

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
            {t('expoStatus.modal.confirm')}
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

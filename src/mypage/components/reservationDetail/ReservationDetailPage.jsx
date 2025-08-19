import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./ReservationDetailPage.module.css";
import settingStyles from "../../../expo-admin/pages/setting/Setting.module.css";
import QRModal from "../qrModal/QRModal";
import RefundModal from "../refundModal/RefundModal";
import PhoneInput from "../../../common/components/phoneInput/PhoneInput";
import { getReservationDetail, updateReservers } from "../../../api/service/reservation/reservationApi";

const ReservationDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMembers, setEditMembers] = useState([]);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrImgUrl, setQrImgUrl] = useState("");
  const [selectedReserver, setSelectedReserver] = useState(null);
  
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReservationDetail();
    }
  }, [id]);

  const fetchReservationDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReservationDetail(id);
      const data = response.data;
      
      setReservationData(data);
      setEditMembers(data.reserverInfos || []);
    } catch (err) {
      console.error('예약 상세 조회 실패:', err);
      setError(t('reservationDetail.loadError'));
      setReservationData(null);
    } finally {
      setLoading(false);
    }
  };

  // 편집 시작
  const handleEdit = () => setIsEditMode(true);

  // 편집 취소
  const handleCancel = () => {
    setEditMembers(reservationData?.reserverInfos || []);
    setIsEditMode(false);
  };

  // 편집 저장
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API에 맞게 데이터 변환
      const updateData = editMembers.map(member => ({
        reserverId: member.reserverId,
        name: member.name,
        gender: member.gender,
        phone: member.phone,
        email: member.email
      }));
      
      await updateReservers(id, updateData);
      
      // 저장 성공 시 원본 데이터 업데이트
      setReservationData(prev => ({
        ...prev,
        reserverInfos: [...editMembers]
      }));
      
      setIsEditMode(false);
      alert(t('reservationDetail.updateSuccess'));
      
    } catch (err) {
      console.error('참여 인원 업데이트 실패:', err);
      setError(t('reservationDetail.updateError'));
      alert(t('reservationDetail.updateFailAlert'));
    } finally {
      setLoading(false);
    }
  };

  // 인풋 변경
  const handleChange = (idx, field, value) => {
    const updated = editMembers.map((m, i) =>
      i === idx ? { ...m, [field]: value } : m
    );
    setEditMembers(updated);
  };

  // QR 코드 접근 가능 기간 체크 함수
  const isExpoActive = () => {
    if (!reservationData?.expoInfo?.startDate || !reservationData?.expoInfo?.endDate) {
      return false;
    }
    
    const today = new Date();
    const startDate = new Date(reservationData.expoInfo.startDate);
    const endDate = new Date(reservationData.expoInfo.endDate);
    
    // 시간을 제거하고 날짜만 비교
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // QR 코드는 박람회 시작 2일 전부터 박람회 종료일까지 접근 가능
    const qrAvailableDate = new Date(startDate);
    qrAvailableDate.setDate(qrAvailableDate.getDate() - 2);
    
    return today >= qrAvailableDate && today <= endDate;
  };

  // 상세보기 버튼 클릭 시
  const handleQrOpen = (qrUrl, reserver) => {
    if (!isExpoActive()) {
      alert(t('reservationDetail.expoNotActive'));
      return;
    }
    setQrImgUrl(qrUrl);
    setSelectedReserver(reserver);
    setQrModalOpen(true);
  };


  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('ko-KR');
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} ~ ${end}`;
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    return `${startTime} ~ ${endTime}`;
  };

  // 티켓 타입 번역 변환
  const formatTicketType = (ticketType) => {
    const typeMap = {
      'GENERAL': t('reservationDetail.ticketTypes.general'),
      'EARLY_BIRD': t('reservationDetail.ticketTypes.earlyBird')
    };
    return typeMap[ticketType] || ticketType;
  };

  // 결제 방법 번역 변환
  const formatPaymentMethod = (method) => {
    const methodMap = {
      'CARD': t('reservationDetail.paymentMethods.card'),
      'BANK_TRANSFER': t('reservationDetail.paymentMethods.bankTransfer'),
      'VIRTUAL_ACCOUNT': t('reservationDetail.paymentMethods.virtualAccount'),
      'SIMPLE_PAY': t('reservationDetail.paymentMethods.simplePay')
    };
    return methodMap[method] || method;
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.mainBox}>
          <h2 className={styles.pageTitle}>{t('reservationDetail.title')}</h2>
          <div className={styles.loading}>{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  if (error || !reservationData) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.mainBox}>
          <h2 className={styles.pageTitle}>{t('reservationDetail.title')}</h2>
          <div className={styles.error}>{error || t('reservationDetail.notFound')}</div>
        </div>
      </div>
    );
  }

  const { expoInfo, reservationInfo, reserverInfos } = reservationData;
  
  // 예약이 취소된 상태인지 확인
  const isCancelled = reservationInfo?.status === 'CANCELLED';
  
  // 상태 라벨 매핑
  const getStatusLabel = (status) => {
    const statusMap = {
      'CONFIRMED': t('reservationDetail.statusLabels.confirmed'),
      'CANCELLED': t('reservationDetail.statusLabels.cancelled'),
      'CONFIRMED_PENDING': t('reservationDetail.statusLabels.pending')
    };
    return statusMap[status] || status;
  };
  
  // 상태별 뱃지 클래스 매핑
  const getStatusBadgeClass = (status) => {
    const statusClassMap = {
      'CONFIRMED': 'badgePUBLISHED',
      'CANCELLED': 'badgeCANCELLED', 
      'CONFIRMED_PENDING': 'badgePENDING_APPROVAL'
    };
    return statusClassMap[status] || 'badgePENDING_APPROVAL';
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
        <div className={styles.titleSection}>
          <h2 className={styles.pageTitle}>{t('reservationDetail.title')}</h2>
          {reservationInfo?.status && (
            <span className={`${settingStyles.badge} ${settingStyles[getStatusBadgeClass(reservationInfo.status)]} ${styles.statusBadge}`}>
              {getStatusLabel(reservationInfo.status)}
            </span>
          )}
        </div>

        <div className={styles.gridContainer}>
          {/* 상단 전체 - 참여 행사 정보 */}
          <section className={`${styles.gridSection} ${styles.fullWidthTop}`}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.subTitle}>{t('reservationDetail.eventInfo')}</h3>
            </div>
            <div className={styles.expoBox}>
              <img 
                src={expoInfo.thumbnailUrl || '/default-expo-image.jpg'} 
                alt="포스터" 
                className={styles.poster}
                onClick={() => navigate(`/detail/${expoInfo.expoId}`)}
                style={{ cursor: 'pointer' }}
              />
              <div>
                <div className={styles.expoTitle}>{expoInfo.title}</div>
                <div className={styles.grayDotList}>
                  <div>
                    <div className={styles.eventDate}>
                      ● {formatDateRange(expoInfo.startDate, expoInfo.endDate)}
                    </div>
                    <div className={styles.eventPlace}>
                      ● {expoInfo.location} {expoInfo.locationDetail && `(${expoInfo.locationDetail})`}
                    </div>
                    <div className={styles.eventTime}>
                      ● {formatTimeRange(expoInfo.startTime, expoInfo.endTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 중단 전체 - 참여 인원 */}
          <section className={`${styles.gridSection} ${styles.fullWidthMiddle}`}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.subTitle}>{t('reservationDetail.participants')}</h3>
              {!isEditMode ? (
                <button className={styles.editBtn} onClick={handleEdit}>
                  {t('reservationDetail.edit')}
                </button>
              ) : (
                <div className={styles.editActionGroup}>
                  <button className={styles.saveBtn} onClick={handleSave}>
                    {t('reservationDetail.save')}
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    {t('reservationDetail.cancel')}
                  </button>
                </div>
              )}
            </div>
            <table className={styles.memberTable}>
              <thead>
                <tr>
                  <th>{t('reservationDetail.table.name')}</th>
                  <th>{t('reservationDetail.table.reservationNumber')}</th>
                  <th>{t('reservationDetail.table.gender')}</th>
                  <th>{t('reservationDetail.table.phone')}</th>
                  <th>{t('reservationDetail.table.email')}</th>
                  <th>{t('reservationDetail.table.qrCheck')}</th>
                </tr>
              </thead>
              <tbody>
                {editMembers.map((member, idx) => (
                  <tr key={member.reserverId || idx}>
                    <td>
                      {isEditMode ? (
                        <input
                          value={member.name || ''}
                          onChange={(e) =>
                            handleChange(idx, "name", e.target.value)
                          }
                          className={styles.input}
                        />
                      ) : (
                        member.name || 'N/A'
                      )}
                    </td>
                    <td>{reservationInfo.reservationCode}</td>
                    <td>
                      {isEditMode ? (
                        <select
                          value={member.gender || ""}
                          onChange={(e) =>
                            handleChange(idx, "gender", e.target.value)
                          }
                          className={styles.input}
                          style={{ width: "70px" }}
                        >
                          <option value="">{t('reservationDetail.table.select')}</option>
                          <option value="MALE">{t('reservationDetail.table.male')}</option>
                          <option value="FEMALE">{t('reservationDetail.table.female')}</option>
                        </select>
                      ) : (
                        member.gender === 'MALE' ? t('reservationDetail.table.male') : member.gender === 'FEMALE' ? t('reservationDetail.table.female') : 'N/A'
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <PhoneInput
                          name={`phone-${idx}`}
                          value={member.phone || ''}
                          onChange={(e) =>
                            handleChange(idx, "phone", e.target.value)
                          }
                          showError={false}
                        />
                      ) : (
                        member.phone || 'N/A'
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <input
                          value={member.email || ''}
                          onChange={(e) =>
                            handleChange(idx, "email", e.target.value)
                          }
                          className={styles.input}
                        />
                      ) : (
                        member.email || 'N/A'
                      )}
                    </td>
                    <td>
                      <button
                        className={`${styles.qrBtn} ${(!isExpoActive() || isCancelled) ? styles.qrBtnDisabled : ''}`}
                        onClick={() => handleQrOpen(member.qrCodeUrl, member)}
                        disabled={!isExpoActive() || isCancelled}
                      >
                        {isCancelled ? t('reservationDetail.table.cancelled') : isExpoActive() ? t('reservationDetail.table.detail') : t('reservationDetail.table.outOfPeriod')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 좌하단 - 예매 정보 */}
          <section className={styles.gridSection}>
            <h3 className={styles.subTitle}>{t('reservationDetail.reservationInfo')}</h3>
            <div className={styles.reservationInfoGrid}>
              <div>
                <div className={styles.label}>{t('reservationDetail.reservationFields.reservationDate')}</div>
                <div>{formatDate(reservationInfo.createdAt)}</div>
              </div>
              <div>
                <div className={styles.label}>{t('reservationDetail.reservationFields.ticketName')}</div>
                <div>{reservationInfo.ticketName || 'N/A'}</div>
              </div>
              <div>
                <div className={styles.label}>{t('reservationDetail.reservationFields.ticketType')}</div>
                <div>{formatTicketType(reservationInfo.ticketType) || 'N/A'}</div>
              </div>
              <div>
                <div className={styles.label}>{t('reservationDetail.reservationFields.ticketCount')}</div>
                <div>{reservationInfo.quantity}{t('reservation.ticketUnit')}</div>
              </div>
              <div>
                <div className={styles.label}>{t('reservationDetail.reservationFields.unitPrice')}</div>
                <div>{reservationInfo.ticketPrice?.toLocaleString()}원</div>
              </div>
              <div>
                <div className={styles.label}>{t('reservationDetail.reservationFields.serviceFee')}</div>
                <div className={styles.feeText}>
                  {(reservationInfo.quantity * 1000).toLocaleString()}원
                </div>
              </div>
              <div>
                <div className={styles.label}>{t('reservationDetail.reservationFields.expectedPayment')}</div>
                <div className={styles.totalPriceText}>
                  {((reservationInfo.ticketPrice * reservationInfo.quantity) + (reservationInfo.quantity * 1000)).toLocaleString()}원
                </div>
              </div>
            </div>
          </section>

          {/* 우하단 - 결제 정보 */}
          {reservationData?.paymentInfo && (
            <section className={styles.gridSection}>
              <h3 className={styles.subTitle}>{t('reservationDetail.paymentInfo')}</h3>
              <div className={styles.paymentGrid}>
                <div>
                  <div className={styles.label}>{t('reservationDetail.paymentFields.paymentMethod')}</div>
                  <div>{formatPaymentMethod(reservationData.paymentInfo.paymentMethod)}</div>
                </div>
                {reservationData.paymentInfo.paymentDetail && (
                  <div>
                    <div className={styles.label}>{t('reservationDetail.paymentFields.paymentDetail')}</div>
                    <div>{reservationData.paymentInfo.paymentDetail}</div>
                  </div>
                )}
                <div>
                  <div className={styles.label}>{t('reservationDetail.paymentFields.totalAmount')}</div>
                  <div className={styles.priceText}>
                    {reservationData.paymentInfo.totalAmount?.toLocaleString()}원
                  </div>
                </div>
                {reservationData.paymentInfo.usedMileage > 0 && (
                  <div>
                    <div className={styles.label}>{t('reservationDetail.paymentFields.usedMileage')}</div>
                    <div className={styles.mileageUsed}>
                      -{reservationData.paymentInfo.usedMileage?.toLocaleString()}P
                    </div>
                  </div>
                )}
                <div>
                  <div className={styles.label}>{t('reservationDetail.paymentFields.savedMileage')}</div>
                  <div className={styles.mileageEarned}>
                    +{reservationData.paymentInfo.savedMileage?.toLocaleString()}P
                  </div>
                </div>
                {reservationData.paymentInfo.memberGrade && (
                  <>
                    <div>
                      <div className={styles.label}>{t('reservationDetail.paymentFields.memberGrade')}</div>
                      <div className={styles.gradeText}>
                        {reservationData.paymentInfo.memberGrade}
                      </div>
                    </div>
                    <div>
                      <div className={styles.label}>{t('reservationDetail.paymentFields.mileageRate')}</div>
                      <div>{(reservationData.paymentInfo.mileageRate * 100).toFixed(1)}%</div>
                    </div>
                  </>
                )}
                {reservationData.paymentInfo.paidAt && (
                  <div>
                    <div className={styles.label}>{t('reservationDetail.paymentFields.paidAt')}</div>
                    <div>{new Date(reservationData.paymentInfo.paidAt).toLocaleString('ko-KR')}</div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
        
        {/* 예약 취소 버튼 (맨 하단, 가운데) */}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
        >
          <button 
            className={`${styles.neutralCancelBtn} ${isCancelled ? styles.disabledBtn : ''}`}
            onClick={() => setIsRefundModalOpen(true)}
            disabled={isCancelled}
          >
            {isCancelled ? t('reservationDetail.cancelCompleted') : t('reservationDetail.cancelButton')}
          </button>
        </div>
      </div>
      </div>

      <QRModal
        open={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setSelectedReserver(null);
        }}
        qrImgUrl={qrImgUrl}
        expoInfo={expoInfo}
        reservationInfo={reservationInfo}
        reserver={selectedReserver}
      />
      
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        reservationId={id}
        onRefundComplete={() => {
          setIsRefundModalOpen(false);
          navigate('/mypage/reservation', { replace: true });
        }}
      />
    </div>
  );
};

export default ReservationDetailPage;

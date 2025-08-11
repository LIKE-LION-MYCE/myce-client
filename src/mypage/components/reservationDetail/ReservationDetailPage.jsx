import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ReservationDetailPage.module.css";
import QRModal from "../qrModal/QRModal";
import { getReservationDetail, updateReservers } from "../../../api/service/reservation/reservationApi";

const ReservationDetailPage = () => {
  const { id } = useParams();

  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMembers, setEditMembers] = useState([]);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrImgUrl, setQrImgUrl] = useState("");

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
      setError('예약 정보를 불러오는데 실패했습니다.');
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
      alert('참여 인원 정보가 성공적으로 업데이트되었습니다.');
      
    } catch (err) {
      console.error('참여 인원 업데이트 실패:', err);
      setError('참여 인원 정보 업데이트에 실패했습니다.');
      alert('업데이트에 실패했습니다. 다시 시도해주세요.');
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

  // 상세보기 버튼 클릭 시
  const handleQrOpen = (qrUrl) => {
    setQrImgUrl(qrUrl);
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

  // 티켓 타입 한글 변환
  const formatTicketType = (ticketType) => {
    const typeMap = {
      'GENERAL': '일반',
      'EARLY_BIRD': '얼리버드'
    };
    return typeMap[ticketType] || ticketType;
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.mainBox}>
          <h2 className={styles.pageTitle}>예약 확인</h2>
          <div className={styles.loading}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !reservationData) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.mainBox}>
          <h2 className={styles.pageTitle}>예약 확인</h2>
          <div className={styles.error}>{error || '예약 정보를 찾을 수 없습니다.'}</div>
        </div>
      </div>
    );
  }

  const { expoInfo, reservationInfo, reserverInfos } = reservationData;

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainBox}>
        <h2 className={styles.pageTitle}>예약 확인</h2>

        <section className={styles.section}>
          <h3 className={styles.subTitle}>참여 행사 정보</h3>
          <div className={styles.expoBox}>
            <img 
              src={expoInfo.thumbnailUrl || '/default-expo-image.jpg'} 
              alt="포스터" 
              className={styles.poster} 
            />
            <div>
              <div className={styles.expoTitle}>{expoInfo.title}</div>
              <div className={styles.grayDotList}>
                <div>
                  <div className={styles.eventDate}>
                    ● {formatDateRange(expoInfo.displayStartDate, expoInfo.displayEndDate)}
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

        <section className={styles.section}>
          <h3 className={styles.subTitle}>예매 정보</h3>
          <div className={styles.reservationGrid}>
            <div>
              <div className={styles.label}>예매일</div>
              <div>{formatDate(reservationInfo.createdAt)}</div>
            </div>
            <div>
              <div className={styles.label}>티켓 이름</div>
              <div>{reservationInfo.ticketName || 'N/A'}</div>
            </div>
            <div>
              <div className={styles.label}>티켓 타입</div>
              <div>{formatTicketType(reservationInfo.ticketType) || 'N/A'}</div>
            </div>
            <div>
              <div className={styles.label}>티켓 장수</div>
              <div>{reservationInfo.quantity}매</div>
            </div>
            <div>
              <div className={styles.label}>단가</div>
              <div>{reservationInfo.ticketPrice?.toLocaleString()}원</div>
            </div>
            <div>
              <div className={styles.label}>총 결제금액</div>
              <div>{(reservationInfo.ticketPrice * reservationInfo.quantity).toLocaleString()}원</div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.subTitle}>참여 인원</h3>
            {!isEditMode ? (
              <button className={styles.editBtn} onClick={handleEdit}>
                편집
              </button>
            ) : (
              <div className={styles.editActionGroup}>
                <button className={styles.saveBtn} onClick={handleSave}>
                  저장
                </button>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                  취소
                </button>
              </div>
            )}
          </div>
          <table className={styles.memberTable}>
            <thead>
              <tr>
                <th>이름</th>
                <th>예매번호</th>
                <th>성별</th>
                <th>전화번호</th>
                <th>이메일</th>
                <th>QR 확인</th>
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
                        <option value="">선택</option>
                        <option value="MALE">남자</option>
                        <option value="FEMALE">여자</option>
                      </select>
                    ) : (
                      member.gender === 'MALE' ? '남자' : member.gender === 'FEMALE' ? '여자' : 'N/A'
                    )}
                  </td>
                  <td>
                    {isEditMode ? (
                      <input
                        value={member.phone || ''}
                        onChange={(e) =>
                          handleChange(idx, "phone", e.target.value)
                        }
                        className={styles.input}
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
                      className={styles.qrBtn}
                      onClick={() => handleQrOpen(member.qrCodeUrl)}
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 예약 취소 버튼 (가운데, 연회색) */}
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 28 }}
          >
            <button className={styles.neutralCancelBtn}>예약 취소</button>
          </div>
        </section>

        <QRModal
          open={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          qrImgUrl={qrImgUrl}
        />
      </div>
    </div>
  );
};

export default ReservationDetailPage;

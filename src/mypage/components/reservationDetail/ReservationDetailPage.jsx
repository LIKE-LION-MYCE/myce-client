import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ReservationDetailPage.module.css";
import QRModal from "../qrModal/QRModal";

const dummyDetail = {
  expo: {
    title: "2024 IT 박람회",
    dateRange: "2024년 12월 15일 ~ ????년 ??월 ??일",
    place: "서울 코엑스",
    posterUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyNDAzMjFfMTU5/MDAxNzExMDA1ODI4MTQw.psQX0d6NIIndrBZEQG5hYpU7lEzdUL7MKTi26EN0VdAg.nCl1urMS90FJqqYkUYhTn1udIBHVy5gSi6dfgvne2vUg.JPEG/NMF2024_4.jpg?type=w800",
  },
  reservation: {
    date: "2024년 11월 28일",
    ticketCount: 4,
    reservationId: "B0014561892370",
    totalAmount: 150000,
  },
  members: [
    {
      name: "김한수",
      reservationId: "B0014561892370",
      birth: "00.00.00",
      phone: "090-1234-1234",
      email: "abc@abc.abc",
      qrUrl:
        "https://cdn.pixabay.com/photo/2015/03/21/09/34/qr-683354_1280.png",
    },
    {
      name: "박지민",
      reservationId: "B0014561892371",
      birth: "99.05.12",
      phone: "010-5678-5678",
      email: "jimin@abc.com",
      qrUrl:
        "https://cdn.pixabay.com/photo/2015/03/21/09/34/qr-683354_1280.png",
    },
    {
      name: "최은영",
      reservationId: "B0014561892372",
      birth: "98.11.23",
      phone: "010-3333-4444",
      email: "eychoi@abc.com",
      qrUrl:
        "https://cdn.pixabay.com/photo/2015/03/21/09/34/qr-683354_1280.png",
    },
    {
      name: "이성준",
      reservationId: "B0014561892373",
      birth: "00.03.08",
      phone: "010-2222-8888",
      email: "sjlee@abc.com",
      qrUrl:
        "https://cdn.pixabay.com/photo/2015/03/21/09/34/qr-683354_1280.png",
    },
  ],
};

const ReservationDetailPage = () => {
  const { id } = useParams();

  const { expo, reservation, members } = dummyDetail;

  const [isEditMode, setIsEditMode] = useState(false);
  const [editMembers, setEditMembers] = useState(dummyDetail.members);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrImgUrl, setQrImgUrl] = useState("");

  // 편집 시작
  const handleEdit = () => setIsEditMode(true);

  // 편집 취소
  const handleCancel = () => {
    setEditMembers(dummyDetail.members);
    setIsEditMode(false);
  };

  // 편집 저장
  const handleSave = () => {
    // 실제로는 저장 처리 필요
    setIsEditMode(false);
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
    setQrImgUrl(qrUrl); // 멤버별 qrUrl 사용
    setQrModalOpen(true);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>예약 확인</h2>

      <section className={styles.section}>
        <h3 className={styles.subTitle}>참여 행사 정보</h3>
        <div className={styles.expoBox}>
          <img src={expo.posterUrl} alt="포스터" className={styles.poster} />
          <div>
            <div className={styles.expoTitle}>{expo.title}</div>
            <div className={styles.grayDotList}>
              <div>
                <div className={styles.eventDate}>● {expo.dateRange}</div>
                <div className={styles.eventPlace}>● {expo.place}</div>
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
            <div>{reservation.date}</div>
          </div>
          <div>
            <div className={styles.label}>티켓 장수</div>
            <div>{reservation.ticketCount}매</div>
          </div>
          <div>
            <div className={styles.label}>총 결제금액</div>
            <div>{reservation.totalAmount.toLocaleString()}원</div>
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
              <th>생년월일</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>QR 확인</th>
            </tr>
          </thead>
          <tbody>
            {editMembers.map((m, idx) => (
              <tr key={idx}>
                <td>
                  {isEditMode ? (
                    <input
                      value={m.name}
                      onChange={(e) =>
                        handleChange(idx, "name", e.target.value)
                      }
                      className={styles.input}
                    />
                  ) : (
                    m.name
                  )}
                </td>
                <td>{m.reservationId}</td>
                <td>
                  {isEditMode ? (
                    <input
                      value={m.birth}
                      onChange={(e) =>
                        handleChange(idx, "birth", e.target.value)
                      }
                      className={styles.input}
                    />
                  ) : (
                    m.birth
                  )}
                </td>
                <td>
                  {isEditMode ? (
                    <input
                      value={m.phone}
                      onChange={(e) =>
                        handleChange(idx, "phone", e.target.value)
                      }
                      className={styles.input}
                    />
                  ) : (
                    m.phone
                  )}
                </td>
                <td>
                  {isEditMode ? (
                    <input
                      value={m.email}
                      onChange={(e) =>
                        handleChange(idx, "email", e.target.value)
                      }
                      className={styles.input}
                    />
                  ) : (
                    m.email
                  )}
                </td>
                <td>
                  <button
                    className={styles.qrBtn}
                    onClick={() => handleQrOpen(m.qrUrl)}
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
  );
};

export default ReservationDetailPage;

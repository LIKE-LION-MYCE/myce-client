import { useEffect, useState } from 'react';
import styles from './ExpoApplicationDetail.module.css';
import ToggleSwitch from '../../../common/commponents/toggleSwitch/ToggleSwitch';

// ExpoApplicationDetail 컴포넌트가 props로 expoData를 받도록 변경
function ExpoApplicationDetail({ expoData }) {
  const [form, setForm] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // props로 받은 expoData를 상태에 설정
    if (expoData) {
      setForm({ ...expoData });
      setIsPremium(expoData.isPremium);
      setStatus(expoData.status);
    }
  }, [expoData]); // expoData가 변경될 때마다 useEffect 실행

  const renderStatusTag = () => {
    switch (status) {
      case '승인대기':
        return <span className={`${styles.statusTag} ${styles.pending}`}>승인 대기</span>;
      case '진행중':
        return <span className={`${styles.statusTag} ${styles.inProgress}`}>진행중</span>;
      case '종료됨':
        return <span className={`${styles.statusTag} ${styles.completed}`}>종료됨</span>;
      case '정산완료':
        return <span className={`${styles.statusTag} ${styles.settled}`}>정산 완료</span>;
      case '결제대기':
        return <span className={`${styles.statusTag} ${styles.paymentPending}`}>결제 대기</span>;
      case '진행':
        return <span className={`${styles.statusTag} ${styles.inProgress}`}>진행</span>;
      default:
        return null;
    }
  };

  const renderButtons = () => {
    switch (status) {
      case '승인대기':
        return (
          <div className={styles.buttonGroup}>
            <button className={`${styles.button} ${styles.cancelButton}`}>신청 취소</button>
          </div>
        );
      case '진행중':
        return (
          <div className={styles.buttonGroup}>
            <button className={`${styles.button} ${styles.cancelButton}`}>취소 신청</button>
          </div>
        );
      case '결제대기':
        return (
          <div className={`${styles.buttonGroup} ${styles.inlineButtons}`}>
            <button className={`${styles.button} ${styles.cancelButton}`}>신청 취소</button>
            <button className={`${styles.button} ${styles.paymentButton}`}>결제</button>
          </div>
        );
      default:
        return null;
    }
  };
  
  const renderAdminButton = () => {
    if (status === '종료됨' || status === '정산완료') {
      return (
        <button className={`${styles.adminButton}`}>관리자 정보</button>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.pageTitle}>신청 상세</h2>
          {renderStatusTag()}
          {renderAdminButton()}
        </div>
      </div>
      
      {/* 폼 상세 내용 */}
      <div className={styles.topRow}>
        <div className={styles.profileWrapper}>
          <img
            src="https://cdn.netongs.com/news/photo/202412/322861_127383_830.jpg"
            alt="포스터"
            className={styles.profileImage}
          />
        </div>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 이름</label>
            <input className={styles.inputField} value={form.name || ''} readOnly />
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 위치</label>
            <input className={styles.inputField} value={form.location || ''} readOnly />
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>최대 수용 인원</label>
            <input
              type="number"
              className={styles.inputField}
              value={form.capacity || ''}
              readOnly
            />
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>개최 기간</label>
            <div className={styles.dateGroup}>
              <input type="date" className={styles.inputField} value={form.startDate || ''} readOnly />
              <input type="date" className={styles.inputField} value={form.endDate || ''} readOnly />
            </div>
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>운영 시간</label>
            <div className={styles.dateGroup}>
              <input type="time" className={styles.inputField} value={form.startTime || ''} readOnly />
              <input type="time" className={styles.inputField} value={form.endTime || ''} readOnly />
            </div>
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>게시 기간</label>
            <div className={styles.dateGroup}>
              <input type="date" className={styles.inputField} value={form.postStartDate || ''} readOnly />
              <input type="date" className={styles.inputField} value={form.postEndDate || ''} readOnly />
            </div>
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>프리미엄 상위 노출 신청 여부</label>
            <div className={styles.toggleWrapper}>
              <ToggleSwitch checked={isPremium} disabled />
            </div>
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>카테고리</label>
            <div className={styles.badgeRow}>
              <div className={styles.badge}>{form.category || '카테고리 없음'}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 회사 정보 추가 */}
      <div className={`${styles.infoGrid} ${styles.full}`}>
        <div className={styles.infoGroup}>
          <label className={styles.label}>회사명</label>
          <input className={styles.inputField} value={form.companyName || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>회사 주소</label>
          <input className={styles.inputField} value={form.companyAddress || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>사업자 번호</label>
          <input className={styles.inputField} value={form.businessRegistrationNumber || ''} readOnly />
        </div>
      </div>

      {/* 대표자 정보 추가 */}
      <div className={`${styles.infoGrid} ${styles.full}`}>
        <div className={styles.infoGroup}>
          <label className={styles.label}>대표명</label>
          <input className={styles.inputField} value={form.ceoName || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>대표자 연락처</label>
          <input className={styles.inputField} value={form.ceoContact || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>대표자 이메일</label>
          <input className={styles.inputField} value={form.ceoEmail || ''} readOnly />
        </div>
      </div>

      {/* 신청자 정보 추가 */}
      <div className={`${styles.infoGrid} ${styles.full}`}>
        <div className={styles.infoGroup}>
          <label className={styles.label}>신청자명</label>
          <input className={styles.inputField} value={form.applicantName || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>신청자 연락처</label>
          <input className={styles.inputField} value={form.applicantContact || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>신청자 이메일</label>
          <input className={styles.inputField} value={form.applicantEmail || ''} readOnly />
        </div>
      </div>

      <div className={`${styles.formGroup} ${styles.full}`}>
        <label className={styles.label}>설명</label>
        <textarea className={styles.textarea} value={form.description || ''} readOnly />
      </div>
      <div className={`${styles.infoGrid}`}>
        <div className={styles.infoGroup}>
          <label className={styles.label}>등록금</label>
          <input className={styles.inputField} value={form.registrationFee || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>모집 티켓 수</label>
          <input className={styles.inputField} value={form.recruitedTickets || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>예상 총 매출</label>
          <input className={styles.inputField} value={form.expectedRevenue || ''} readOnly />
        </div>
      </div>
      <div className={`${styles.formGroup} ${styles.full}`}>
          <label className={styles.label}>첨부파일</label>
          <div className={styles.fileBox}>
              {form.attachments && form.attachments.length > 0 ? (
                  form.attachments.map((file, index) => (
                      <a key={index} href={file.url} className={styles.attachmentName} download>
                          {file.name}
                      </a>
                  ))
              ) : (
                  <span className={styles.noAttachment}>첨부된 파일이 없습니다.</span>
              )}
          </div>
      </div>
      
      {/* 상태에 따른 버튼 렌더링 */}
      {renderButtons()}
      
    </div>
  );
}

export default ExpoApplicationDetail;

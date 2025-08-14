import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Setting.module.css';
import ExpoSettingForm from '../../components/expoSettingForm/ExpoSettingForm';
import TicketSettingForm from '../../components/ticketSettingForm/TicketSettingForm';
import { getMyExpoInfo } from '../../../api/service/expo-admin/setting/ExpoInfoService';

function Setting() {
  const { expoId } = useParams();
  const [status, setStatus] = useState('');

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING_APPROVAL': '승인 대기',
      'PENDING_PAYMENT': '결제 대기',
      'PENDING_PUBLISH': '게시 대기',
      'PUBLISHED': '게시 중',
      'PUBLISH_ENDED': '게시 종료',
      'CANCELLED': '취소됨',
      'REJECTED': '거절됨',
      'COMPLETED': '완료됨'
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    const fetchExpoStatus = async () => {
      if (!expoId) return;
      try {
        const data = await getMyExpoInfo(expoId);
        setStatus(data.status);
      } catch (error) {
        console.error('Failed to fetch expo status:', error);
      }
    };
    
    fetchExpoStatus();
  }, [expoId]);
  return (
    <div className={styles.settingContainer}>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          내 박람회 정보
          <span className={`${styles.badge} ${styles[`badge${status}`]}`}>
            {getStatusText(status)}
          </span>
        </h3>
        <ExpoSettingForm/>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      <div className={styles.ticketSection}>
        <h4 className={styles.sectionTitle}>티켓 관리</h4>
        <TicketSettingForm/>
      </div>

    </div>

    
  );
}

export default Setting;

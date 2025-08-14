import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Setting.module.css';
import expoFormStyles from '../../components/expoSettingForm/ExpoSettingForm.module.css';
import ExpoSettingForm from '../../components/expoSettingForm/ExpoSettingForm';
import TicketSettingForm from '../../components/ticketSettingForm/TicketSettingForm';
import { getMyExpoInfo } from '../../../api/service/expo-admin/setting/ExpoInfoService';

function Setting() {
  const { expoId } = useParams();
  const [expoStatus, setExpoStatus] = useState('');

  useEffect(() => {
    const fetchExpoStatus = async () => {
      if (!expoId) return;
      try {
        const data = await getMyExpoInfo(expoId);
        setExpoStatus(data.status || '');
      } catch (error) {
        console.error('Failed to fetch expo status:', error);
      }
    };

    fetchExpoStatus();
  }, [expoId]);

  return (
    <div className={styles.settingContainer}>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          내 박람회 정보
          {expoStatus && (
            <span className={`${expoFormStyles.badge} ${expoFormStyles.red}`} style={{marginLeft: '12px'}}>
              {expoStatus}
            </span>
          )}
        </h4>
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

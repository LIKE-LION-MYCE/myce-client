import styles from './Setting.module.css';
import ExpoSettingForm from '../../components/expoSettingForm/ExpoSettingForm';
import TicketSettingForm from '../../components/ticketSettingForm/TicketSettingForm';

function Setting() {
  return (
    <div className={styles.settingContainer}>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>내 박람회 정보</h4>
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

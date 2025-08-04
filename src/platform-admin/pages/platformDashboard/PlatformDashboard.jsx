import styles from './PlatformDashboard.module.css';
import RevenueDashboard from '../../components/revenueDashboard/RevenueDashboard';
import UsageDashboard from '../../components/usageDashboard/UsageDashboard';


function PlatformDashboard() {
  return (
    <div>
        <RevenueDashboard></RevenueDashboard>
        <UsageDashboard></UsageDashboard>
    </div>
  );
}

export default PlatformDashboard;
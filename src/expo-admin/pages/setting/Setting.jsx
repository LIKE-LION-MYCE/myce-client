import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Setting.module.css';

import ExpoSettingForm from '../../components/expoSettingForm/ExpoSettingForm';
import TicketSettingForm from '../../components/ticketSettingForm/TicketSettingForm';
import TicketTable from '../../components/ticketTable/TicketTable';

import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { usePermission } from '../../permission/PermissionContext';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

import { getMyExpoInfo } from '../../../api/service/expo-admin/setting/ExpoInfoService';
import {
  getMyExpoTickets,
  saveMyExpoTicket,
  updateMyExpoTicket,
  deleteMyExpoTicket,
} from '../../../api/service/expo-admin/setting/TicketService';

function Setting() {
  const { expoId } = useParams();
  const { perm } = usePermission();

  const [status, setStatus] = useState('');
  const [tickets, setTickets] = useState([]);
  const [toast, setToast] = useState(null);
  const [openCreate, setOpenCreate] = useState(false); // 모달 오픈

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2000);
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING_APPROVAL: '승인 대기',
      PENDING_PAYMENT: '결제 대기',
      PENDING_PUBLISH: '게시 대기',
      PUBLISHED: '게시 중',
      PUBLISH_ENDED: '게시 종료',
      CANCELLED: '취소됨',
      REJECTED: '거절됨',
      COMPLETED: '완료됨',
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    if (!expoId) return;
    (async () => {
      try {
        const [expo, list] = await Promise.all([getMyExpoInfo(expoId), getMyExpoTickets(expoId)]);
        setStatus(expo.status);
        setTickets(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        showToast('fail', '데이터 로드에 실패했습니다.');
      }
    })();
  }, [expoId]);

  const refetchTickets = async () => {
    try {
      const list = await getMyExpoTickets(expoId);
      setTickets(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      showToast('fail', '티켓 목록을 새로고침하지 못했습니다.');
    }
  };

  const handleCreateTicket = async (form) => {
    try {
      const payload = {
        ...form,
        price: form.price === '' ? '' : Number(form.price),
        totalQuantity: form.totalQuantity === '' ? '' : Number(form.totalQuantity),
      };
      await saveMyExpoTicket(expoId, payload);
      showToast('success', '티켓이 성공적으로 등록되었습니다.');
      await refetchTickets();
      return true; // 성공 → TicketSettingForm이 닫음
    } catch (err) {
      showToast('fail', err?.message || '티켓 등록 중 오류가 발생했습니다.');
      return false;
    }
  };

  const handleUpdateTicket = async (ticket) => {
    try {
      const payload = {
        ...ticket,
        price: ticket.price === '' ? '' : Number(ticket.price),
        totalQuantity: ticket.totalQuantity === '' ? '' : Number(ticket.totalQuantity),
      };
      await updateMyExpoTicket(expoId, ticket.ticketId, payload);
      showToast('success', '티켓이 성공적으로 수정되었습니다.');
      await refetchTickets();
    } catch (err) {
      showToast('fail', err?.message || '티켓 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await deleteMyExpoTicket(expoId, ticketId);
      showToast('success', '티켓이 성공적으로 삭제되었습니다.');
      await refetchTickets();
    } catch (err) {
      showToast('fail', err?.message || '티켓 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.settingContainer}>
      {toast?.type === 'success' && <ToastSuccess message={toast.message} />}
      {toast?.type === 'fail' && <ToastFail message={toast.message} />}

      <div className={styles.alertBox}>
        <FaInfoCircle className={styles.alertIcon} />
        <span className={styles.alertText}>
          <strong>안내 : </strong>&nbsp;
          박람회 게시 이후에는 박람회 정보를 수정할 수 없습니다.
        </span>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          내 박람회 정보
          <span className={`${styles.badge} ${styles[`badge${status}`]}`}>
            {getStatusText(status)}
          </span>
        </h3>
        <ExpoSettingForm />
      </div>

      <div className={styles.divider} />

              
      <div className={styles.alertBox}>
        <FaInfoCircle className={styles.alertIcon} />
          <span className={styles.alertText}>
            <strong>안내 : </strong>&nbsp;
             티켓 판매 시작일 이후에는 티켓 정보를 수정할 수 없습니다. 
          </span>
      </div>

       <div className={styles.ticketSection}>
        <div className={styles.titleRow}>
          <h4 className={styles.sectionTitle}>티켓 목록</h4>
          <button className={styles.addBtn} onClick={() => setOpenCreate(true)}>
            <FaCheckCircle className={styles.addIcon} /> 티켓 등록
          </button>
        </div>

         <TicketTable
          data={tickets}
          onUpdate={handleUpdateTicket}
          onDelete={handleDeleteTicket}
        />
      </div>

      <TicketSettingForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}

export default Setting;
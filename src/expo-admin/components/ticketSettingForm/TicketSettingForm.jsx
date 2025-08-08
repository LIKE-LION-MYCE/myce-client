import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import styles from './TicketSettingForm.module.css';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { getMyExpoTickets, saveMyExpoTicket, deleteMyExpoTicket, updateMyExpoTicket} from '../../../api/service/expo-admin/setting/TicketService';

function TicketSettingForm() {
  const {expoId} = useParams();
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newTicket, setNewTicket] = useState(initTicket());
  const [editTicket, setEditTicket] = useState(initTicket());
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  //초기 렌더링
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketData = await getMyExpoTickets(expoId);
        setData(ticketData);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchTickets();
  }, []);

  //성공 토스트 팝업
  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  //실패 토스트 팝업
  const triggerToastFail = (message) =>{
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(()=> setShowFailToast(false), 3000);
  }

  //티켓 초기화
  function initTicket() {
    return {
      ticketId: null,
      name: '',
      type: '얼리버드',
      description: '',
      price: '',
      totalQuantity: '',
      saleStartDate: '',
      saleEndDate: '',
    };
  }

  //티켓 유효성 검증
  const validateTicket = (ticket) => {
    if (!ticket.name || ticket.name.trim() === '') return '티켓 이름은 필수입니다.';
    if (ticket.name.length > 100) return '티켓 이름은 100자 이하여야 합니다.';
    if (!ticket.description || ticket.description.trim() === '') return '설명은 필수입니다.';
    if (!ticket.type) return '타입은 필수입니다.';
    if (ticket.price === '' || isNaN(ticket.price) || Number(ticket.price) < 0) return '가격은 0원 이상이어야 합니다.';
    if (ticket.totalQuantity === '' || isNaN(ticket.totalQuantity) || Number(ticket.totalQuantity) < 1) return '수량은 1장 이상이어야 합니다.';
    if (!ticket.saleStartDate) return '판매 시작일은 필수입니다.';
    if (!ticket.saleEndDate) return '판매 종료일은 필수입니다.';
    if (ticket.saleEndDate < ticket.saleStartDate) return '판매 종료일은 시작일과 같거나 이후여야 합니다.';
    return null;
  };

  //저장 api
  const handleSave = async () => {
    const error = validateTicket(newTicket);
    if (error) {
      triggerToastFail(error);
      return;
    }

    try {
      const created = await saveMyExpoTicket(expoId,newTicket);
      triggerSuccessToast();
      setData([...data, created]);
      setNewTicket(initTicket());
      setIsAdding(false);
    } catch (error) {
      triggerToastFail(error.message);
    }
  };

  //삭제 api
  const handleDelete = async (index) => {
    const ticketId = data[index]?.ticketId;
    if (!ticketId) {
      triggerToastFail("티켓 ID가 없습니다.");
      return;
    }

    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await deleteMyExpoTicket(expoId,ticketId);
      setData((prev) => prev.filter((_, i) => i !== index));
      triggerSuccessToast();
      if (editingIndex === index) setEditingIndex(null);
    } catch (err) {
      triggerToastFail(err.message);
    }
  };

  //수정 api
  const handleUpdate = async () => {
    const error = validateTicket(editTicket);
    if (error) {
      triggerToastFail(error);
      return;
    }

    try {
      const updated = await updateMyExpoTicket(expoId, editTicket.ticketId, editTicket);
      const newData = [...data];
      newData[editingIndex] = updated;
      setData(newData);
      setEditingIndex(null);
      triggerSuccessToast();
    } catch (error) {
      triggerToastFail(error.message);
    }
  };

  //취소 상태 전환
  const handleCancel = () => {
    setIsAdding(false);
    setNewTicket(initTicket());
  };

  //수정 상태 전환
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditTicket(data[index]);
    setIsAdding(false);
  };

  //취소 상태 전환
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditTicket(initTicket());
  };

  //input 감지
  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    const updater = isEdit ? setEditTicket : setNewTicket;
    updater((prev) => ({ ...prev, [name]: value }));
  };

  //추가 상태 전환
  const handleAddClick = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setNewTicket(initTicket());
  };

  const renderRow = (row, idx) => {
    const isEdit = editingIndex === idx;
    const ticket = isEdit ? editTicket : row;

    return (
      <tr key={idx} className={styles.row}>
        {['name', 'type', 'description', 'price', 'totalQuantity'].map((field) => (
          <td key={field} className={styles.td}>
            {isEdit ? (
              field === 'type' ? (
                <select
                  name="type"
                  value={ticket.type}
                  onChange={(e) => handleChange(e, true)}
                  className={styles.input}
                >
                  <option value="얼리버드">얼리버드</option>
                  <option value="일반">일반</option>
                </select>
              ) : (
                <input
                  name={field}
                  type={field === 'price' || field === 'totalQuantity' ? 'number' : 'text'}
                  value={ticket[field]}
                  onChange={(e) => handleChange(e, true)}
                  className={styles.input}
                />
              )
            ) : (
              ticket[field]
            )}
          </td>
        ))}
        <td className={styles.td}>
          {isEdit ? (
            <div className={styles.dateRange}>
              <input name="saleStartDate" type="date" value={ticket.saleStartDate} onChange={(e) => handleChange(e, true)} className={styles.input} />
              <span>~</span>
              <input name="saleEndDate" type="date" value={ticket.saleEndDate} onChange={(e) => handleChange(e, true)} className={styles.input} />
            </div>
          ) : (
            `${ticket.saleStartDate} ~ ${ticket.saleEndDate}`
          )}
        </td>
        <td className={styles.td}>
          {isEdit ? (
            <div className={styles.actionGroup}>
              <button className={styles.submitBtn} onClick={handleUpdate}>저장</button>
              <button className={styles.cancelBtn} onClick={handleCancelEdit}>취소</button>
            </div>
          ) : (
            <>
              <button className={styles.editBtn} onClick={() => handleEdit(idx)}>수정</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(idx)}>삭제</button>
            </>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.addBtn} onClick={handleAddClick}>
          <FaPlus className={styles.iconBtn} /> 티켓 등록
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.th}>티켓 이름</th>
              <th className={styles.th}>타입</th>
              <th className={styles.th}>설명</th>
              <th className={styles.th}>가격(원)</th>
              <th className={styles.th}>수량</th>
              <th className={styles.th}>판매 기간</th>
              <th className={styles.th}>수정/삭제</th>
            </tr>
          </thead>
          <tbody>
            {data.map(renderRow)}
            {isAdding && (
              <tr className={styles.row}>
                {['name', 'type', 'description', 'price', 'totalQuantity'].map((field) => (
                  <td key={field} className={styles.td}>
                    {field === 'type' ? (
                      <select
                        name="type"
                        value={newTicket.type}
                        onChange={handleChange}
                        className={styles.input}
                      >
                        <option value="얼리버드">얼리버드</option>
                        <option value="일반">일반</option>
                      </select>
                    ) : (
                      <input
                        name={field}
                        type={field === 'price' || field === 'totalQuantity' ? 'number' : 'text'}
                        value={newTicket[field]}
                        onChange={handleChange}
                        className={styles.input}
                      />
                    )}
                  </td>
                ))}
                <td className={styles.td}>
                  <div className={styles.dateRange}>
                    <input name="saleStartDate" type="date" value={newTicket.saleStartDate} onChange={handleChange} className={styles.input} />
                    <span>~</span>
                    <input name="saleEndDate" type="date" value={newTicket.saleEndDate} onChange={handleChange} className={styles.input} />
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.actionGroup}>
                    <button className={styles.submitBtn} onClick={handleSave}>저장</button>
                    <button className={styles.cancelBtn} onClick={handleCancel}>취소</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showSuccessToast && <ToastSuccess />}
      {showFailToast && <ToastFail message={failMessage}/>}
    </div>
  );
}

export default TicketSettingForm;
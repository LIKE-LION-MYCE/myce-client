import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import styles from './TicketSettingForm.module.css';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { getMyExpoTickets, saveMyExpoTicket, deleteMyExpoTicket, updateMyExpoTicket } from '../../../api/service/expo-admin/setting/TicketService';

function TicketSettingForm() {
  const { expoId } = useParams();
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newTicket, setNewTicket] = useState(initTicket());
  const [editTicket, setEditTicket] = useState(initTicket());
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  // 초기 렌더링
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
  }, [expoId]);

  // 성공 토스트
  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // 실패 토스트
  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  // 티켓 초기값
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
      useStartDate: '',
      useEndDate: '',
    };
  }

  // 유효성 검사 (백엔드 DTO 규칙 반영)
  const validateTicket = (t) => {
    if (!t.name || t.name.trim() === '') return '티켓 이름은 필수입니다.';
    if (t.name.length > 100) return '티켓 이름은 100자 이하여야 합니다.';
    if (!t.description || t.description.trim() === '') return '설명은 필수입니다.';
    if (!t.type) return '타입은 필수입니다.';

    if (t.price === '' || isNaN(t.price)) return '가격은 숫자여야 합니다.';
    if (Number(t.price) < 0) return '가격은 0원 이상이어야 합니다.';

    if (t.totalQuantity === '' || isNaN(t.totalQuantity)) return '수량은 숫자여야 합니다.';
    if (Number(t.totalQuantity) < 1) return '수량은 1장 이상이어야 합니다.';

    if (!t.saleStartDate) return '판매 시작일은 필수입니다.';
    if (!t.saleEndDate) return '판매 종료일은 필수입니다.';
    if (t.saleEndDate < t.saleStartDate) return '판매 종료일은 시작일과 같거나 이후여야 합니다.';

    if (!t.useStartDate) return '사용 시작일은 필수입니다.';
    if (!t.useEndDate) return '사용 종료일은 필수입니다.';
    if (t.useEndDate < t.useStartDate) return '사용 종료일은 시작일과 같거나 이후여야 합니다.';

    if (t.useStartDate < t.saleStartDate) return '사용 시작일은 판매 시작일과 같거나 이후여야 합니다.';

    return null;
  };

  // 저장
  const handleSave = async () => {
    const error = validateTicket(newTicket);
    if (error) {
      triggerToastFail(error);
      return;
    }

    // 숫자 필드 변환
    const payload = {
      ...newTicket,
      price: Number(newTicket.price),
      totalQuantity: Number(newTicket.totalQuantity),
    };

    try {
      const created = await saveMyExpoTicket(expoId, payload);
      triggerSuccessToast();
      setData([...data, created]);
      setNewTicket(initTicket());
      setIsAdding(false);
    } catch (error) {
      triggerToastFail(error.message);
    }
  };

  // 삭제
  const handleDelete = async (index) => {
    const ticketId = data[index]?.ticketId;
    if (!ticketId) {
      triggerToastFail('티켓 ID가 없습니다.');
      return;
    }

    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await deleteMyExpoTicket(expoId, ticketId);
      setData((prev) => prev.filter((_, i) => i !== index));
      triggerSuccessToast();
      if (editingIndex === index) setEditingIndex(null);
    } catch (err) {
      triggerToastFail(err.message);
    }
  };

  // 수정
  const handleUpdate = async () => {
    const error = validateTicket(editTicket);
    if (error) {
      triggerToastFail(error);
      return;
    }

    const payload = {
      ...editTicket,
      price: Number(editTicket.price),
      totalQuantity: Number(editTicket.totalQuantity),
    };

    try {
      const updated = await updateMyExpoTicket(expoId, editTicket.ticketId, payload);
      const newData = [...data];
      newData[editingIndex] = updated;
      setData(newData);
      setEditingIndex(null);
      triggerSuccessToast();
    } catch (error) {
      triggerToastFail(error.message);
    }
  };

  // 추가 취소
  const handleCancel = () => {
    setIsAdding(false);
    setNewTicket(initTicket());
  };

  // 수정 진입
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditTicket(data[index]);
    setIsAdding(false);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditTicket(initTicket());
  };

  // input 변경
  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    const updater = isEdit ? setEditTicket : setNewTicket;

    updater((prev) => {
      const next = { ...prev, [name]: value };

      if ((name === 'saleStartDate') && next.saleEndDate && next.saleEndDate < value) {
        next.saleEndDate = value;
      }
      if ((name === 'useStartDate') && next.useEndDate && next.useEndDate < value) {
        next.useEndDate = value;
      }
      return next;
    });
  };

  // 추가 행 열기
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
                  min={field === 'price' ? 0 : field === 'totalQuantity' ? 1 : undefined}
                />
              )
            ) : (
              ticket[field]
            )}
          </td>
        ))}

        {/* 판매 기간 */}
        <td className={styles.td}>
          {isEdit ? (
            <div className={styles.dateRange}>
              <input
                name="saleStartDate"
                type="date"
                value={ticket.saleStartDate || ''}
                onChange={(e) => handleChange(e, true)}
                className={styles.input}
              />
              <span>~</span>
              <input
                name="saleEndDate"
                type="date"
                value={ticket.saleEndDate || ''}
                onChange={(e) => handleChange(e, true)}
                className={styles.input}
                min={ticket.saleStartDate || undefined}
              />
            </div>
          ) : (
            `${ticket.saleStartDate} ~ ${ticket.saleEndDate}`
          )}
        </td>

        {/* 사용 기간 */}
        <td className={styles.td}>
          {isEdit ? (
            <div className={styles.dateRange}>
              <input
                name="useStartDate"
                type="date"
                value={ticket.useStartDate || ''}
                onChange={(e) => handleChange(e, true)}
                className={styles.input}
              />
              <span>~</span>
              <input
                name="useEndDate"
                type="date"
                value={ticket.useEndDate || ''}
                onChange={(e) => handleChange(e, true)}
                className={styles.input}
                min={ticket.useStartDate || undefined}
              />
            </div>
          ) : (
            `${ticket.useStartDate} ~ ${ticket.useEndDate}`
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
              <th className={styles.th}>사용 기간</th>
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
                        min={field === 'price' ? 0 : field === 'totalQuantity' ? 1 : undefined}
                      />
                    )}
                  </td>
                ))}
                {/* 판매 기간 */}
                <td className={styles.td}>
                  <div className={styles.dateRange}>
                    <input
                      name="saleStartDate"
                      type="date"
                      value={newTicket.saleStartDate}
                      onChange={handleChange}
                      className={styles.input}
                    />
                    <span>~</span>
                    <input
                      name="saleEndDate"
                      type="date"
                      value={newTicket.saleEndDate}
                      onChange={handleChange}
                      className={styles.input}
                      min={newTicket.saleStartDate || undefined}
                    />
                  </div>
                </td>
                {/* 사용 기간 */}
                <td className={styles.td}>
                  <div className={styles.dateRange}>
                    <input
                      name="useStartDate"
                      type="date"
                      value={newTicket.useStartDate}
                      onChange={handleChange}
                      className={styles.input}
                    />
                    <span>~</span>
                    <input
                      name="useEndDate"
                      type="date"
                      value={newTicket.useEndDate}
                      onChange={handleChange}
                      className={styles.input}
                      min={newTicket.useStartDate || undefined}
                    />
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
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default TicketSettingForm;
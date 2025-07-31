import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import styles from './TicketSettingForm.module.css';
import ToastSuccess from '../../../common/commponents/toastSuccess/ToastSuccess';

function TicketSettingForm() {
  const [data, setData] = useState([
    {
      name: '화장품 박람회 1일권',
      type: '얼리버드',
      description: '1일권 - 할인 혜택 포함',
      price: '10000',
      quantity: '200',
      saleStart: '2025-08-01',
      saleEnd: '2025-08-10',
    },
    {
      name: '화장품 박람회 1일권',
      type: '얼리버드',
      description: '1일권 - 할인 혜택 포함',
      price: '10000',
      quantity: '200',
      saleStart: '2025-08-01',
      saleEnd: '2025-08-10',
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newTicket, setNewTicket] = useState(initTicket());
  const [editTicket, setEditTicket] = useState(initTicket());

  // 토스트 상태
  const [showToast, setShowToast] = useState(false);

  function initTicket() {
    return {
      name: '',
      type: '얼리버드',
      description: '',
      price: '',
      quantity: '',
      saleStart: '',
      saleEnd: '',
    };
  }

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditTicket((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewTicket((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setNewTicket(initTicket());
  };

  const handleSave = () => {
    setData([...data, newTicket]);
    setNewTicket(initTicket());
    setIsAdding(false);
    triggerToast();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewTicket(initTicket());
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditTicket(data[index]);
    setIsAdding(false);
  };

  const handleUpdate = () => {
    const updated = [...data];
    updated[editingIndex] = editTicket;
    setData(updated);
    setEditingIndex(null);
    triggerToast();
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditTicket(initTicket());
  };

  const handleDelete = (index) => {
    const filtered = data.filter((_, i) => i !== index);
    setData(filtered);
    if (editingIndex === index) setEditingIndex(null);
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
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
              <th className={styles.th}>가격</th>
              <th className={styles.th}>수량</th>
              <th className={styles.th}>판매 기간</th>
              <th className={styles.th}>수정/삭제</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              editingIndex === idx ? (
                <tr key={idx} className={styles.row}>
                  <td className={styles.td}><input name="name" value={editTicket.name} onChange={(e) => handleChange(e, true)} className={styles.input} /></td>
                  <td className={styles.td}>
                    <select name="type" value={editTicket.type} onChange={(e) => handleChange(e, true)} className={styles.input}>
                      <option value="얼리버드">얼리버드</option>
                      <option value="일반">일반</option>
                    </select>
                  </td>
                  <td className={styles.td}><input name="description" value={editTicket.description} onChange={(e) => handleChange(e, true)} className={styles.input} /></td>
                  <td className={styles.td}><input name="price" type="number" value={editTicket.price} onChange={(e) => handleChange(e, true)} className={styles.input} /></td>
                  <td className={styles.td}><input name="quantity" type="number" value={editTicket.quantity} onChange={(e) => handleChange(e, true)} className={styles.input} /></td>
                  <td className={styles.td}>
                    <div className={styles.dateRange}>
                      <input name="saleStart" type="date" value={editTicket.saleStart} onChange={(e) => handleChange(e, true)} className={styles.input} />
                      <span>~</span>
                      <input name="saleEnd" type="date" value={editTicket.saleEnd} onChange={(e) => handleChange(e, true)} className={styles.input} />
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionGroup}>
                      <button className={styles.submitBtn} onClick={handleUpdate}>저장</button>
                      <button className={styles.cancelBtn} onClick={handleCancelEdit}>취소</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={idx} className={styles.row}>
                  <td className={styles.td}>{row.name}</td>
                  <td className={styles.td}>{row.type}</td>
                  <td className={styles.td}>{row.description}</td>
                  <td className={styles.td}>{row.price}</td>
                  <td className={styles.td}>{row.quantity}</td>
                  <td className={styles.td}>{row.saleStart} ~ {row.saleEnd}</td>
                  <td className={styles.td}>
                    <button className={styles.editBtn} onClick={() => handleEdit(idx)}>수정</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(idx)}>삭제</button>
                  </td>
                </tr>
              )
            ))}
            {isAdding && (
              <tr className={styles.row}>
                <td className={styles.td}><input name="name" value={newTicket.name} onChange={handleChange} className={styles.input} /></td>
                <td className={styles.td}>
                  <select name="type" value={newTicket.type} onChange={handleChange} className={styles.input}>
                    <option value="얼리버드">얼리버드</option>
                    <option value="일반">일반</option>
                  </select>
                </td>
                <td className={styles.td}><input name="description" value={newTicket.description} onChange={handleChange} className={styles.input} /></td>
                <td className={styles.td}><input name="price" type="number" value={newTicket.price} onChange={handleChange} className={styles.input} /></td>
                <td className={styles.td}><input name="quantity" type="number" value={newTicket.quantity} onChange={handleChange} className={styles.input} /></td>
                <td className={styles.td}>
                  <div className={styles.dateRange}>
                    <input name="saleStart" type="date" value={newTicket.saleStart} onChange={handleChange} className={styles.input} />
                    <span>~</span>
                    <input name="saleEnd" type="date" value={newTicket.saleEnd} onChange={handleChange} className={styles.input} />
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

      {showToast && <ToastSuccess />}
    </div>
  );
}

export default TicketSettingForm;
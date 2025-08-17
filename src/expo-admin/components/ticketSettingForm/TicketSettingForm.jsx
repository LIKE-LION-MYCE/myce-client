import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus, FaInfoCircle } from 'react-icons/fa';
import styles from './TicketSettingForm.module.css';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import {
  getMyExpoTickets,
  saveMyExpoTicket,
  deleteMyExpoTicket,
  updateMyExpoTicket,
} from '../../../api/service/expo-admin/setting/TicketService';
import { getMyExpoInfo } from '../../../api/service/expo-admin/setting/ExpoInfoService';

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

  // 게시(노출) 기간 (판매 시작/종료일을 이 범위에 묶기 위함)
  const [displayStartDate, setDisplayStartDate] = useState('');
  const [displayEndDate, setDisplayEndDate] = useState('');
  // 행사(운영) 기간 (사용 시작/종료일을 이 범위에 묶기 위함)
  const [expoStartDate, setExpoStartDate] = useState('');
  const [expoEndDate, setExpoEndDate] = useState('');

  // expo 정보 로딩 여부 (제약 적용 시점 제어)
  const [expoLoaded, setExpoLoaded] = useState(false);

  function initTicket() {
    return {
      ticketId: null,
      name: '',
      type: '',
      description: '',
      price: '',
      totalQuantity: '',
      saleStartDate: '',
      saleEndDate: '',
      useStartDate: '',
      useEndDate: '',
    };
  }

  // 초기 로딩: 티켓 + 박람회 정보(게시기간/행사기간)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ticketData, expoInfo] = await Promise.all([
          getMyExpoTickets(expoId),
          getMyExpoInfo(expoId),
        ]);
        setData(ticketData || []);
        setDisplayStartDate(expoInfo?.displayStartDate?.split('T')[0] || '');
        setDisplayEndDate(expoInfo?.displayEndDate?.split('T')[0] || '');
        setExpoStartDate(expoInfo?.startDate?.split('T')[0] || '');
        setExpoEndDate(expoInfo?.endDate?.split('T')[0] || '');
        setExpoLoaded(true);
      } catch (error) {
        console.log(error.message);
        setExpoLoaded(true); // 실패해도 폼은 사용 가능하도록
      }
    };
    if (expoId) fetchAll();
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

  // 유효성 검사 (백엔드 DTO 규칙 + 게시/행사 기간 제약 반영)
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

    // 게시기간 내 제약 (존재할 때만 검사)
    if (displayStartDate && t.saleStartDate < displayStartDate)
      return '판매 시작일은 게시 시작일과 같거나 이후여야 합니다.';
    if (displayEndDate && t.saleStartDate > displayEndDate)
      return '판매 시작일은 게시 종료일과 같거나 이전이어야 합니다.';
    if (displayEndDate && t.saleEndDate > displayEndDate)
      return '판매 종료일은 게시 종료일과 같거나 이전이어야 합니다.';

    if (!t.useStartDate) return '사용 시작일은 필수입니다.';
    if (!t.useEndDate) return '사용 종료일은 필수입니다.';
    if (t.useEndDate < t.useStartDate) return '사용 종료일은 시작일과 같거나 이후여야 합니다.';
    if (t.useStartDate < t.saleStartDate) return '사용 시작일은 판매 시작일과 같거나 이후여야 합니다.';

    // 행사기간 내 제약 (존재할 때만 검사)
    if (expoStartDate && t.useStartDate < expoStartDate)
      return '사용 시작일은 행사 시작일과 같거나 이후여야 합니다.';
    if (expoEndDate && t.useEndDate > expoEndDate)
      return '사용 종료일은 행사 종료일과 같거나 이전이어야 합니다.';

    return null;
  };

  // 저장(추가)
  const handleSave = async () => {
    const error = validateTicket(newTicket);
    if (error) {
      triggerToastFail(error);
      return;
    }

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

  // 수정 저장
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

  // 공용 input 변경 핸들러 (게시/행사 기간 제약 즉시 보정: 기준값 존재 시에만)
  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    const updater = isEdit ? setEditTicket : setNewTicket;

    updater((prev) => {
      let next = { ...prev, [name]: value };

      // 판매 시작일 제약: 게시기간 내로 클램프
      if (name === 'saleStartDate' && value) {
        let v = value;
        if (expoLoaded) {
          if (displayStartDate && v < displayStartDate) v = displayStartDate;
          if (displayEndDate && v > displayEndDate) v = displayEndDate;
        }
        next.saleStartDate = v;

        // 시작일 변경 시 종료일 보정: 종료일 >= 시작일 && 종료일 <= 게시 종료일
        if (next.saleEndDate && next.saleEndDate < v) next.saleEndDate = v;
        if (expoLoaded && displayEndDate && next.saleEndDate && next.saleEndDate > displayEndDate)
          next.saleEndDate = displayEndDate;

        // 사용 시작/종료일도 시작일보다 빠를 수 없음(기존 규칙 유지)
        if (next.useStartDate && next.useStartDate < v) next.useStartDate = v;
        if (next.useEndDate && next.useEndDate < (next.useStartDate || v))
          next.useEndDate = next.useStartDate || v;
      }

      // 판매 종료일 제약: 종료일 ∈ [판매 시작일, 게시 종료일]
      if (name === 'saleEndDate' && value) {
        let v = value;
        const minStart = next.saleStartDate || prev.saleStartDate;
        if (minStart && v < minStart) v = minStart;
        if (expoLoaded && displayEndDate && v > displayEndDate) v = displayEndDate;
        next.saleEndDate = v;
      }

      // 사용 시작일 제약: 행사기간 내로 클램프 + 판매 시작일 이후
      if (name === 'useStartDate' && value) {
        let v = value;
        if (expoLoaded) {
          if (expoStartDate && v < expoStartDate) v = expoStartDate;
          if (expoEndDate && v > expoEndDate) v = expoEndDate;
        }
        const minBySale = next.saleStartDate || prev.saleStartDate;
        if (minBySale && v < minBySale) v = minBySale;
        next.useStartDate = v;

        // 종료일 보정: 종료일 >= 사용 시작일 && 종료일 <= 행사 종료일
        if (next.useEndDate && next.useEndDate < v) next.useEndDate = v;
        if (expoLoaded && expoEndDate && next.useEndDate && next.useEndDate > expoEndDate)
          next.useEndDate = expoEndDate;
      }

      // 사용 종료일 제약: 종료일 ∈ [사용 시작일, 행사 종료일]
      if (name === 'useEndDate' && value) {
        let v = value;
        const minUseStart = next.useStartDate || prev.useStartDate;
        if (minUseStart && v < minUseStart) v = minUseStart;
        if (expoLoaded && expoEndDate && v > expoEndDate) v = expoEndDate;
        next.useEndDate = v;
      }

      // 기존 보정: 종료일이 시작일보다 빠르면 동기화
      if (name === 'saleStartDate' && next.saleEndDate && next.saleEndDate < value) {
        next.saleEndDate = value;
      }
      if (name === 'useStartDate' && next.useEndDate && next.useEndDate < value) {
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
                  <option value="">타입 선택</option>
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
                min={expoLoaded && displayStartDate ? displayStartDate : undefined}
                max={expoLoaded && displayEndDate ? displayEndDate : undefined}
              />
              <span>~</span>
              <input
                name="saleEndDate"
                type="date"
                value={ticket.saleEndDate || ''}
                onChange={(e) => handleChange(e, true)}
                className={styles.input}
                min={
                  (ticket.saleStartDate ||
                    (expoLoaded && displayStartDate ? displayStartDate : undefined)) ||
                  undefined
                }
                max={expoLoaded && displayEndDate ? displayEndDate : undefined}
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
                min={
                  // 행사 시작일 또는 판매 시작일 중 더 늦은 날짜가 최소
                  ((() => {
                    const cands = [];
                    if (expoLoaded && expoStartDate) cands.push(expoStartDate);
                    const saleStart = ticket.saleStartDate;
                    if (saleStart) cands.push(saleStart);
                    if (!cands.length) return undefined;
                    return cands.sort()[cands.length - 1]; // 문자열 YYYY-MM-DD 정렬 안전
                  })())
                }
                max={expoLoaded && expoEndDate ? expoEndDate : undefined}
              />
              <span>~</span>
              <input
                name="useEndDate"
                type="date"
                value={ticket.useEndDate || ''}
                onChange={(e) => handleChange(e, true)}
                className={styles.input}
                min={ticket.useStartDate || (expoLoaded && expoStartDate ? expoStartDate : undefined)}
                max={expoLoaded && expoEndDate ? expoEndDate : undefined}
              />
            </div>
          ) : (
            `${ticket.useStartDate} ~ ${ticket.useEndDate}`
          )}
        </td>

        <td className={styles.td}>
          {isEdit ? (
            <div className={styles.actionGroup}>
              <button className={styles.submitBtn} onClick={handleUpdate}>
                저장
              </button>
              <button className={styles.cancelBtn} onClick={handleCancelEdit}>
                취소
              </button>
            </div>
          ) : (
            <>
              <button className={styles.editBtn} onClick={() => handleEdit(idx)}>
                수정
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(idx)}>
                삭제
              </button>
            </>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className={styles.container}>
      {/* 안내 박스 */}
      <div className={styles.alertBox}>
        <FaInfoCircle className={styles.alertIcon} />
        <span className={styles.alertText}>
          <strong>안내 :</strong>&nbsp; 사용자들의 예매가 완료된 이후로는 티켓 정보를 변경할 수 없습니다.
        </span>
      </div>

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
                        <option value="">타입 선택</option>
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
                      min={expoLoaded && displayStartDate ? displayStartDate : undefined}
                      max={expoLoaded && displayEndDate ? displayEndDate : undefined}
                    />
                    <span>~</span>
                    <input
                      name="saleEndDate"
                      type="date"
                      value={newTicket.saleEndDate}
                      onChange={handleChange}
                      className={styles.input}
                      min={
                        (newTicket.saleStartDate ||
                          (expoLoaded && displayStartDate ? displayStartDate : undefined)) ||
                        undefined
                      }
                      max={expoLoaded && displayEndDate ? displayEndDate : undefined}
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
                      min={
                        (()=>{
                          const cands = [];
                          if (expoLoaded && expoStartDate) cands.push(expoStartDate);
                          const saleStart = newTicket.saleStartDate;
                          if (saleStart) cands.push(saleStart);
                          if (!cands.length) return undefined;
                          return cands.sort()[cands.length - 1];
                        })()
                      }
                      max={expoLoaded && expoEndDate ? expoEndDate : undefined}
                    />
                    <span>~</span>
                    <input
                      name="useEndDate"
                      type="date"
                      value={newTicket.useEndDate}
                      onChange={handleChange}
                      className={styles.input}
                      min={newTicket.useStartDate || (expoLoaded && expoStartDate ? expoStartDate : undefined)}
                      max={expoLoaded && expoEndDate ? expoEndDate : undefined}
                    />
                  </div>
                </td>

                <td className={styles.td}>
                  <div className={styles.actionGroup}>
                    <button className={styles.submitBtn} onClick={handleSave}>
                      저장
                    </button>
                    <button className={styles.cancelBtn} onClick={handleCancel}>
                      취소
                    </button>
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TicketSettingForm.module.css';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { getMyExpoInfo } from '../../../api/service/expo-admin/setting/ExpoInfoService';

function TicketSettingForm({ open, onClose, onSubmit, editingTicket }) {
  const { expoId } = useParams();

  const [form, setForm] = useState(initForm());
  const [expoLoaded, setExpoLoaded] = useState(false);

  // 게시(노출) 기간
  const [displayStartDate, setDisplayStartDate] = useState('');
  const [displayEndDate, setDisplayEndDate] = useState('');
  // 행사(운영) 기간
  const [expoStartDate, setExpoStartDate] = useState('');
  const [expoEndDate, setExpoEndDate] = useState('');

  // 에러 상태 (필드별 메시지)
  const [errors, setErrors] = useState({});

  // 포커스 이동을 위한 ref 맵
  const refs = {
    name: useRef(null),
    type: useRef(null),
    description: useRef(null),
    price: useRef(null),
    totalQuantity: useRef(null),
    saleStartDate: useRef(null),
    saleEndDate: useRef(null),
    useStartDate: useRef(null),
    useEndDate: useRef(null),
  };

  function initForm() {
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

  // 모달 열릴 때 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // 제약(박람회 기간/게시기간) 로드
  useEffect(() => {
    if (!open || !expoId) return;
    let mounted = true;
    (async () => {
      try {
        const expo = await getMyExpoInfo(expoId);
        if (!mounted) return;
        setDisplayStartDate(expo?.displayStartDate?.split('T')[0] || '');
        setDisplayEndDate(expo?.displayEndDate?.split('T')[0] || '');
        setExpoStartDate(expo?.startDate?.split('T')[0] || '');
        setExpoEndDate(expo?.endDate?.split('T')[0] || '');
        setExpoLoaded(true);
      } catch (e) {
        setExpoLoaded(true); // 실패해도 폼 사용 가능
      }
    })();
    return () => {
      mounted = false;
    };
  }, [open, expoId]);

  // 모달 열림/수정 모드 전환 시 폼 초기화 + 에러 초기화
  useEffect(() => {
    if (editingTicket) setForm(editingTicket);
    else setForm(initForm());
    setErrors({});
  }, [editingTicket, open]);

  // YYYY-MM-DD 범위 클램프
  const clampDate = (v, min, max) => {
    if (!v) return v;
    let nv = v;
    if (min && nv < min) nv = min;
    if (max && nv > max) nv = max;
    return nv;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let next = { ...prev, [name]: value };

      // 판매 시작일: 게시기간 내로 클램프 (유지)
      if (name === 'saleStartDate') {
        const clamped = expoLoaded
          ? clampDate(value, displayStartDate || undefined, displayEndDate || undefined)
          : value;
        next.saleStartDate = clamped;

        // 종료일 보정: 종료일은 "박람회 종료일(expoEndDate)"을 상한으로
        if (next.saleEndDate && next.saleEndDate < clamped) next.saleEndDate = clamped;
        if (expoLoaded && expoEndDate && next.saleEndDate && next.saleEndDate > expoEndDate) {
          next.saleEndDate = expoEndDate;
        }
        // 사용일 보정 (기존 유지)
        if (next.useStartDate && next.useStartDate < clamped) next.useStartDate = clamped;
        if (next.useEndDate && next.useEndDate < (next.useStartDate || clamped)) {
          next.useEndDate = next.useStartDate || clamped;
        }
      }

      // 판매 종료일: [판매 시작일(또는 게시 시작일), 박람회 종료일] 로 클램프
      if (name === 'saleEndDate') {
        const minStart = next.saleStartDate || prev.saleStartDate;
        next.saleEndDate = expoLoaded
          ? clampDate(
              value,
              minStart || displayStartDate || undefined,
              expoEndDate || undefined
            )
          : value;
      }

      // 사용 시작일: 행사기간 내 + 판매 시작일 이후 (유지)
      if (name === 'useStartDate') {
        const minBySale = next.saleStartDate || prev.saleStartDate;
        let min = expoStartDate || undefined;
        if (minBySale) min = min ? (minBySale > min ? minBySale : min) : minBySale;
        const clamped = expoLoaded ? clampDate(value, min, expoEndDate || undefined) : value;
        next.useStartDate = clamped;

        // 종료일 보정 (유지)
        if (next.useEndDate && next.useEndDate < clamped) next.useEndDate = clamped;
        if (expoLoaded && expoEndDate && next.useEndDate && next.useEndDate > expoEndDate) {
          next.useEndDate = expoEndDate;
        }
      }

      // 사용 종료일: [사용 시작일, 행사 종료일] (유지)
      if (name === 'useEndDate') {
        const minUseStart = next.useStartDate || prev.useStartDate || expoStartDate || undefined;
        next.useEndDate = expoLoaded
          ? clampDate(value, minUseStart, expoEndDate || undefined)
          : value;
      }

      // 안전장치
      if (name === 'saleStartDate' && next.saleEndDate && next.saleEndDate < next.saleStartDate) {
        next.saleEndDate = next.saleStartDate;
      }
      if (name === 'useStartDate' && next.useEndDate && next.useEndDate < next.useStartDate) {
        next.useEndDate = next.useStartDate;
      }

      return next;
    });

    // 필드 수정 시 해당 에러 즉시 제거
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // 사용 시작일 input용 min 계산 (행사 시작 vs 판매 시작 중 늦은 날짜)
  const minUseStart = useMemo(() => {
    const cands = [];
    if (expoStartDate) cands.push(expoStartDate);
    if (form.saleStartDate) cands.push(form.saleStartDate);
    if (!cands.length) return undefined;
    return cands.sort()[cands.length - 1];
  }, [expoStartDate, form.saleStartDate]);

  // ============== 유효성 검사(모든 에러 한 번에) ==============
  const isBlank = (s) => !s || String(s).trim() === '';

  const runValidation = () => {
    const e = {};

    // 왼쪽 컬럼: 이름/타입/설명
    if (isBlank(form.name)) e.name = '티켓 이름은 필수입니다.';
    else if (form.name.length > 100) e.name = '티켓 이름은 100자 이하여야 합니다.';

    if (isBlank(form.type)) e.type = '티켓 타입은 필수입니다.';

    if (isBlank(form.description)) e.description = '티켓 설명은 필수입니다.';

    // 오른쪽: 가격/수량
    if (form.price === '' || form.price === null) e.price = '티켓 가격은 필수입니다.';
    else if (isNaN(Number(form.price))) e.price = '가격은 숫자여야 합니다.';
    else if (Number(form.price) < 0) e.price = '가격은 0원 이상이어야 합니다.';

    if (form.totalQuantity === '' || form.totalQuantity === null)
      e.totalQuantity = '티켓 수량은 필수입니다.';
    else if (isNaN(Number(form.totalQuantity)))
      e.totalQuantity = '티켓 수량은 숫자여야 합니다.';
    else if (Number(form.totalQuantity) < 1)
      e.totalQuantity = '티켓 수량은 1장 이상이어야 합니다.';

    // 판매기간: 둘 다 필수
    if (isBlank(form.saleStartDate)) e.saleStartDate = '판매 시작일은 필수입니다.';
    if (isBlank(form.saleEndDate)) e.saleEndDate = '판매 종료일은 필수입니다.';

    // 판매기간 제약
    if (!e.saleStartDate && !e.saleEndDate && form.saleStartDate && form.saleEndDate) {
      if (form.saleEndDate < form.saleStartDate) {
        e.saleEndDate = '판매 종료일은 시작일과 같거나 이후여야 합니다.';
      }
      // 시작일은 게시기간 내 (유지)
      if (displayStartDate && form.saleStartDate < displayStartDate) {
        e.saleStartDate = '판매 시작일은 게시 시작일과 같거나 이후여야 합니다.';
      }
      if (displayEndDate && form.saleStartDate > displayEndDate) {
        e.saleStartDate = '판매 시작일은 게시 종료일과 같거나 이전이어야 합니다.';
      }
      // 종료일은 "박람회 종료일" 이내
      if (expoEndDate && form.saleEndDate > expoEndDate) {
        e.saleEndDate = '판매 종료일은 박람회 종료일과 같거나 이전이어야 합니다.';
      }
    }

    // 사용기간: 둘 다 필수
    if (isBlank(form.useStartDate)) e.useStartDate = '사용 시작일은 필수입니다.';
    if (isBlank(form.useEndDate)) e.useEndDate = '사용 종료일은 필수입니다.';

    // 사용기간 제약 (유지)
    if (!e.useStartDate && !e.useEndDate && form.useStartDate && form.useEndDate) {
      if (form.useEndDate < form.useStartDate) {
        e.useEndDate = '사용 종료일은 시작일과 같거나 이후여야 합니다.';
      }
      if (form.saleStartDate && form.useStartDate < form.saleStartDate) {
        e.useStartDate = '사용 시작일은 판매 시작일과 같거나 이후여야 합니다.';
      }
      if (expoStartDate && form.useStartDate < expoStartDate) {
        e.useStartDate = '사용 시작일은 행사 시작일과 같거나 이후여야 합니다.';
      }
      if (expoEndDate && form.useEndDate > expoEndDate) {
        e.useEndDate = '사용 종료일은 행사 종료일과 같거나 이전이어야 합니다.';
      }
    }

    return e;
  };

  const focusFirstError = (e) => {
    const order = [
      'name',
      'type',
      'description',
      'price',
      'totalQuantity',
      'saleStartDate',
      'saleEndDate',
      'useStartDate',
      'useEndDate',
    ];
    for (const key of order) {
      if (e[key]) {
        refs[key]?.current?.focus?.();
        break;
      }
    }
  };

  const handleSubmit = async () => {
    const e = runValidation();
    setErrors(e);
    if (Object.values(e).some(Boolean)) {
      focusFirstError(e);
      return;
    }
    const payload = {
      ...form,
      price: form.price === '' ? '' : Number(form.price),
      totalQuantity: form.totalQuantity === '' ? '' : Number(form.totalQuantity),
    };
    const success = await onSubmit(payload);
    if (success) {
      setForm(initForm());
      setErrors({});
      onClose?.();
    }
  };

  const handleCancel = () => {
    setForm(initForm());
    setErrors({});
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{editingTicket ? '티켓 수정' : '티켓 등록'}</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <FaTimes className={styles.closeIcon} />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className={styles.modalContent}>
          <div className={styles.container}>
            <div className={styles.formGrid}>
              {/* 왼쪽 컬럼: 기본 정보 */}
              <div className={styles.column}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>티켓 이름</label>
                  <input
                    ref={refs.name}
                    name="name"
                    className={styles.inputField}
                    placeholder="티켓 이름 입력"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className={styles.errorText}>{errors.name}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>타입</label>
                  <select
                    ref={refs.type}
                    name="type"
                    className={styles.inputField}
                    value={form.type}
                    onChange={handleChange}
                    aria-invalid={!!errors.type}
                  >
                    <option value="">타입 선택</option>
                    <option value="얼리버드">얼리버드</option>
                    <option value="일반">일반</option>
                  </select>
                  {errors.type && <p className={styles.errorText}>{errors.type}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>설명</label>
                  <input
                    ref={refs.description}
                    name="description"
                    className={styles.inputField}
                    placeholder="설명 입력"
                    value={form.description}
                    onChange={handleChange}
                    aria-invalid={!!errors.description}
                  />
                  {errors.description && (
                    <p className={styles.errorText}>{errors.description}</p>
                  )}
                </div>
              </div>

              {/* 오른쪽 컬럼: 가격/수량 + 기간 */}
              <div className={styles.column}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>가격(원)</label>
                  <input
                    ref={refs.price}
                    type="number"
                    name="price"
                    className={styles.inputField}
                    placeholder="가격 입력"
                    value={form.price}
                    onChange={handleChange}
                    min={0}
                    aria-invalid={!!errors.price}
                  />
                  {errors.price && <p className={styles.errorText}>{errors.price}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>수량</label>
                  <input
                    ref={refs.totalQuantity}
                    type="number"
                    name="totalQuantity"
                    className={styles.inputField}
                    placeholder="수량 입력"
                    value={form.totalQuantity}
                    onChange={handleChange}
                    min={1}
                    aria-invalid={!!errors.totalQuantity}
                  />
                  {errors.totalQuantity && (
                    <p className={styles.errorText}>{errors.totalQuantity}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>판매 기간</label>
                  <div className={styles.timeRange}>
                    <input
                      ref={refs.saleStartDate}
                      type="date"
                      name="saleStartDate"
                      className={styles.inputField}
                      value={form.saleStartDate}
                      onChange={handleChange}
                      min={expoLoaded && displayStartDate ? displayStartDate : undefined}
                      max={expoLoaded && displayEndDate ? displayEndDate : undefined}
                      aria-invalid={!!errors.saleStartDate}
                    />
                    <span className={styles.timeDivider}>~</span>
                    <input
                      ref={refs.saleEndDate}
                      type="date"
                      name="saleEndDate"
                      className={styles.inputField}
                      value={form.saleEndDate}
                      onChange={handleChange}
                      min={
                        (form.saleStartDate ||
                          (expoLoaded && displayStartDate ? displayStartDate : undefined)) ||
                        undefined
                      }
                      // 판매 종료일의 상한은 "박람회 종료일"
                      max={expoLoaded && expoEndDate ? expoEndDate : undefined}
                      aria-invalid={!!errors.saleEndDate}
                    />
                  </div>
                  {(errors.saleStartDate || errors.saleEndDate) && (
                    <p className={styles.errorText}>
                      {errors.saleStartDate || errors.saleEndDate}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>사용 기간</label>
                  <div className={styles.timeRange}>
                    <input
                      ref={refs.useStartDate}
                      type="date"
                      name="useStartDate"
                      className={styles.inputField}
                      value={form.useStartDate}
                      onChange={handleChange}
                      min={expoLoaded ? minUseStart : undefined}
                      max={expoLoaded && expoEndDate ? expoEndDate : undefined}
                      aria-invalid={!!errors.useStartDate}
                    />
                    <span className={styles.timeDivider}>~</span>
                    <input
                      ref={refs.useEndDate}
                      type="date"
                      name="useEndDate"
                      className={styles.inputField}
                      value={form.useEndDate}
                      onChange={handleChange}
                      min={
                        form.useStartDate ||
                        (expoLoaded && expoStartDate ? expoStartDate : undefined)
                      }
                      max={expoLoaded && expoEndDate ? expoEndDate : undefined}
                      aria-invalid={!!errors.useEndDate}
                    />
                  </div>
                  {(errors.useStartDate || errors.useEndDate) && (
                    <p className={styles.errorText}>
                      {errors.useStartDate || errors.useEndDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 구분선 + 버튼 */}
            <div className={styles.buttonDivider} />
            <div className={styles.buttonGroup}>
              <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSubmit}>
                <FaCheckCircle className={styles.iconBtn} /> {editingTicket ? '수정' : '등록'}
              </button>
              <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleCancel}>
                <FaTimesCircle className={styles.iconBtn} /> 취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketSettingForm;
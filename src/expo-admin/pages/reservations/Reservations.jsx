import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { FaEnvelope, FaDownload, FaQrcode } from 'react-icons/fa';
import styles from './Reservations.module.css';
import Tab from '../../../common/components/tab/Tab';
import ReservationTable from '../../components/reservationTable/ReservationTable';
import Pagination from '../../../common/components/pagination/Pagination';
import EmailModal from '../../components/emailModal/EmailModal';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import {
  getMyExpoReservation,
  getExpoTicketNames,
  updateReserverQrCodeForManualCheckIn,
  downloadMyReservationExcelFile,
} from '../../../api/service/expo-admin/reservation/ReservationService';
import { reissueReserverQrCode } from '../../../api/service/expo-admin/reservation/ReservationService';

const tabLabels = ['전체', '발급 대기', '입장 전', '입장 완료', '티켓 만료'];

function Reservations() {
  const { expoId } = useParams();

  // UI 상태
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReissuing, setIsReissuing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // ✅ 추가: 성공 토스트 메시지

  // 필터/페이징
  const [currentTab, setCurrentTab] = useState('전체');
  const [searchType, setSearchType] = useState('phone');
  const [searchText, setSearchText] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketOptions, setTicketOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [pageInfo, setPageInfo] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    size: 0,
    totalElements: 0,
  });

  // 선택 상태(페이지 간 유지)
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  // id -> {name,email,phone,entranceStatus}
  const [selectedMap, setSelectedMap] = useState(() => new Map());
  const [selectAllMatching, setSelectAllMatching] = useState(false); // 전체 선택(검색 결과 전부)

  // 재발급 완료 행 표시용
  const [reissuedIds, setReissuedIds] = useState(() => new Set());

  // 현재 페이지의 id 목록
  const currentPageIds = useMemo(
    () =>
      (pageInfo.content || []).map(
        (r, i) => r?.reserverId ?? `${r?.reservationCode || 'row'}-${i}`
      ),
    [pageInfo.content]
  );

  // 티켓 목록 조회
  useEffect(() => {
    (async () => {
      try {
        const names = await getExpoTicketNames(expoId);
        const sorted = (names ?? [])
          .slice()
          .sort((a, b) => a.localeCompare(b, 'ko-KR', { sensitivity: 'base' }));
        setTicketOptions(sorted);
      } catch (error) {
        triggerToastFail(error.message);
      }
    })();
  }, [expoId]);

  // 예약자 목록 조회
  const fetchReservations = useCallback(async () => {
    try {
      const entranceStatusParam = currentTab === '전체' ? undefined : currentTab;
      const trimmed = searchText.trim();
      const nameParam = searchType === 'name' ? (trimmed || undefined) : undefined;
      const phoneParam = searchType === 'phone' ? (trimmed || undefined) : undefined;
      const codeParam =
        searchType === 'reservationCode' ? (trimmed || undefined) : undefined;
      const ticketParam = ticketName || undefined;

      const res = await getMyExpoReservation(
        expoId,
        currentPage,
        pageSize,
        entranceStatusParam,
        nameParam,
        phoneParam,
        codeParam,
        ticketParam
      );

      setPageInfo({
        content: res.content ?? [],
        totalPages: res.page?.totalPages ?? 0,
        number: res.page?.number ?? 0,
        size: res.page?.size ?? pageSize,
        totalElements: res.page?.totalElements ?? 0,
      });
    } catch (error) {
      triggerToastFail(error.message);
    }
  }, [expoId, currentPage, pageSize, currentTab, searchText, searchType, ticketName]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // 필터/탭/검색 변경 시 선택 초기화
  useEffect(() => {
    setSelectedIds(new Set());
    setSelectedMap(new Map());
    setSelectAllMatching(false);
  }, [expoId, currentTab, searchType, searchText, ticketName]);

  // 수기 입장 처리
  const handleEntranceBadgeClick = async (row) => {
    if (!window.confirm('입장 처리를 진행하시겠습니까?')) return;
    try {
      const updated = await updateReserverQrCodeForManualCheckIn(expoId, row.reserverId);
      if (updated && updated.reserverId) {
        setPageInfo((prev) => ({
          ...prev,
          content: prev.content.map((it) =>
            it.reserverId === updated.reserverId ? updated : it
          ),
        }));
      } else {
        await fetchReservations();
      }
      triggerSuccessToast('입장 처리가 완료되었습니다.'); // ✅ 수정
    } catch (e) {
      triggerToastFail(e.message);
    }
  };

  // 행 선택 토글
  const handleToggleRow = (id, row) => {
    setSelectAllMatching(false);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const exists = next.has(id);
      if (exists) {
        next.delete(id);
        setSelectedMap((m) => {
          const mm = new Map(m);
          mm.delete(id);
          return mm;
        });
      } else {
        next.add(id);
        setSelectedMap((m) => {
          const mm = new Map(m);
          mm.set(id, {
            name: row?.name ?? '',
            email: row?.email ?? '',
            phone: row?.phone ?? '',
            entranceStatus: row?.entranceStatus ?? '', // 상태 저장
          });
          return mm;
        });
      }
      return next;
    });
  };

  // 현재 페이지 전체 토글
  const handleTogglePage = (idsOfCurrentPage, rowsOfCurrentPage) => {
    setSelectAllMatching(false);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = idsOfCurrentPage.every((id) => next.has(id));
      setSelectedMap((m) => {
        const mm = new Map(m);
        if (allSelected) {
          idsOfCurrentPage.forEach((id) => {
            next.delete(id);
            mm.delete(id);
          });
        } else {
          idsOfCurrentPage.forEach((id, idx) => {
            if (!next.has(id)) {
              next.add(id);
              const row = rowsOfCurrentPage[idx];
              mm.set(id, {
                name: row?.name ?? '',
                email: row?.email ?? '',
                phone: row?.phone ?? '',
                entranceStatus: row?.entranceStatus ?? '', // 상태 저장
              });
            }
          });
        }
        return mm;
      });
      return next;
    });
  };

  // 전체 선택/해제 + 선택 취소
  const selectAllResults = () => setSelectAllMatching(true);
  const clearAllResults = () => setSelectAllMatching(false);
  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectedMap(new Map());
    setSelectAllMatching(false);
  };

  // 모달 전달용 수신자 배열
  const selectedRecipients = useMemo(
    () => Array.from(selectedMap.values()),
    [selectedMap]
  );

  // 모달 오픈 가드
  const handleOpenEmailModal = () => {
    const hasRecipients = selectAllMatching || selectedRecipients.length > 0;
    if (!hasRecipients) {
      triggerToastFail('선택된 수신자가 없습니다.');
      return;
    }
    setShowEmailModal(true);
  };

  // 엑셀 다운로드
  const handleExcelDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await downloadMyReservationExcelFile(expoId);
      const contentDisposition = response.headers['content-disposition'];
      let fileName = '예약자_명단.xlsx';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = decodeURIComponent(fileNameMatch[1]);
        }
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      triggerSuccessToast('엑셀 다운로드가 완료되었습니다.'); // ✅ 수정
    } catch (e) {
      triggerToastFail(e.message || '다운로드에 실패했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  // QR 재발급 호출
  const selectedCount = selectAllMatching ? pageInfo.totalElements : selectedIds.size;

  const handleReissueQR = async () => {
    if (isReissuing) return;

    if (selectedCount === 0) {
      triggerToastFail('선택된 예약자가 없습니다.');
      return;
    }

    // “입장 전”만 재발급 허용
    if (selectAllMatching) {
      if (currentTab !== '입장 전') {
        triggerToastFail('입장 전 상태만 QR 재발급이 가능합니다.');
        return;
      }
    } else {
      const hasInvalid = Array.from(selectedIds).some((id) => {
        const info = selectedMap.get(id);
        return !info || info.entranceStatus !== '입장 전';
      });
      if (hasInvalid) {
        triggerToastFail('입장 전 상태만 QR 재발급이 가능합니다.');
        return;
      }
    }

    const selectedReserverIds = Array.from(selectedIds)
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));

    const dto = selectAllMatching
      ? { selectAllMatching: true }
      : { selectAllMatching: false, reserverIds: selectedReserverIds };

    const params = {
      entranceStatus: currentTab === '전체' ? undefined : currentTab,
      name: searchType === 'name' ? (searchText.trim() || undefined) : undefined,
      phone: searchType === 'phone' ? (searchText.trim() || undefined) : undefined,
      reservationCode:
        searchType === 'reservationCode' ? (searchText.trim() || undefined) : undefined,
      ticketName: ticketName || undefined,
    };

    try {
      setIsReissuing(true);
      const updatedList = await reissueReserverQrCode(expoId, dto, params);

      if (Array.isArray(updatedList) && updatedList.length > 0) {
        setPageInfo((prev) => ({
          ...prev,
          content: (prev.content || []).map((row) => {
            const hit = updatedList.find((u) => u.reserverId === row.reserverId);
            return hit ? hit : row;
          }),
        }));

        const ids = new Set(updatedList.map((u) => u.reserverId));
        setReissuedIds(ids);
        setTimeout(() => setReissuedIds(new Set()), 3000);
      } else {
        await fetchReservations();
      }

      clearSelection();
      triggerSuccessToast('QR 재발급이 성공적으로 완료되었습니다.'); // ✅ 수정
    } catch (e) {
      triggerToastFail(e.message || 'QR 재발급에 실패했습니다.');
    } finally {
      setIsReissuing(false);
    }
  };

  // 페이지/탭 핸들링
  const handlePageChange = (page) => setCurrentPage(page);
  const handleTabChange = (index) => {
    const selectedTab = tabLabels[index];
    setCurrentPage(0);
    setCurrentTab(selectedTab);
  };

  // ✅ 토스트
  const triggerSuccessToast = (msg) => {
    setSuccessMessage(msg || '처리가 완료되었습니다.');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };
  const triggerToastFail = (msg) => {
    setFailMessage(msg || '요청을 처리하지 못했습니다.');
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 2000);
  };

  // 컨트롤러로 넘길 현재 필터 파라미터 (모달/재발급 공통)
  const entranceStatusParam = currentTab === '전체' ? undefined : currentTab;
  const trimmed = searchText.trim();
  const nameParam = searchType === 'name' ? (trimmed || undefined) : undefined;
  const phoneParam = searchType === 'phone' ? (trimmed || undefined) : undefined;
  const reservationCodeParam =
    searchType === 'reservationCode' ? (trimmed || undefined) : undefined;
  const ticketNameParam = ticketName || undefined;

  return (
    <div className={styles.reservationsWrapper}>
      <Tab tabs={tabLabels} onTabChange={handleTabChange} />

      {(selectedIds.size > 0 || selectAllMatching) && (
        <div className={styles.selectionBar}>
          <span>
            {selectAllMatching
              ? `검색 결과 전체 ${pageInfo.totalElements}건이 선택되었습니다.`
              : `${selectedIds.size}건 선택됨`}
          </span>

          {!selectAllMatching && pageInfo.totalElements > selectedIds.size && (
            <button className={styles.selectionLinkBtn} onClick={selectAllResults}>
              검색 결과 전체 선택
            </button>
          )}
          {selectAllMatching && (
            <button className={styles.selectionLinkBtn} onClick={clearAllResults}>
              전체 선택 취소
            </button>
          )}

          <button className={styles.selectionClearBtn} onClick={clearSelection}>
            선택 취소
          </button>
        </div>
      )}

      <div className={styles.topControls}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchText('');
                setCurrentPage(0);
              }}
              className={styles.select}
            >
              <option value="phone">전화번호</option>
              <option value="reservationCode">예매번호</option>
              <option value="name">이름</option>
            </select>

            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(0);
              }}
              className={styles.input}
              placeholder="검색어 입력"
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={ticketName}
              onChange={(e) => {
                setTicketName(e.target.value);
                setCurrentPage(0);
              }}
              className={styles.select}
            >
              <option value="">티켓 분류</option>
              {ticketOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.actionBtn} ${styles.emailBtn}`}
            onClick={handleOpenEmailModal}
          >
            <FaEnvelope className={styles.icon} />
            이메일 전송
          </button>
          <button
            className={`${styles.actionBtn} ${styles.excelBtn}`}
            onClick={handleExcelDownload}
            disabled={isDownloading}
            title={isDownloading ? '다운로드 중...' : undefined}
          >
            <FaDownload className={styles.icon} />
            엑셀 추출
          </button>
          <button
            className={`${styles.actionBtn} ${styles.qrBtn}`}
            onClick={handleReissueQR}
            disabled={isReissuing}
            title={isReissuing ? '재발급 중...' : undefined}
          >
            <FaQrcode className={styles.icon} />
            {isReissuing ? '재발급 중...' : 'QR 재발급'}
          </button>
        </div>
      </div>

      <ReservationTable
        data={pageInfo.content}
        selectedIds={selectedIds}
        selectAllMatching={selectAllMatching}
        onToggleRow={handleToggleRow}
        onTogglePage={handleTogglePage}
        onEntranceClick={handleEntranceBadgeClick}
        reissuedIds={reissuedIds}
      />

      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        expoId={expoId}
        selectAllMatching={selectAllMatching}
        selectedRecipients={selectedRecipients}
        totalElements={pageInfo.totalElements}
        triggerToastFail={triggerToastFail}
        triggerSuccessToast={triggerSuccessToast}
        onAfterSend={() => {
          clearSelection();
          setShowEmailModal(false);
        }}
        entranceStatus={entranceStatusParam}
        name={nameParam}
        phone={phoneParam}
        reservationCode={reservationCodeParam}
        ticketName={ticketNameParam}
      />

      {showSuccessToast && <ToastSuccess message={successMessage} />}{/* ✅ 메시지 전달 */}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default Reservations;
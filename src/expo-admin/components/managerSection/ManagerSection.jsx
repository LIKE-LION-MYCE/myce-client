import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ManagerSection.module.css';
import { FaSave, FaSpinner } from 'react-icons/fa';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { getMyExpoManagers, updateMyExpoManagers } from '../../../api/service/expo-admin/operation/ManagerService';

const permissionTabs = {
  '박람회 관리': ['isExpoDetailUpdate', 'isBoothInfoUpdate', 'isScheduleUpdate'],
  '예약 관리': ['isReserverListView', 'isPaymentView', 'isEmailLogView'],
  '운영 설정': ['isOperationsConfigUpdate'],
  '기타': ['isInquiryView'],
};

const permissionLabels = {
  isExpoDetailUpdate: '박람회 상세',
  isBoothInfoUpdate: '참가 부스',
  isScheduleUpdate: '행사 일정',
  isPaymentView: '예약 내역',
  isReserverListView: '예약자 리스트',
  isEmailLogView: '이메일 전송 이력',
  isOperationsConfigUpdate: '운영 설정',
  isInquiryView: '문의',
};

const permissionLabelsFlat = Object.values(permissionLabels);
const permissionKeysFlat = Object.keys(permissionLabels);
const loginAccountCode = '로그인계정';

const processApiData = (apiData) => {
  const processedData = {};
  apiData.forEach(item => {
    const permissions = new Set();
    permissionKeysFlat.forEach(key => {
      if (item[key] === true) {
        permissions.add(permissionLabels[key]);
      }
    });
    processedData[item.adminCode] = {
      id: item.id,
      permissions,
    };
  });
  processedData[loginAccountCode] = {
    id: null,
    permissions: new Set(Object.values(permissionLabels)),
  };
  return processedData;
};

function ManagerSection() {
  const { expoId } = useParams();
  const [permissionsByCode, setPermissionsByCode] = useState({});
  const [apiCodes, setApiCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const triggerSuccessToast = (msg) => {
    setSuccessMessage(msg || '성공적으로 처리되었습니다.');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };

  const triggerToastFail = (message) => {
    setFailMessage(message || '요청 처리 중 오류가 발생했습니다.');
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 2000);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getMyExpoManagers(expoId);
      const processedData = processApiData(data);
      const fetchedCodes = data.map(item => item.adminCode);
      const finalCodes = [loginAccountCode, ...fetchedCodes];
      setPermissionsByCode(processedData);
      setApiCodes(finalCodes);
    } catch (err) {
      triggerToastFail(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [expoId]);

  const togglePermission = (code, permission) => {
    if (code === loginAccountCode) return;
    setPermissionsByCode((prev) => {
      const newSet = new Set(prev[code].permissions);
      newSet.has(permission) ? newSet.delete(permission) : newSet.add(permission);
      return {
        ...prev,
        [code]: {
          ...prev[code],
          permissions: newSet,
        },
      };
    });
  };

  const saveAll = async () => {
    const dataToSend = apiCodes
      .filter(code => code !== loginAccountCode)
      .map(code => {
        const { id, permissions } = permissionsByCode[code];
        const payload = { id, adminCode: code };
        permissionKeysFlat.forEach(key => {
          payload[key] = permissions?.has(permissionLabels[key]) || false;
        });
        return payload;
      });

    try {
      const updatedData = await updateMyExpoManagers(expoId, dataToSend);
      const processedData = processApiData(updatedData);
      const fetchedCodes = updatedData.map(item => item.adminCode);
      const finalCodes = [loginAccountCode, ...fetchedCodes];
      setPermissionsByCode(processedData);
      setApiCodes(finalCodes);
      triggerSuccessToast('권한 설정이 저장되었습니다.');
    } catch (error) {
      triggerToastFail(error.message);
    }
  };

  const getGroupClass = (index) => {
    const groupStarts = [0];
    Object.values(permissionTabs).reduce((sum, arr) => {
      const nextSum = sum + arr.length;
      groupStarts.push(nextSum);
      return nextSum;
    }, 0);
    return groupStarts.includes(index) ? styles.groupStart : '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerControls}>
        <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={saveAll}>
          <FaSave className={styles.icon} />
          저장
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th rowSpan={2} className={`${styles.th} ${styles.codeCell}`}>코드</th>
              {Object.keys(permissionTabs).map((tab) => (
                <th
                  key={tab}
                  colSpan={permissionTabs[tab].length}
                  className={`${styles.th} ${styles.groupStart}`}
                >
                  {tab}
                </th>
              ))}
            </tr>
            <tr>
              {permissionLabelsFlat.map((label, idx) => (
                <th key={label} className={`${styles.th} ${getGroupClass(idx)}`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={permissionLabelsFlat.length + 1} className={styles.loadingRow}>
                  <FaSpinner className={styles.spinner} /> 불러오는 중...
                </td>
              </tr>
            ) : (
              apiCodes.map((code) => (
                <tr key={code}>
                  <td className={`${styles.td} ${styles.codeCell}`}>{code}</td>
                  {permissionLabelsFlat.map((label, idx) => (
                    <td key={label} className={`${styles.td} ${getGroupClass(idx)}`}>
                      <input
                        type="checkbox"
                        checked={permissionsByCode[code]?.permissions?.has(label) || false}
                        onChange={() => togglePermission(code, label)}
                        disabled={code === loginAccountCode}
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showSuccessToast && <ToastSuccess message={successMessage} />}
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
}

export default ManagerSection;
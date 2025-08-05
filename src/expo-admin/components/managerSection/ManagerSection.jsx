import { useState } from 'react';
import styles from './ManagerSection.module.css';
import { FaSave } from 'react-icons/fa';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';

const permissionTabs = {
  '박람회 관리': ['박람회 상세', '참가 부스', '행사 일정'],
  '예약 관리': ['예약자 리스트', '결제 내역', '이메일 전송 이력'],
  '운영 설정': ['운영 설정'],
  '기타': ['정산', '문의'],
};

const codes = ['로그인계정', 'AB12CD', 'ZX98MN', 'JK34PO', 'YM77XZ', 'KT22LM'];

const initialPermissions = {
  로그인계정: new Set(Object.values(permissionTabs).flat()),
  AB12CD: new Set(['박람회 관리', '참가 부스', '행사 일정', '정산']),
  ZX98MN: new Set(['예약자 리스트', '이메일 전송 이력']),
  JK34PO: new Set(['운영사 정보 수정', '담당자 관리']),
  YM77XZ: new Set(['기본 설정', '이메일 전송 이력', '문의']),
  KT22LM: new Set(['참가 부스', '정산', '문의']),
};

function ManagerSection() {
  const [permissionsByCode, setPermissionsByCode] = useState(initialPermissions);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const togglePermission = (code, permission) => {
    if (code === '로그인계정') return;
    setPermissionsByCode((prev) => {
      const newSet = new Set(prev[code]);
      newSet.has(permission) ? newSet.delete(permission) : newSet.add(permission);
      return { ...prev, [code]: newSet };
    });
  };

  const saveAll = () => {
    codes.forEach((code) => {
      if (code === '로그인계정') return;
      const selected = Array.from(permissionsByCode[code]);
      console.log(`📝 저장 - 코드 ${code}:`, selected);
    });

    triggerToast(); 
  };

  const permissionLabels = Object.values(permissionTabs).flat();
  const groupBoundaries = Object.values(permissionTabs).map((arr) => arr.length);

  const getGroupClass = (index) => {
    const groupStarts = [0];
    groupBoundaries.reduce((sum, len) => {
      groupStarts.push(sum + len);
      return sum + len;
    }, 0);
    return groupStarts.includes(index) ? styles.groupStart : '';
  };

  return (
    <div className={styles.container}>
      {showToast && <ToastSuccess />}

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
              {permissionLabels.map((label, idx) => (
                <th key={label} className={`${styles.th} ${getGroupClass(idx)}`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code}>
                <td className={`${styles.td} ${styles.codeCell}`}>{code}</td>
                {permissionLabels.map((label, idx) => (
                  <td key={label} className={`${styles.td} ${getGroupClass(idx)}`}>
                    <input
                      type="checkbox"
                      checked={permissionsByCode[code]?.has(label) || false}
                      onChange={() => togglePermission(code, label)}
                      disabled={code === '로그인계정'}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerSection;
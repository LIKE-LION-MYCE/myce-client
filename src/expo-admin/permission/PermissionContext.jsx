import { createContext, useContext, useEffect, useState } from "react";
import { getMyPermission } from "../../api/service/expo-admin/permission/PermissionService";

// 1) 컨텍스트 생성
const PermissionContext = createContext(null);

// 2) Provider
export function PermissionProvider({ children }) {
  const [perm, setPerm] = useState(null);

  // 권한 재로딩
  const loadPermission  = async () => {
    try {
      const data = await getMyPermission();
      setPerm(data ?? null);
    } catch (e) {
      console.error("권한 로드 실패:", e?.message || e);
      setPerm(null);
    }
  };

  // 최초 1회 로드
  useEffect(() => {
    loadPermission();
  }, []);

  return (
    <PermissionContext.Provider value={{ perm }}>
      {children}
    </PermissionContext.Provider>
  );
}

// 3) 사용 훅
export function usePermission() {
  const ctx = useContext(PermissionContext);
  return ctx; // { perm }
}
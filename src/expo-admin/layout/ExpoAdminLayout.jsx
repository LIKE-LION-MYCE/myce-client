import { useEffect, useState } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import styles from './ExpoAdminLayout.module.css';
import ExpoAdminHeader from "./header/ExpoAdminHeader";
import ExpoAdminSideBar from "./sidebar/ExpoAdminSidebar";

import { jwtDecode } from 'jwt-decode';
import instance from "../../api/lib/axios";
import { usePermission } from "../permission/PermissionContext";
import AccessDeniedPage from "../../common/pages/AccessDeniedPage";


function ExpoAdminLayout() {
  const { expoId } = useParams();
  const location = useLocation();
  const { perm } = usePermission();

  const [hasExpoAccess, setHasExpoAccess] = useState(null);

  // 1) expoId 접근 권한(해당 박람회 소속 여부) 체크 및 직입 방지
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (!perm) return;

        const token = localStorage.getItem('access_token');
        if (!token) {
          setHasExpoAccess(false);
          return;
        }

        const decodedToken = jwtDecode(token);

        if (decodedToken.loginType === 'ADMIN_CODE') {
          // AdminCode 로그인: 채팅 API로 권한 체크
          try {
            await instance.get(`/expos/${expoId}/chats/rooms`);
            setHasExpoAccess(true);
          } catch (error) {
            console.error("AdminCode 권한 확인 실패:", error.message);
            setHasExpoAccess(false);
          }
        } else {
          // MEMBER 로그인: Permission Context 사용
          const expoIdNumber = Number(expoId);
          setHasExpoAccess(perm.expoIds.includes(expoIdNumber));
        }
      } catch (error) {
        console.error("권한 확인 실패:", error.message);
        setHasExpoAccess(false);
      }
    };
    checkPermission();
  }, [perm, expoId]);

  if (hasExpoAccess === null) return <AccessDeniedPage />;
  if (hasExpoAccess == false) return <AccessDeniedPage />;

  // 2) 페이지별 권한 체크 (주소창 직입 방지)
  const basePath = `/expos/${expoId}/admin`;
  const path = location.pathname;

  const pageAllowed = hasPagePermission(path, basePath, perm);

  if (!pageAllowed) return <AccessDeniedPage />;

  return (
    <div className={styles.layout}>
      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <ExpoAdminSideBar />
        </div>
        <div className={styles.main}>
          <div className={styles.header}>
            <ExpoAdminHeader />
          </div>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpoAdminLayout;


function hasPagePermission(path, basePath, perm) {
  if (path === basePath || path === `${basePath}/`) return true;

  const rules = [
    { match: `${basePath}/setting`, allow: !!perm?.isExpoDetailUpdate },
    { match: `${basePath}/booths`, allow: !!perm?.isBoothInfoUpdate },
    { match: `${basePath}/events`, allow: !!perm?.isScheduleUpdate },
    { match: `${basePath}/payments`, allow: !!perm?.isPaymentView },
    { match: `${basePath}/reservations`, allow: !!perm?.isReserverListView },
    { match: `${basePath}/emails`, allow: !!perm?.isEmailLogView },
    { match: `${basePath}/operation`, allow: !!perm?.isOperationsConfigUpdate },
    { match: `${basePath}/inquiry`, allow: !!perm?.isInquiryView },
  ];

  for (const r of rules) {
    if (path.startsWith(r.match)) return r.allow;
  }
  return true;
}

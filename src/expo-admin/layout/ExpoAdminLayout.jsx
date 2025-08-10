import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import styles from './ExpoAdminLayout.module.css';
import ExpoAdminHeader from "./header/ExpoAdminHeader";
import ExpoAdminSideBar from "./sidebar/ExpoAdminSidebar";
import { getMyExpos } from "../../api/service/expo-admin/AuthService";
import { jwtDecode } from 'jwt-decode';
import instance from "../../api/lib/axios";

function ExpoAdminLayout() {
  const [hasPermission, setHasPermission] = useState(null);
  const { expoId } = useParams();

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setHasPermission(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        
        if (decodedToken.loginType === 'ADMIN_CODE') {
          // AdminCode 로그인: 채팅 API로 권한 체크
          try {
            await instance.get(`/expos/${expoId}/chats/rooms`);
            setHasPermission(true);
          } catch (error) {
            console.error("AdminCode 권한 확인 실패:", error.message);
            setHasPermission(false);
          }
        } else {
          // MEMBER 로그인: 기존 로직
          const expos = await getMyExpos();
          const expoIdNumber = Number(expoId);
          setHasPermission(expos.includes(expoIdNumber));
        }
      } catch (error) {
        console.error("권한 확인 실패:", error.message);
        setHasPermission(false);
      }
    };
    checkPermission();
  }, [expoId]);

  if (hasPermission === null) return null;

  if (!hasPermission) return <NoAccessPage />; //권한 없음 페이지 렌더링

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

function NoAccessPage() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h2 style={{ fontSize: "1.75rem", color: "#d32f2f", marginBottom: "1rem" }}>
        [403 Forbidden] 접근 권한이 없습니다
      </h2>
      <p style={{ fontSize: "1rem", color: "#555" }}>
        이 박람회에 대한 관리 권한이 없습니다.
      </p>
    </div>
  );
}
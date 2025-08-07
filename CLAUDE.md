# MYCE 채팅 시스템 작업 완료 상황

## 프로젝트 정보
- **프로젝트**: MYCE (Museum Your Culture Events) 박람회 관리 플랫폼
- **구조**: React + Vite 프론트엔드, Spring Boot 백엔드
- **데이터베이스**: MySQL (기본), MongoDB (채팅)

## 완료된 작업 사항

### 1. WebSocket 연결 문제 해결 ✅
- **문제**: WebSocket 연결 실패 (error code 1006)
- **해결**: 
  - `vite.config.js`에 `define: { global: 'window' }` 추가
  - @stomp/stompjs + sockjs-client로 라이브러리 변경
  - SockJS fallback 프로토콜 사용

### 2. JWT 인증 수정 ✅
- **JWT 토큰 구조**: `memberId` 클레임 사용 (기존 `sub` 대신)
- **인증 로직**: CustomUserDetails에서 멤버 ID 추출 패턴 적용

### 3. API 엔드포인트 정정 ✅
- **변경**: `/api/chat/rooms` → `/api/chats/rooms`
- **이유**: CHAT_SYSTEM_README.md 문서 명세에 맞춤

### 4. 백엔드 WebSocket 컨트롤러 개선 ✅
- **파일**: `/myce-server/src/main/java/com/myce/chat/controller/ChatWebSocketController.java`
- **변경사항**:
  - DTO 캐스팅 제거, `Map<String, Object>` 파라미터 사용
  - 메시지 엔드포인트: `/app/message` → `/app/chat.send`
  - 에러 처리 및 로깅 개선
  - CHAT_SERVICE_ARCHITECTURE 패턴 준수

### 5. 프론트엔드 WebSocket 서비스 정리 ✅
- **파일**: `/myce-client/src/api/service/chat/ChatWebSocketService.jsx`
- **개선사항**:
  - JSDoc 문서화 추가
  - 메시지 페이로드 문서 명세 준수
  - 에러 처리 강화
  - 연결 상태 관리 개선

## 현재 상태
- ✅ WebSocket 연결 성공 ("STOMP CONNECTED" 로그 확인)
- ✅ 백엔드/프론트엔드 코드 정리 완료
- ✅ 문서 명세에 맞춘 구현 완료

## 주요 설정 파일

### Vite 설정
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window'  // 핵심: sockjs-client 에러 해결
  }
});
```

### WebSocket 메시지 형식
```json
{
  "roomId": "admin-123-456",
  "senderId": 456,
  "senderName": "사용자명",
  "message": "메시지 내용", 
  "sentAt": "2024-01-01T10:00:00Z"
}
```

## 다음 담당자를 위한 참고사항

### 1. 테스트 방법
```bash
# 백엔드 실행
cd /Users/g1/Desktop/MYCE/myce-server
./gradlew bootRun

# 프론트엔드 실행  
cd /Users/g1/Desktop/MYCE/myce-client
npm run dev
```

### 2. 주요 파일 위치
- **백엔드 WebSocket**: `/myce-server/src/main/java/com/myce/chat/controller/ChatWebSocketController.java`
- **프론트엔드 WebSocket**: `/myce-client/src/api/service/chat/ChatWebSocketService.jsx`
- **채팅 컨테이너**: `/myce-client/src/mainpage/components/chatcontainer/ChatContainer.jsx`
- **문서**: `/Users/g1/Desktop/MYCE/document_chat/CHAT_SYSTEM_README.md`

### 3. 현재 이슈
- 유저가 파일을 일부 되돌려서 API 엔드포인트가 다시 `/api/chat/rooms`로 변경됨
- `vite.config.js`에서 `define: { global: 'window' }` 제거됨 
- 이 설정들은 WebSocket 연결에 필수적이므로 복구 필요

### 4. 권장 다음 단계
1. API 엔드포인트 일치성 확인 (백엔드 `/api/chats/rooms`, 프론트엔드 동일)
2. `vite.config.js`에 global 정의 추가
3. 실제 메시지 송수신 테스트
4. MongoDB 연동 및 메시지 저장 기능 구현

---
**작업자**: Claude Code  
**마지막 업데이트**: 2025-08-07
import React, { useState, useEffect } from 'react';
import styles from './ChatContainer.module.css';
import instance from '../../../api/lib/axios';

export default function ChatContainer() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // 채팅방 목록 조회
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await instance.get('/chat/rooms');
        setChatRooms(response.data.chatRooms);
        if (response.data.chatRooms.length > 0) {
          setSelectedRoom(response.data.chatRooms[0]);
        }
      } catch (error) {
        console.error('채팅방 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  // 시간 포맷팅 함수
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (daysDiff === 1) {
      return '어제';
    } else {
      return `${daysDiff}일 전`;
    }
  };

  return (
    <div className={styles.chatWrapper}>
      {/* 좌측 채팅 리스트 */}
      <aside className={styles.chatList}>
        <h2>상담 채팅</h2>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
        ) : chatRooms.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            아직 채팅방이 없습니다.
          </div>
        ) : (
          <ul className={styles.chatRoomList}>
            {chatRooms.map((room) => (
              <li 
                key={room.roomCode} 
                className={`${styles.chatRoom} ${selectedRoom?.roomCode === room.roomCode ? styles.selected : ''}`}
                onClick={() => setSelectedRoom(room)}
              >
                <img src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx" alt="avatar" />
                <div className={styles.chatRoomText}>
                  <div>{room.expoTitle || '박람회명 없음'}</div>
                  <span>{formatTime(room.lastMessageAt)}</span>
                </div>
                {room.unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{room.unreadCount}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* 우측 채팅 내용 */}
      <main className={styles.chatArea}>
        {selectedRoom ? (
          <>
            <header className={styles.chatHeader}>
              {selectedRoom.expoTitle || '박람회명 없음'}
            </header>

            <section className={styles.chatMessages}>
              {selectedRoom.lastMessage ? (
                <div className={styles.messageRow}>
                  <img src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx" alt="avatar" />
                  <div className={styles.messageBubble}>{selectedRoom.lastMessage}</div>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  아직 메시지가 없습니다. 첫 메시지를 보내보세요!
                </div>
              )}
            </section>

            <footer className={styles.chatInput}>
              <input type="text" placeholder="메세지를 입력해주세요" />
              <button>전송</button>
            </footer>
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            color: '#666' 
          }}>
            {chatRooms.length === 0 ? '채팅방이 없습니다.' : '채팅방을 선택해주세요.'}
          </div>
        )}
      </main>
    </div>
  );
}

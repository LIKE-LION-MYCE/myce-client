import React from 'react';
import styles from './ChatContainer.module.css';

export default function ChatContainer() {
  return (
    <div className={styles.chatWrapper}>
      {/* 좌측 채팅 리스트 */}
      <aside className={styles.chatList}>
        <h2>상담 채팅</h2>
        <ul className={styles.chatRoomList}>
          {Array(12).fill().map((_, i) => (
            <li key={i} className={styles.chatRoom}>
              <img src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx" alt="avatar" />
              <div className={styles.chatRoomText}>
                <div>제7회 불교박람회</div>
                <span>10:04AM</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* 우측 채팅 내용 */}
      <main className={styles.chatArea}>
        <header className={styles.chatHeader}>
          제7회 불교박람회
        </header>

        <section className={styles.chatMessages}>
          {/* 예시 메시지 */}
          <div className={styles.messageRow}>
            <img src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx" alt="avatar" />
            <div className={styles.messageBubble}>Ever wondered how some graphic designers always manage to produce</div>
          </div>

          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>Freelance Design Tricks</div>
          </div>

          <div className={styles.messageRow}>
            <img src="https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f42d.png?fbx" alt="avatar" />
            <div className={styles.messageBubble}>Successful businesses have many things in common</div>
          </div>
          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>Business Success Tips</div>
          </div>
          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>UI Design Tricks</div>
          </div>
          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>테스트 메세지</div>
          </div>
          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>테스트 메세지</div>
          </div>
          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>테스트 메세지</div>
          </div>
          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>테스트 메세지</div>
          </div>
          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>테스트 메세지</div>
          </div>
          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>테스트 메세지</div>
          </div>
          <div className={styles.messageRow + ' ' + styles.me}>
            <div className={styles.myBubble}>테스트 메세지</div>
          </div>
        </section>

        <footer className={styles.chatInput}>
          <input type="text" placeholder="메세지를 입력해주세요" />
          <button>전송</button>
        </footer>
      </main>
    </div>
  );
}

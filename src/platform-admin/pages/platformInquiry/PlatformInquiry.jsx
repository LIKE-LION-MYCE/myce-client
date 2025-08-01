import { useState } from 'react';
import styles from './PlatformInquiry.module.css';

const dummyUsers = [
  { name: '김지현', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '이지우', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '박선우', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '김지현', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '이지우', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '박선우', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '김지현', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '이지우', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '박선우', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '김지현', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '이지우', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
  { name: '박선우', avatar: 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp' },
];

function PlatformInquiry() {
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [messages, setMessages] = useState([
    { text: '안녕하세요, 문의드립니다.', sender: 'user', time: '10:00 AM' },
    { text: '안녕하세요. 어떤 부분 도와드릴까요?', sender: 'admin', time: '10:02 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [...prev, { text: newMessage, sender: 'admin', time: '10:05 AM' }]);
    setNewMessage('');
  };

  return (
    <div className={styles.inquiryWrapper}>
      <div className={styles.sectionTitle}> 문의 내역 </div>
      <div className={styles.chatContainer}>
        {/* 좌측: 사용자 목록 */}
        <aside className={styles.sidebar}>
          <header className={styles.sidebarHeader}>상담자 목록</header>
          <ul className={styles.userList}>
            {dummyUsers.map((user, i) => (
              <li
                key={i}
                className={`${styles.userItem} ${i === selectedUserIndex ? styles.active : ''}`}
                onClick={() => setSelectedUserIndex(i)}
              >
                <img src={user.avatar} alt="유저" className={styles.avatar} />
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* 우측: 채팅창 */}
        <section className={styles.chatArea}>
          <header className={styles.chatHeader}>
            {dummyUsers[selectedUserIndex].name}님과의 상담
          </header>

          <div className={styles.chatBody}>
            {messages.map((msg, idx) => (
              <div key={idx} className={styles.messageRow}>
                <div className={msg.sender === 'user' ? styles.messageLeft : styles.messageRight}>
                  <div className={styles.messageBubble}>{msg.text}</div>
                  <span className={styles.time}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <footer className={styles.chatInputBox}>
            <input
              className={styles.input}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력해주세요"
            />
            <button className={styles.sendButton} onClick={handleSend}>전송</button>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default PlatformInquiry;

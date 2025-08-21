import { formatChatTime } from '../../../utils/timeUtils';
import styles from './SharedChatRoomList.module.css';

/**
 * Shared Chat Room List Component
 * 
 * Used by:
 * - User Chat (platform + expo rooms)
 * - Platform Admin Chat (platform rooms only)
 * - Expo Admin Chat (expo rooms only)
 * 
 * Props customize content while sharing UI/UX
 */
export default function SharedChatRoomList({
  // Data
  chatRooms,
  selectedRoom,
  loading,
  error,
  unreadCounts = {},
  
  // Callbacks
  onRoomSelect,
  onRefresh,
  
  // UI Customization
  title = "채팅 목록",
  emptyMessage = "채팅방이 없습니다",
  showRefreshButton = true,
  
  // Room display customization
  getRoomTitle,        // (room) => string
  getRoomSubtitle,     // (room) => string  
  getRoomAvatar,       // (room) => string
  getRoomBadges,       // (room) => JSX[]
  getRoomPriority,     // (room) => number (for sorting)
  getRoomClassName,    // (room) => string (custom CSS class)
  getRoomTitleClassName, // (room) => string (custom CSS class for title)
  
  // Filter function
  filterRooms,         // (rooms) => rooms
  
  // Custom room renderer (optional)
  renderRoom           // (room, isSelected, onSelect) => JSX
}) {
  // Apply filter if provided
  const filteredRooms = filterRooms ? filterRooms(chatRooms) : chatRooms;
  
  // Sort rooms by priority (if getRoomPriority provided) then by lastMessageAt
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (getRoomPriority) {
      const priorityA = getRoomPriority(a);
      const priorityB = getRoomPriority(b);
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }
    }
    
    // Sort by last message time
    const timeA = new Date(a.lastMessageAt || 0);
    const timeB = new Date(b.lastMessageAt || 0);
    return timeB - timeA;
  });

  // Default room title getter
  const getTitle = getRoomTitle || ((room) => 
    room.expoTitle || room.otherMemberName || '채팅방'
  );

  // Default room subtitle getter  
  const getSubtitle = getRoomSubtitle || ((room) =>
    room.lastMessage || '메시지가 없습니다'
  );

  // Default avatar getter
  const getAvatar = getRoomAvatar || ((room) =>
    room.avatar || 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4ac/emoji.svg' // Speech bubble emoji
  );

  // Default room renderer
  const defaultRenderRoom = (room, isSelected, onSelect) => {
    const unreadCount = unreadCounts[room.roomCode] || 0;
    const badges = getRoomBadges ? getRoomBadges(room) : [];
    const customClass = getRoomClassName ? getRoomClassName(room) : '';
    
    return (
      <li
        key={room.roomCode}
        className={`${styles.chatRoom} ${isSelected ? styles.selected : ''} ${customClass}`}
        onClick={() => onSelect(room)}
      >
        {/* Avatar */}
        <div className={styles.roomAvatar}>
          <img 
            src={getAvatar(room)} 
            alt="avatar"
            className={styles.avatar}
          />
          {badges.map((badge, index) => (
            <div key={index} className={styles.avatarBadge}>
              {badge}
            </div>
          ))}
        </div>

        {/* Room Info */}
        <div className={styles.roomInfo}>
          <div className={styles.roomHeader}>
            <div className={`${styles.roomTitle} ${getRoomTitleClassName ? getRoomTitleClassName(room) : ''}`}>
              {getTitle(room)}
            </div>
            <div className={styles.roomTime}>
              {room.lastMessageAt ? formatChatTime(room.lastMessageAt) : ''}
            </div>
          </div>
          
          <div className={styles.roomSubtitle}>
            {getSubtitle(room)}
          </div>
        </div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className={styles.unreadBadge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </li>
    );
  };

  const roomRenderer = renderRoom || defaultRenderRoom;

  if (error) {
    return (
      <div className={styles.chatRoomList}>
        <div className={styles.header}>
          <h2>{title}</h2>
          {showRefreshButton && (
            <button onClick={onRefresh} className={styles.refreshButton}>
              새로고침
            </button>
          )}
        </div>
        <div className={styles.errorState}>
          <p>채팅방을 불러오는데 실패했습니다</p>
          <button onClick={onRefresh} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatRoomList}>
      {/* Header */}
      <div className={styles.header}>
        <h2>{title}</h2>
        {showRefreshButton && (
          <button 
            onClick={onRefresh} 
            className={styles.refreshButton}
            disabled={loading}
          >
            {loading ? '로딩...' : '새로고침'}
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && sortedRooms.length === 0 && (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <p>채팅방을 불러오는 중...</p>
        </div>
      )}

      {/* Room List */}
      <ul className={styles.roomList}>
        {sortedRooms.length === 0 && !loading ? (
          <div className={styles.emptyState}>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          sortedRooms.map(room => 
            roomRenderer(
              room, 
              selectedRoom?.roomCode === room.roomCode,
              onRoomSelect
            )
          )
        )}
      </ul>
    </div>
  );
}
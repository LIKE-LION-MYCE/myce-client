/**
 * Enhanced timestamp formatting utilities for chat messages
 */

/**
 * Format timestamp with smart date display
 * - Today: "오후 2:30"
 * - Yesterday: "어제 오후 2:30" 
 * - This week: "화 오후 2:30"
 * - Older: "8월 13일 오후 2:30"
 */
export const formatChatTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Get start of today (00:00) and yesterday
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  // Check if message is from today, yesterday, or older
  const isToday = date >= today;
  const isYesterday = date >= yesterday && date < today;
  
  const timeStr = date.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
  
  if (isToday) {
    // Today - show time only
    return timeStr;
  } else if (isYesterday) {
    // Yesterday - show "어제" + time
    return `어제 ${timeStr}`;
  } else {
    // Calculate days difference for older messages
    const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      // Within a week - show day of week + time
      const dayName = date.toLocaleDateString('ko-KR', { weekday: 'short' });
      return `${dayName} ${timeStr}`;
    } else {
      // Older than a week - show full date + time
      const dateStr = date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      });
      return `${dateStr} ${timeStr}`;
    }
  }
};

/**
 * Simple time formatting (legacy - for backwards compatibility)
 */
export const formatSimpleTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
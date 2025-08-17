import instance from '../../lib/axios';

// 알림 목록 조회
export const getNotifications = async () => {
  try {
    const response = await instance.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
    throw error;
  }
};

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await instance.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
    throw error;
  }
};

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await instance.put('/notifications/read-all');
    return response.data;
  } catch (error) {
    console.error('모든 알림 읽음 처리 실패:', error);
    throw error;
  }
};
import instance from '../../../lib/axios';

// 행사 목록 조회 (관리자용)
export const getEvents = async (expoId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/events/admin`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || '행사 목록 조회 중 오류 발생';
    throw new Error(message);
  }
};

// 행사 목록 조회 (공개용 - 비회원 접근 가능)
export const getPublicEvents = async (expoId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/events`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || '행사 목록 조회 중 오류 발생';
    throw new Error(message);
  }
};

// 행사 등록
export const addEvent = async (expoId, eventData) => {
  try {
    const response = await instance.post(
      `/expos/${expoId}/events`,
      eventData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('행사 등록 중 오류 발생');
  }
};

// 행사 수정
export const updateEvent = async (expoId, eventId, eventData) => {
  try {
    const response = await instance.put(
      `/expos/${expoId}/events/${eventId}`,
      eventData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('행사 수정 중 오류 발생');
  }
};

// 행사 삭제
export const deleteEvent = async (expoId, eventId) => {
  try {
    await instance.delete(`/expos/${expoId}/events/${eventId}`);
  } catch (error) {
    const message = error.response?.data?.message || '행사 삭제 중 오류 발생';
    throw new Error(message);
  }
};

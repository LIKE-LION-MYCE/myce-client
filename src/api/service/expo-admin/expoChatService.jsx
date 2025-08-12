import instance from "../../lib/axios";

/**
 * 박람회 관리자용 채팅 API 서비스
 */

/**
 * 해당 박람회의 채팅방 목록 조회
 */
const getExpoChatRooms = async (expoId) => {
    return await instance.get(`/expos/${expoId}/chats/rooms`);
}

/**
 * 특정 채팅방의 메시지 히스토리 조회
 * @param {number} expoId - 박람회 ID
 * @param {string} roomCode - 채팅방 코드 (admin-{expoId}-{userId})
 * @param {object} params - 페이징 파라미터 (page, size)
 * @returns {Promise} API 응답
 */
const getExpoChatMessages = async (expoId, roomCode, params = {}) => {
    return await instance.get(`/expos/${expoId}/chats/rooms/${roomCode}/messages`, {
        params: params
    });
}

/**
 * 관리자가 메시지를 읽음으로 처리
 * @param {number} expoId - 박람회 ID
 * @param {string} roomCode - 채팅방 코드
 * @param {string} lastReadMessageId - 마지막 읽은 메시지 ID
 * @returns {Promise} API 응답
 */
const markExpoChatAsRead = async (expoId, roomCode, lastReadMessageId) => {
    return await instance.post(`/expos/${expoId}/chats/rooms/${roomCode}/read`, {
        lastReadMessageId: lastReadMessageId
    });
}

/**
 * 특정 채팅방의 안읽은 메시지 개수 조회
 * @param {number} expoId - 박람회 ID
 * @param {string} roomCode - 채팅방 코드
 * @returns {Promise} API 응답
 */
const getExpoChatUnreadCount = async (expoId, roomCode) => {
    return await instance.get(`/expos/${expoId}/chats/rooms/${roomCode}/unread-count`);
}

export {
    getExpoChatRooms,
    getExpoChatMessages,
    markExpoChatAsRead,
    getExpoChatUnreadCount
};
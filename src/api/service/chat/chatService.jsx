import instance from "../../lib/axios";

const CHAT_PREFIX = "/chats";

const getChatRooms = async () => {
    return await instance.get(`${CHAT_PREFIX}/rooms`);
}

const getChatMessages = async (roomCode, page = 0, size = 50) => {
    return await instance.get(`${CHAT_PREFIX}/rooms/${roomCode}/messages`, {
        params: { page, size }
    });
}

const getUnreadCount = async (roomCode) => {
    return await instance.get(`${CHAT_PREFIX}/rooms/${roomCode}/unread-count`);
}

const getAllUnreadCounts = async () => {
    return await instance.get(`${CHAT_PREFIX}/rooms/unread-counts`);
}

const markAsRead = async (roomCode, expoId = null) => {
    // 사용자는 항상 ChatRoomController 사용 (플랫폼/박람회 구분 없이)
    // ExpoChatController는 관리자 전용
    return await instance.post(`${CHAT_PREFIX}/rooms/${roomCode}/read`, {});
}

const getOrCreateExpoChatRoom = async (expoId) => {
    return await instance.post(`${CHAT_PREFIX}/expo/${expoId}/room`);
}

export {
    getChatRooms,
    getChatMessages,
    getUnreadCount,
    getAllUnreadCounts,
    markAsRead,
    getOrCreateExpoChatRoom
};
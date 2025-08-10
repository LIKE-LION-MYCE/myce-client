import instance from "../../lib/axios";

const CHAT_PREFIX = "/chats";

const getChatRooms = async () => {
    return await instance.get(`${CHAT_PREFIX}/rooms`);
}

const getChatMessages = async (roomCode) => {
    return await instance.get(`${CHAT_PREFIX}/rooms/${roomCode}/messages`);
}

const getUnreadCount = async (roomCode) => {
    return await instance.get(`${CHAT_PREFIX}/rooms/${roomCode}/unread-count`);
}

const getAllUnreadCounts = async () => {
    return await instance.get(`${CHAT_PREFIX}/rooms/unread-counts`);
}

const markAsRead = async (roomCode) => {
    return await instance.post(`${CHAT_PREFIX}/rooms/${roomCode}/read`, {});
}

export {
    getChatRooms,
    getChatMessages,
    getUnreadCount,
    getAllUnreadCounts,
    markAsRead
};
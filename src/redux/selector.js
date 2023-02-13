export const conversationFromChatListSelector = (state, chatRoomIdParam) => {
    return state.chatRoomList.find(chatRoom => chatRoom.chatroomId === chatRoomIdParam)
}

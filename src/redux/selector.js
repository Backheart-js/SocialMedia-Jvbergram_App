export const rememberPasswordSelector = (state) => {
    return state.remember_password
}

export const conversationFromChatListSelector = (state, chatRoomIdParam) => {
    return state.chatRoomList.find(chatRoom => chatRoom.chatroomId === chatRoomIdParam)
}

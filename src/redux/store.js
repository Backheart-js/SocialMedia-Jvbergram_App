import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './slice/modalSlide';
import profileSlice from './slice/profileSlice';
import conversationSlice from './slice/conversationSlice';
import chatRoomListSlice from './slice/chatRoomListSlice';
import notificationSlice from './slice/notificationSlice';
import themeSlice from './slice/themeSlice';

const store = configureStore({
    reducer: {
        modal: modalSlice.reducer,
        profile: profileSlice.reducer,
        conversation: conversationSlice.reducer,
        chatRoomList: chatRoomListSlice.reducer,
        notification: notificationSlice.reducer,
        theme: themeSlice.reducer
    }
})

export default store;
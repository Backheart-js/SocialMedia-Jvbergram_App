import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './slice/modalSlide';
import passwordSlide from './slice/passwordSlide';
import profileSlice from './slice/profileSlice';
import conversationSlice from './slice/conversationSlice';
import chatRoomListSlice from './slice/chatRoomListSlice';
import notificationSlice from './slice/notificationSlice';

const store = configureStore({
    reducer: {
        remember_password: passwordSlide.reducer,
        modal: modalSlice.reducer,
        profile: profileSlice.reducer,
        conversation: conversationSlice.reducer,
        chatRoomList: chatRoomListSlice.reducer,
        notification: notificationSlice.reducer
    }
})

export default store;
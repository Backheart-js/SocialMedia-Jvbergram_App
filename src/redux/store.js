import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './slice/modalSlide';
import passwordSlide from './slice/passwordSlide';
import profileSlide from './slice/profileSlice';

const store = configureStore({
    reducer: {
        remember_password: passwordSlide.reducer,
        modal: modalSlice.reducer,
        profile: profileSlide.reducer
    }
})

export default store;
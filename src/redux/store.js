import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './slice/modalSlide';
import passwordSlide from './slice/passwordSlide';

const store = configureStore({
    reducer: {
        remember_password: passwordSlide.reducer,
        modal: modalSlice.reducer
    }
})

export default store;
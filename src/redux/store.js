import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice';
import firebaseSlice from './slice/firebaseSlice';
import modalSlice from './slice/modalSlide';
import passwordSlide from './slice/passwordSlide';

const store = configureStore({
    reducer: {
        firebase: firebaseSlice.reducer,
        authentication: authSlice.reducer,
        remember_password: passwordSlide.reducer,
        modal: modalSlice.reducer
    }
})

export default store;